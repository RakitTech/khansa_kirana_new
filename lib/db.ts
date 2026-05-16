import mysql from "mysql2/promise";

const pool = mysql.createPool({
  host: process.env.DB_HOST ?? "localhost",
  port: Number(process.env.DB_PORT ?? 3306),
  user: process.env.DB_USER ?? "root",
  password: process.env.DB_PASSWORD ?? "",
  database: process.env.DB_NAME ?? "khansa_collection",
  ...(process.env.DB_SOCKET ? { socketPath: process.env.DB_SOCKET } : {}),
  waitForConnections: true,
  connectionLimit: 10,
  timezone: "+07:00",
});

export default pool;
