import bcrypt from "bcryptjs";
import passport from "passport";
import { pool as db } from "../models/database.ts";
import { body, validationResult } from "express-validator";
import { type Request, type Response, type NextFunction } from "express";

const alphaErr = "must only contain letters.";
const lengthErr = "must be between 1 and 10 characters.";
const emailErr = "is not a valid email address (e.g: joedoe@example.com)"
const pwdErr = "Your Password must be at least 8 chars long"

const validateSignUp = [
  body("firstName")
    .trim()
    .escape()
    .isAlpha()
    .withMessage(`First name ${alphaErr}`)
    .isLength({ min: 1, max: 10 })
    .withMessage(`First name ${lengthErr}`),
  body("lastName")
    .trim()
    .escape()
    .isAlpha()
    .withMessage(`Last name ${alphaErr}`)
    .isLength({ min: 1, max: 10 })
    .withMessage(`Last name ${lengthErr}`),
  body("email")
    .toLowerCase()
    .isEmail()
    .withMessage((value) => `"${value}" ${emailErr}`),
  body("password")
    .trim()
    .escape()
    .isLength({ min: 8})
    .withMessage(pwdErr),
  body("pwdConfirm")
    .trim()
    .escape()
    .custom((value, { req }) => {
      if (req.body?.password != value) throw new Error("Password confirmation does not match password");
      return true      
    })
]

function authLoginGet(req: Request, res: Response, next: NextFunction) {
  res.render("login", {errors: req.flash("error")});
}

const authLoginPost = [
  passport.authenticate("local", {
    successRedirect: "/",
    failureRedirect: "/login",
    failureFlash: true,
    failureMessage: true,
  }),
];

function authSignUpGet(req: Request, res: Response, next: NextFunction) {
  const error_messages = req.flash('validation_errors');
  res.render("sign-up", {errors: error_messages});
}

const authRegisterPost = [
  ...validateSignUp,
  (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const errorMessages = errors.array().map(err => err.msg);
      req.flash('validation_errors', errorMessages);
      return res.redirect("/sign-up")
    }
    next()
  },
  async function (req: Request, res: Response, next: NextFunction) {
    try {
      const hashedPassword = await bcrypt.hash(req.body.password, 10);
      const execQuery = {
        text: `INSERT INTO users (first_name, last_name, email, hashed_pwd, memb_stat, is_admin) VALUES ($1, $2, $3, $4, 'active', FALSE)`,
        values: [
          req.body.firstName,
          req.body.lastName,
          req.body.email,
          hashedPassword,
        ],
      };
      await db.query(execQuery);
      res.redirect("/");
    } catch (err) {
      return next(err);
    }
  },
];

function authLogoutGet(req: Request, res: Response, next: NextFunction) {
  req.logout((err) => {
    if (err) {
      return next(err);
    }
    res.redirect("/");
  });
}

export default {
  authLoginGet,
  authLoginPost,
  authSignUpGet,
  authRegisterPost,
  authLogoutGet,
};
