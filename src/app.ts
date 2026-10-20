import "./auth/passport.ts"
import path from "node:path";
import express, { type Request, type Response, type NextFunction } from "express";
import passport from "passport";
import flash from "connect-flash";
import session from "express-session";
import pgSession from 'connect-pg-simple'
import authRouter from "./routers/authRouter.ts";
import { pool as db, testConnection } from './models/database.ts'

const app = express();

const __dirname = import.meta.dirname;
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

const PostgresStore = pgSession(session)
testConnection()

app.use(session({
  store: new PostgresStore({
    pool: db,
  }),
  secret: "cats",
  resave: false,
  saveUninitialized: false,
  cookie: { maxAge: 24 * 60 * 60 * 1000 }
}))
app.use(passport.session())
app.use(express.urlencoded({ extended: false }));

app.use(flash()); 

app.use(authRouter)

app.get("/", (req, res) => {
  if (!req.user) {
    res.redirect("/login");
    return 
  }
  res.render("index", { user: req.user });
});

const PORT = 3000;
app.listen(PORT, (error) => {
    if (error) throw error;

    console.log(`Members Only Application - listening on port ${PORT}!`);
})