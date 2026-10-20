import { Router } from "express"
import authController from "../controllers/authController.ts";

const authRouter = Router();

authRouter.get('/login', authController.authLoginGet);
authRouter.post('/login', authController.authLoginPost);
authRouter.get('/sign-up', authController.authSignUpGet);
authRouter.post('/sign-up', authController.authRegisterPost);
authRouter.get("/log-out", authController.authLogoutGet);

export default authRouter