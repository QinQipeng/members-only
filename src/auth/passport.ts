import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import usrQueries from "../models/usrQueries.ts";
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
    const user = await usrQueries.getUserByEmail(username);
    if (!user) {
      return done(null, false, { message: authenErrorMsg });
    }

    const isValid = await bcrypt.compare(password, String(user.hashed_pwd));
    return isValid
      ? done(null, user)
      : done(null, false, { message: authenErrorMsg });
  } catch (err) {
    return done(err);
  }
};

passport.serializeUser((user: User | any, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await usrQueries.getUserById(String(id));
    if (!user) {
      return done(null, false);
    }

    const {
      first_name: firstName,
      last_name: lastName,
      is_active: isActive,
      is_admin: isAdmin,
      ...restInfo
    } = user;

    done(null, {
      firstName,
      lastName,
      isActive,
      isAdmin,
      ...restInfo,
    });
  } catch (err) {
    done(err);
  }
});

passport.use(new LocalStrategy(customFields, verifyCallback));
