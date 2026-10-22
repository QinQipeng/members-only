import { Router } from "express"
import msgController from "../controllers/msgController.ts";

const msgRouter = Router();

msgRouter.get("/", msgController.getAllUserMsgs)
msgRouter.post('/messages', msgController.sendUserMsg)
msgRouter.get('/deleteMsg/:id', msgController.deleteUsrMsg)

export default msgRouter