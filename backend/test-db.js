require('dotenv').config();
const { Sequelize } = require('sequelize');

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    dialect: 'mysql',
    logging: false,
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false
      }
    }
  }
);

(async () => {
  try {
    await sequelize.authenticate();
    console.log("✅ Aiven connection SUCCESS");
  } catch (err) {
    console.error("❌ Connection FAILED:", err);
  }
})();