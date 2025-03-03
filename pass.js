const mysql = require("mysql2/promise");
const bcrypt = require("bcryptjs");

// MySQL Database Connection
const pool = mysql.createPool({
  host: "localhost", // Change to your DB host
  user: "root", // Change to your MySQL username
  password: "", // Change to your MySQL password
  database: "onlinemenu", // Change to your database name
  waitForConnections: true,
  connectionLimit: 10,
});

// Function to insert a new user
async function insertUser(username, password, role = "user") {
  try {
    // Check if user already exists
    const [existingUsers] = await pool.execute(
      "SELECT * FROM users WHERE username = ?",
      [username]
    );

    if (existingUsers.length > 0) {
      console.log("❌ User already exists!");
      return;
    }

    // Hash password
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Insert user into database
    const [result] = await pool.execute(
      "INSERT INTO users (username, password, role) VALUES (?, ?, ?)",
      [username, hashedPassword, role]
    );

    console.log("✅ User registered successfully! User ID:", result.insertId);
  } catch (error) {
    console.error("Error inserting user:", error);
  } finally {
    pool.end(); // Close database connection
  }
}

// Run the function
insertUser("admin123", "admin123", "admin"); // Change credentials as needed
