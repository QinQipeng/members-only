import { pool as db } from "./database.ts";
import { type User } from "./schemas.ts";

type NewUser = {
  first_name: string;
  last_name: string;
  email: string;
  hashed_pwd: string;
};

async function getUserById(id: string): Promise<User | undefined> {
  const { rows } = await db.query<User>({
    text: "SELECT * FROM users WHERE id = $1",
    values: [id],
  });

  return rows.length == 0 ? undefined: rows[0];
}

async function getUserByEmail(email: string): Promise<User | undefined> {
  const { rows } = await db.query<User>({
    text: "SELECT * FROM users WHERE email = $1",
    values: [email],
  });
  return rows.length == 0 ? undefined: rows[0];
}

async function createUser(user: NewUser): Promise<void> {
  try {
    await db.query({
      text: `INSERT INTO users (first_name, last_name, email, hashed_pwd, is_active, is_admin)
        VALUES ($1, $2, $3, $4, FALSE, FALSE)`,
      values: [user.first_name, user.last_name, user.email, user.hashed_pwd],
    });
  } catch (err: Error | unknown) {
    throw new Error(String(err))
  }
}

async function activateUser(id: string) {
  try {
    await db.query({
      text: `UPDATE users SET is_active = true WHERE id = $1`,
      values: [id],
    });
  } catch (err: Error | unknown) {
    throw new Error(String(err))
  }
}

export default { getUserById, getUserByEmail, createUser, activateUser };
