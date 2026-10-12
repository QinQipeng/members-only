import passport from "passport";
import bcrypt from "bcryptjs";
import {pool as db} from "../models/database.ts"
import { type Request, type Response, type NextFunction } from "express"

const authLoginPost = [
  passport.authenticate('local',{
    successRedirect: "/",
    failureRedirect: "/",
    failureMessage: true,
  })
]

async function authRegisterPost(req: Request, res: Response, next: NextFunction) {
  try {
    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    await db.query("INSERT INTO users (username, password) VALUES ($1, $2)", [
      req.body.email,
      hashedPassword,
    ]);
    res.redirect("/");
  } catch (err) {
    return next(err);
  }
}

function authLogoutGet (req: Request, res: Response, next: NextFunction) {
  req.logout((err) => {
    if (err) {
      return next(err);
    }
    res.redirect("/");
  });
}

export default {
  authLoginPost,
  authRegisterPost,
  authLogoutGet
}