import express from "express";
import passport from "passport";
import session from "express-session";
import pgSession from 'connect-pg-simple'
import { pool as db, testConnection } from './models/database.ts'

const app = express();
app.use(express.urlencoded({ extended: true }));

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

import "./auth/passport.ts"
app.use(passport.initialize())
app.use(passport.session())

const PORT = 3000;
app.listen(PORT, (error) => {
    if (error) throw error;

    console.log(`Express Node Template - listening on port ${PORT}!`);
})