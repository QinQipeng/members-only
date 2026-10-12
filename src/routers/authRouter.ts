import { Router } from "express"
import authController from "../controllers/authController.ts";

const authRouter = Router();

authRouter.post('/login', authController.authLoginPost)
authRouter.post('/register', authController.authRegisterPost)
authRouter.get("/log-out", authController.authLogoutGet);

export default authRouter