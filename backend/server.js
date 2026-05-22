'use strict';

require('dotenv').config();
const express    = require('express');
const cors       = require('cors');
const rateLimit  = require('express-rate-limit');
const path       = require('path');
const { connectDB } = require('./config/db');
require('./models');


const app = express();

app.use(cors({ origin: process.env.FRONTEND_URL || '*' }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Rate limiter applied only to /api/* routes — NOT as a catch-all on /api/
const apiLimiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 200 });

// Serve uploaded documents statically
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// ── Routes ───────────────────────────────────────────────────────────────────
app.use('/api/auth',         apiLimiter, require('./routes/authRoute'));
app.use('/api/dealerships',  apiLimiter, require('./routes/dealershipsRoute'));
app.use('/api/customers',    apiLimiter, require('./routes/customersRoute'));
app.use('/api/vehicles',     apiLimiter, require('./routes/vehiclesRoute'));
app.use('/api/applications', apiLimiter, require('./routes/applicationsRoute'));
app.use('/api/documents',    apiLimiter, require('./routes/documentsRoute'));
app.use('/api/invoices',     apiLimiter, require('./routes/invoicesRoute'));
app.use('/api/dashboard',    apiLimiter, require('./routes/dashboardRoute'));

// ── Health check ─────────────────────────────────────────────────────────────
app.get('/health', (_, res) =>
  res.json({ status: 'ok', time: new Date(), app: 'FleetCore' })
);

// ── Catch-all for undefined routes ───────────────────────────────────────────
app.use((req, res) =>
  res.status(404).json({ message: `Route ${req.method} ${req.path} not found` })
);

// ── Global error handler ─────────────────────────────────────────────────────
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Server error', error: err.message });
});

// ── Start ─────────────────────────────────────────────────────────────────────
connectDB().then(() => {
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => console.log(`🚀 FleetCore API running on port ${PORT}`));

  const { startReminderJob } = require('./jobs/reminderCronJob');
  startReminderJob();
}).catch((err) => {
  console.error('Database connection error:', err);
  process.exit(1);
});
