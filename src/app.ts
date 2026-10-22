import "./auth/passport.ts"
import path from "node:path";
import express, { type Request, type Response, type NextFunction } from "express";
import passport from "passport";
import flash from "connect-flash";
import session from "express-session";
import pgSession from 'connect-pg-simple';
import { randomBytes } from "node:crypto";

import authRouter from "./routers/authRouter.ts";
import userRouter from "./routers/usrRouter.ts";
import msgRouter from "./routers/msgRouter.ts";

import { pool as db, testConnection } from './models/database.ts'

const app = express();

const __dirname = import.meta.dirname;
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

const PostgresStore = pgSession(session)
testConnection()

process.loadEnvFile();
app.use(session({
  store: new PostgresStore({
    pool: db,
  }),
  secret: randomBytes(32).toString('hex'),
  resave: false,
  saveUninitialized: false,
  cookie: { maxAge: 24 * 60 * 60 * 1000 }
}))
app.use(passport.session())
app.use(express.urlencoded({ extended: false }));

app.use(flash()); 

app.use(authRouter);
app.use(userRouter);
app.use(msgRouter);

const PORT = 3000;
app.listen(PORT, (error) => {
    if (error) throw error;

    console.log(`Members Only Application - listening on port ${PORT}!`);
})