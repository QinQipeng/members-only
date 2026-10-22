import { type Message } from "./schemas.ts";
import { pool as db } from "./database.ts";
import { DatabaseError } from "pg";

type NewMessage = Omit<Message, "created_at" | "id">;

async function getMessageById(id: string): Promise<Message | undefined> {
  const { rows } = await db.query<Message>({
    text: "SELECT * FROM messages WHERE id = $1",
    values: [id],
  });

  return rows.length == 0 ? undefined: rows[0];
}

async function getAllMessages(): Promise<Message[]> {
  const { rows } = await db.query<Message>({
    text: "SELECT * FROM messages",
  });

  return rows;
}

async function createNewMessage(newMsg: NewMessage): Promise<void> {
  try {
    const qry = {
      text: `INSERT INTO messages (${Object.keys(newMsg).join()}) VALUES (${Object.keys(newMsg).map((_, idx) => `$${idx + 1}`)})`,
      values: Object.values(newMsg),
    };
    await db.query<Message>(qry);
  } catch (err: DatabaseError | Error | unknown) {
    throw new Error(String(err));
  }
}

async function deleteMessage(msgId: string): Promise<void> {
  try {
    await db.query<Message>({
      text: `DELETE FROM messages WHERE id = $1;`,
      values: [msgId],
    });
  } catch (err: DatabaseError | Error | unknown) {
    throw new Error(String(err));
  }
}

export default {
  getMessageById,
  getAllMessages,
  createNewMessage,
  deleteMessage,
};
