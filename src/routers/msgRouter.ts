import { Router } from "express"
import msgController from "../controllers/msgController.ts";

const msgRouter = Router();

msgRouter.get("/", msgController.getAllUserMsgs)
msgRouter.post('/messages', msgController.sendUserMsg)

export default msgRouter