import msgStorage from "../models/msgQueries.ts";
import usrStorage from "../models/usrQueries.ts";
import { body, matchedData, param, validationResult } from "express-validator";
import { type Request, type Response, type NextFunction } from "express";
import { User } from "../models/schemas.ts";
import { format } from "date-fns";

const sanitizeMsg = [
  body("title").trim().escape(),
  body("content").trim().escape(),
];

type MsgsResponse = {
  id: string;
  title: string;
  content: string;
  senderName: string;
  senderId: string;
  createdAt: string;
};

const getAllUserMsgs = async (req: Request, res: Response) => {
  if (!req.user) {
    res.redirect("/login");
    return;
  }

  const messages = await msgStorage.getAllMessages();
  const senders = (await Promise.all(
    messages.map((msg) => usrStorage.getUserById(String(msg.owner_id))),
  )) as User[];

  const msgsRes: MsgsResponse[] = [];

  messages.forEach((msg, idx) => {
    const { owner_id: senderId, created_at, ...restAttr } = msg;

    msgsRes.push({
      senderName: `${senders[idx]?.first_name} ${senders[idx]?.last_name}`,
      senderId,
      createdAt: format(created_at, "yyyy-MM-dd HH:mm:ss"),
      ...restAttr,
    });
  });

  res.render("index", { user: req.user, msgs: msgsRes });
};

const sendUserMsg = [
  ...sanitizeMsg,
  (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      res.redirect("/");
      return;
    }
    next();
  },
  async (req: Request, res: Response) => {
    const user = req.user as User;
    const newMessage = matchedData(req);

    await msgStorage.createNewMessage({
      owner_id: user.id,
      title: newMessage.title,
      content: newMessage.content,
    });

    res.redirect("/");
  },
];

const deleteUsrMsg = [
  param("id")
    .isUUID()
    .custom(async (id) => {
      const msg = await msgStorage.getMessageById(id);
      if (!msg) throw new Error("Message to delete does not exist");
      return true;
    }),
  async (req: Request, res: Response) => {
    const errors = validationResult(req);
    console.log(errors)

    const user = req.user as User;
    const { id } = matchedData(req);
    if (!(user && user.is_admin && errors.isEmpty())) {
      await msgStorage.deleteMessage(id);
    }
    res.redirect("/");
  },
];

export default {
  sendUserMsg,
  getAllUserMsgs,
  deleteUsrMsg,
};
