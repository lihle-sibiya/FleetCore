// server.js

'use strict';

const express = require('express');
const {connectDB} = require('./config/db');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
require('dotenv').config();

const app = express();

app.use(cors({ origin: process.env.FRONTEND_URL || '*' }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/api/', rateLimit({ windowMs: 15 * 60 * 1000, max: 100 }));

app.use('/api/auth', require('./routes/authRoute'));
app.use('/api/companies', require('./routes/companiesRoute'));
app.use('/api/vehicles', require('./routes/vehiclesRoute'));
app.use('/api/drivers', require('./routes/driversRoute'));
app.use('/api/invoices', require('./routes/invoicesRoute'));
app.use('/api/dashboard', require('./routes/dashboardRoute'));

app.get('/health', (_, res) => res.json({ status: 'ok', time: new Date(), app: 'FleetCore' }));

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Server error', error: err.message });
});

connectDB().then(() => {

    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => console.log(`🚀 FleetCore API running on port ${PORT}`));

    // Start reminder cron job
    const { startReminderJob } = require('./utils/reminderCron');
    startReminderJob();
  })
  .catch((err) => { console.error('Database connection error:', err); process.exit(1); });



//   // app.js
// const express = require('express');
// const pool    = require('./config/db');
// require('dotenv').config();

// const app = express();
// app.use(express.json());

// // Test route — checks DB connection
// app.get('/ping', async (req, res) => {
//   try {
//     const [rows] = await pool.query('SELECT 1 + 1 AS result');
//     res.json({ status: 'DB connected', result: rows[0].result });
//   } catch (err) {
//     res.status(500).json({ status: 'DB connection failed', error: err.message });
//   }
// });

// const PORT = process.env.PORT || 3000;
// app.start = () => app.listen(PORT, () => {
//   console.log(`FleetCore running on http://localhost:${PORT}`);
// });

// app.start();

// module.exports = app;