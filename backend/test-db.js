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

    //  const [results] = await sequelize.query("SHOW TABLES");

    // console.log("\n📦 DATABASE TABLES:");
    // console.table(results);

    //show db
 const [dbs] = await sequelize.query("SHOW DATABASES");
    console.log("📦 DATABASES:", dbs);

//show tables
    const [tables] = await sequelize.query("SHOW TABLES");
    console.log("📦 TABLES:", tables);


  } catch (err) {
    console.error("❌ Connection FAILED:", err);

     } finally {
    await sequelize.close();
  }
})();