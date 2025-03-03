// lib/db.js
import mysql from "mysql2/promise";

const pool = mysql.createPool({
  host: "localhost", // e.g., "localhost"
  user: "u226954130_usermenu", // your DB username
  password: "ERblqN#nn[y3", // your DB password
  database: "u226954130_onlinemenu", // your DB name
  waitForConnections: true,
  connectionLimit: 10, // adjust based on your requirements
  queueLimit: 0,
});

export default pool;
