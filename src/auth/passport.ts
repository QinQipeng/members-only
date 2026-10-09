import passport from "passport"
import { Strategy as LocalStrategy } from "passport-local"
import { pool as db } from "../models/database.ts"

const verifyCallback = (username, password, done) => {
  
}

const strategy = new LocalStrategy();
