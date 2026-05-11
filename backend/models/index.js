'use strict';

const mongoose = require('mongoose');

// ─── User (staff) ────────────────────────────────────────
const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    passwordHash: { type: String, required: true },
    role: { type: String, enum: ['admin', 'clerk'], default: 'clerk' },
  },
  { timestamps: true }
);

// ─── Company (fleet client) ───────────────────────────────
const companySchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    registrationNumber: { type: String, trim: true },
    vatNumber: { type: String, trim: true },
    phone: { type: String, required: true },
    email: { type: String, lowercase: true },
    address: { type: String },
    isDeleted: { type: Boolean, default: false },
  },
  { timestamps: true }
);

// ─── Driver ───────────────────────────────────────────────
const driverSchema = new mongoose.Schema(
  {
    companyId: { type: mongoose.Schema.Types.ObjectId, ref: 'Company', required: true },
    fullName: { type: String, required: true },
    licenceNumber: { type: String },
    licenceExpiry: { type: Date },
    phone: { type: String },
    email: { type: String, lowercase: true },
  },
  { timestamps: true }
);

// ─── Vehicle ──────────────────────────────────────────────
const vehicleSchema = new mongoose.Schema(
  {
    companyId: { type: mongoose.Schema.Types.ObjectId, ref: 'Company', required: true },
    driverId: { type: mongoose.Schema.Types.ObjectId, ref: 'Driver' },
    make: { type: String, required: true },
    model: { type: String, required: true },
    year: { type: Number },
    colour: { type: String },
    registrationNumber: { type: String, required: true, uppercase: true, trim: true },
    vinNumber: { type: String, trim: true },
    licenceExpiryDate: { type: Date },
    nextServiceDate: { type: Date },
    odometerKm: { type: Number },
    documentUrl: { type: String },
  },
  { timestamps: true }
);

// ─── Invoice ──────────────────────────────────────────────
const lineItemSchema = new mongoose.Schema({
  description: { type: String, required: true },
  amount: { type: Number, required: true },
});

const invoiceSchema = new mongoose.Schema(
  {
    invoiceNumber: { type: String, unique: true },
    companyId: { type: mongoose.Schema.Types.ObjectId, ref: 'Company', required: true },
    vehicleId: { type: mongoose.Schema.Types.ObjectId, ref: 'Vehicle' },
    driverId: { type: mongoose.Schema.Types.ObjectId, ref: 'Driver' },
    clerkId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    serviceType: {
      type: String,
      enum: ['service', 'licence_renewal', 'roadworthy', 'tyres', 'repairs', 'other'],
      required: true,
    },
    lineItems: [lineItemSchema],
    subtotal: { type: Number, required: true },
    vatIncluded: { type: Boolean, default: true },
    vatAmount: { type: Number, default: 0 },
    total: { type: Number, required: true },
    status: {
      type: String,
      enum: ['draft', 'issued', 'paid', 'overdue'],
      default: 'issued',
    },
    dueDate: { type: Date },
    paidAt: { type: Date },
    notes: { type: String },
  },
  { timestamps: true }
);

// Auto-generate invoice number: FC-0001
invoiceSchema.pre('save', async function (next) {
  if (!this.invoiceNumber) {
    const count = await mongoose.model('Invoice').countDocuments();
    this.invoiceNumber = `FC-${String(count + 1).padStart(4, '0')}`;
  }
  next();
});

// ─── Service Reminder ─────────────────────────────────────
const reminderSchema = new mongoose.Schema(
  {
    vehicleId: { type: mongoose.Schema.Types.ObjectId, ref: 'Vehicle', required: true },
    companyId: { type: mongoose.Schema.Types.ObjectId, ref: 'Company', required: true },
    driverId: { type: mongoose.Schema.Types.ObjectId, ref: 'Driver' },
    reminderType: { type: String, enum: ['service', 'licence'], required: true },
    dueDate: { type: Date, required: true },
    reminderSentAt: { type: Date, default: null },
    status: { type: String, enum: ['pending', 'sent', 'dismissed'], default: 'pending' },
  },
  { timestamps: true }
);

module.exports = {
  User: mongoose.model('User', userSchema),
  Company: mongoose.model('Company', companySchema),
  Driver: mongoose.model('Driver', driverSchema),
  Vehicle: mongoose.model('Vehicle', vehicleSchema),
  Invoice: mongoose.model('Invoice', invoiceSchema),
  Reminder: mongoose.model('Reminder', reminderSchema),
};