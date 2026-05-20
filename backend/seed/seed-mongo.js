// seed-mongo.js

'use strict';

/**
 * FleetCore — MongoDB Seeder
 * Run: npm run seed-mongo
 */

require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const { faker } = require('@faker-js/faker');

const SA_VEHICLE_MAKES = [
  { make: 'Toyota', models: ['Hilux', 'Land Cruiser', 'Quantum', 'Fortuner'] },
  { make: 'Ford', models: ['Ranger', 'Transit', 'Everest'] },
  { make: 'Isuzu', models: ['D-MAX', 'NMR 250', 'FRR 500'] },
  { make: 'Volkswagen', models: ['Amarok', 'Crafter', 'Transporter'] },
];

const SA_COMPANIES = [
  { name: 'Mzansi Freight Solutions', city: 'Johannesburg' },
  { name: 'Cape Logistics CC', city: 'Cape Town' },
  { name: 'Durban Express Transport', city: 'Durban' },
  { name: 'Highveld Haulage (Pty) Ltd', city: 'Pretoria' },
];

const randomSaPlate = () => {
  const letters = () => faker.string.alpha({ length: 2, casing: 'upper' });
  const nums = () => faker.number.int({ min: 100, max: 999 });
  const provinces = ['GP', 'WP', 'NP', 'EC', 'KZN', 'MP'];
  return `${letters()}${nums()}${faker.helpers.arrayElement(provinces)}`;
};

// --- Schemas ---
const userSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  passwordHash: String,
  role: { type: String, enum: ['admin', 'clerk'], default: 'clerk' },
}, { timestamps: true });

const companySchema = new mongoose.Schema({
  name: String,
  registrationNumber: String,
  vatNumber: String,
  phone: String,
  email: String,
  address: String,
}, { timestamps: true });

const driverSchema = new mongoose.Schema({
  companyId: mongoose.Types.ObjectId,
  fullName: String,
  licenceNumber: String,
  licenceExpiry: Date,
  phone: String,
  email: String,
}, { timestamps: true });

const vehicleSchema = new mongoose.Schema({
  companyId: mongoose.Types.ObjectId,
  driverId: mongoose.Types.ObjectId,
  make: String,
  model: String,
  year: Number,
  registrationNumber: String,
  vin: String,
  licenceExpiryDate: Date,
  nextServiceDate: Date,
  odometerKm: Number,
}, { timestamps: true });

const invoiceSchema = new mongoose.Schema({
  companyId: mongoose.Types.ObjectId,
  vehicleId: mongoose.Types.ObjectId,
  driverId: mongoose.Types.ObjectId,
  clerkId: mongoose.Types.ObjectId,
  serviceType: String,
  lineItems: Array,
  subtotal: Number,
  vatAmount: Number,
  total: Number,
  status: String,
  dueDate: Date,
  paidAt: Date,
}, { timestamps: true });

const reminderSchema = new mongoose.Schema({
  invoiceId: mongoose.Types.ObjectId,
  message: String,
  sendAt: Date,
  sent: { type: Boolean, default: false },
}, { timestamps: true });

const User = mongoose.model('User', userSchema);
const Company = mongoose.model('Company', companySchema);
const Driver = mongoose.model('Driver', driverSchema);
const Vehicle = mongoose.model('Vehicle', vehicleSchema);
const Invoice = mongoose.model('Invoice', invoiceSchema);
const Reminder = mongoose.model('Reminder', reminderSchema);

const futureDate = (minDays, maxDays) => {
  const d = new Date();
  d.setDate(d.getDate() + faker.number.int({ min: minDays, max: maxDays }));
  return d;
};

const pastDate = (minDays, maxDays) => {
  const d = new Date();
  d.setDate(d.getDate() - faker.number.int({ min: minDays, max: maxDays }));
  return d;
};

async function seed() {
  if (!process.env.MONGO_URI) {
    console.error('Please set MONGO_URI in .env');
    process.exit(1);
  }

  await mongoose.connect(process.env.MONGO_URI, { dbName: process.env.MONGO_DB || undefined });
  console.log('🔌 Connected to MongoDB');

  await Promise.all([
    User.deleteMany({}), Company.deleteMany({}), Driver.deleteMany({}),
    Vehicle.deleteMany({}), Invoice.deleteMany({}), Reminder.deleteMany({}),
  ]);
  console.log('🗑 Cleared existing data');

  const passwordHash = await bcrypt.hash('Demo1234!', 12);
  const adminUser = await User.create({ name: 'Admin User', email: 'admin@fleetcore.co.za', passwordHash, role: 'admin' });
  const clerkUser = await User.create({ name: 'Clerk User', email: 'clerk@fleetcore.co.za', passwordHash, role: 'clerk' });

  const companies = [];
  for (const c of SA_COMPANIES) {
    const comp = await Company.create({
      name: c.name,
      registrationNumber: `${faker.number.int({ min: 2000, max: 2023 })}/${faker.number.int({ min: 100000, max: 999999 })}/07`,
      vatNumber: `4${faker.number.int({ min: 10000000, max: 99999999 })}`,
      phone: `0${faker.number.int({ min: 10, max: 99 })} ${faker.number.int({ min: 100, max: 999 })} ${faker.number.int({ min: 1000, max: 9999 })}`,
      email: `accounts@${c.name.toLowerCase().replace(/\s+/g, '').replace(/[^a-z]/g, '')}.co.za`,
      address: `${faker.number.int({ min: 1, max: 200 })} ${faker.location.street()}, ${c.city}`,
    });
    companies.push(comp);
  }

  const allVehicles = [];
  for (const comp of companies) {
    const drivers = [];
    const driverCount = faker.number.int({ min: 2, max: 4 });
    for (let i = 0; i < driverCount; i++) {
      const dr = await Driver.create({
        companyId: comp._id,
        fullName: faker.person.fullName(),
        licenceNumber: `${faker.string.alpha({ length: 2, casing: 'upper' })}${faker.number.int({ min: 100000, max: 999999 })}`,
        licenceExpiry: futureDate(30, 730),
        phone: `07${faker.number.int({ min: 10000000, max: 99999999 })}`,
        email: faker.internet.email().toLowerCase(),
      });
      drivers.push(dr);
    }

    const vehicleCount = faker.number.int({ min: 1, max: 4 });
    for (let i = 0; i < vehicleCount; i++) {
      const { make, model } = faker.helpers.arrayElement(SA_VEHICLE_MAKES);
      const v = await Vehicle.create({
        companyId: comp._id,
        driverId: drivers[i % drivers.length]._id,
        make,
        model: faker.helpers.arrayElement(model || ['Model']),
        year: faker.number.int({ min: 2015, max: 2023 }),
        registrationNumber: randomSaPlate(),
        vin: faker.vehicle.vin(),
        licenceExpiryDate: futureDate(7, 180),
        nextServiceDate: futureDate(5, 90),
        odometerKm: faker.number.int({ min: 50000, max: 350000 }),
      });
      allVehicles.push({ v, comp, drivers });
    }
  }

  const invoices = [];
  const serviceTypes = ['service', 'licence_renewal', 'roadworthy', 'tyres', 'repairs'];
  const statuses = ['paid', 'issued', 'overdue'];

  for (const entry of allVehicles) {
    const invoiceCount = faker.number.int({ min: 1, max: 3 });
    for (let i = 0; i < invoiceCount; i++) {
      const lineItems = [{ description: 'Demo service', amount: faker.number.int({ min: 500, max: 5000 }) }];
      const subtotal = lineItems.reduce((s, it) => s + it.amount, 0);
      const vatAmount = parseFloat((subtotal * 0.15).toFixed(2));
      const total = subtotal + vatAmount;
      const status = faker.helpers.arrayElement(statuses);

      const inv = await Invoice.create({
        companyId: entry.comp._id,
        vehicleId: entry.v._id,
        driverId: entry.drivers[0]._id,
        clerkId: clerkUser._id,
        serviceType: faker.helpers.arrayElement(serviceTypes),
        lineItems,
        subtotal,
        vatAmount,
        total,
        status,
        dueDate: futureDate(7, 30),
        paidAt: status === 'paid' ? pastDate(1, 30) : null,
      });
      invoices.push(inv);
    }
  }

  for (const inv of invoices) {
    await Reminder.create({ invoiceId: inv._id, message: 'Demo reminder', sendAt: futureDate(1, 10) });
  }

  console.log('\n✅ Mongo seed complete');
  await mongoose.disconnect();
}

seed().catch((err) => {
  console.error('Seed failed:', err);
  process.exit(1);
});
