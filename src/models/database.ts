import { Pool } from "pg"

process.loadEnvFile()

const testConnection = () => pool.connect((err, client, release) => {
  if (err) {
    return console.error('❌ Database connection error:', err.stack);
  }
  console.log('✅ Database connected successfully!');
  release();
})

const pool = new Pool({
    connectionString: process.env.PGCONNECTIONSTR
})

export { 
  pool, 
  testConnection
};