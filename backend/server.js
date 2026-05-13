'use strict';

const express    = require('express');
const cors       = require('cors');
const rateLimit  = require('express-rate-limit');
const path       = require('path');
const { connectDB } = require('./config/db');
require('./models'); // load all models and associations
require('dotenv').config();

const app = express();

app.use(cors({ origin: process.env.FRONTEND_URL || '*' }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/api/', rateLimit({ windowMs: 15 * 60 * 1000, max: 100 }));

// Serve uploaded documents statically (private — behind auth in production)
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// ── Routes ───────────────────────────────────────────────────────────────────
app.use('/api/auth',         require('./routes/authRoute'));
app.use('/api/dealerships',  require('./routes/dealershipsRoute'));
app.use('/api/customers',    require('./routes/customersRoute'));
app.use('/api/vehicles',     require('./routes/vehiclesRoute'));
app.use('/api/applications', require('./routes/applicationsRoute'));
app.use('/api/documents',    require('./routes/documentsRoute'));
app.use('/api/invoices',     require('./routes/invoicesRoute'));
app.use('/api/dashboard',    require('./routes/dashboardRoute'));

// ── Health check ─────────────────────────────────────────────────────────────
app.get('/health', (_, res) =>
  res.json({ status: 'ok', time: new Date(), app: 'FleetCore' })
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