import { Pool } from "pg"

process.loadEnvFile()

export default new Pool({
    connectionString: process.env.PGCONNECTIONSTR
})