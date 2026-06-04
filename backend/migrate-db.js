require('dotenv').config();
const fs = require('fs');
const path = require('path');
const mysql = require('mysql2/promise');

// const SQL_DIR = "C:/fleetcore.sql";
const SQL_DIR = path.join(__dirname, "../sql"); // relative path to sql folder

async function runMigration() {
  let connection;

  try {
    console.log("🚀 Starting folder-based migration to Aiven...");

    connection = await mysql.createConnection({
      host: process.env.DB_HOST,
      port: process.env.DB_PORT,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      multipleStatements: true,
      ssl: {
        rejectUnauthorized: false
      }
    });

    console.log("✅ Connected to Aiven MySQL");

    // Get all .sql files in folder
    const files = fs.readdirSync(SQL_DIR)
      .filter(file => file.endsWith(".sql"));

    console.log(`📦 Found ${files.length} SQL files`);

    for (const file of files) {
      const filePath = path.join(SQL_DIR, file);

      console.log(`➡️ Importing: ${file}`);

      const sql = fs.readFileSync(filePath, "utf8");

      await connection.query(sql);
    }

    console.log("🎉 ALL TABLES MIGRATED SUCCESSFULLY!");

  } catch (err) {
    console.error("❌ Migration failed:", err);
  } finally {
    if (connection) await connection.end();
  }
}

runMigration();