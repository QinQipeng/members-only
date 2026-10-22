import storage from "../models/usrQueries.ts";
import { type Request, type Response, type NextFunction } from "express";

let attempts = 0

const userActviateGet = async (req: Request, res: Response) => {
  res.locals.attempts = attempts++
  res.render("secret", {
    user: req.user
  });
};

const userActviatePost = async (req: Request, res: Response) => {
  const passcode = req.body.secret;
  process.loadEnvFile()

  if (passcode != process.env.APP_SECRET) {
    res.redirect(`/activate/${req.params.id}`);
    return
  }

  await storage.activateUser(req.params.id as string);
  res.redirect("/")
};

export default {
  userActviateGet,
  userActviatePost,
};
