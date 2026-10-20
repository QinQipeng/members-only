import { Pool } from "pg"

process.loadEnvFile()

const { PGUSER, PGPASSWORD, PGHOST, PGDATABASE, PGPORT, PGSSLMODE, PGCHANNELBINDING, PGCONNECTIONSTR } = process.env
const connectionString: string = PGCONNECTIONSTR ?? `postgresql://${PGUSER}:${PGPASSWORD}@${PGHOST}/${PGDATABASE}`

const testConnection = () => pool.connect((err, client, release) => {
  if (err) {
    return console.error('❌ Database connection error:', err.stack);
  }
  console.log('✅ Database connected successfully!');
  release();
})

const pool = new Pool({
    connectionString: connectionString,
    port: parseInt(PGPORT ?? "5432"),
    ssl: PGSSLMODE == "required" ? true : false,
    enableChannelBinding: PGCHANNELBINDING == "required" ? true : false,
})

export { 
  pool, 
  testConnection
};