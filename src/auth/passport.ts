import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import { pool as db } from "../models/database.ts";
import bcrypt from "bcryptjs";
import { User } from "../models/schemas.ts";

const authenErrorMsg = "Authenticating Failed: Invalid User Email or Password";

const customFields = {
  usernameField: "email",
};

const verifyCallback = async (
  username: string,
  password: string,
  done: Function,
) => {
  try {
    const sql = `SELECT * FROM users where email = $1`;
    const { rows } = await db.query({
      text: sql,
      values: [username],
    });

    const user = rows[0];

    if (!user) {
      return done(null, false, { message: authenErrorMsg });
    }

    const isValid = await bcrypt.compare(password, user.hashed_pwd);

    return isValid
      ? done(null, user)
      : done(null, false, { message: authenErrorMsg });
  } catch (err) {
    return done(err);
  }
};

passport.use(new LocalStrategy(customFields, verifyCallback));

passport.serializeUser((user: User | any, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const { rows } = await db.query({
      text: "SELECT * FROM users WHERE id = $1",
      values: [id],
    });
    const user = rows[0];

    done(null, user);
  } catch (err) {
    done(err);
  }
});
