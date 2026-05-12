//seed.js

'use strict';

/**
 * FleetCore — Database Seeder
 * Generates realistic fake SA fleet data for portfolio demonstration.
 * Run: npm run seed
 */

require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const { faker } = require('@faker-js/faker');
const { User, Company, Driver, Vehicle, Invoice, Reminder } = require('../models');

// ── Fake SA data helpers ──────────────────────────────────────────────────────

const SA_VEHICLE_MAKES = [
  { make: 'Toyota', models: ['Hilux', 'Land Cruiser', 'Quantum', 'Fortuner'] },
  { make: 'Ford', models: ['Ranger', 'Transit', 'Everest'] },
  { make: 'Isuzu', models: ['D-MAX', 'NMR 250', 'FRR 500'] },
  { make: 'Volkswagen', models: ['Amarok', 'Crafter', 'Transporter'] },
  { make: 'Mercedes-Benz', models: ['Sprinter', 'Vito', 'Actros'] },
  { make: 'Hino', models: ['300', '500', '700'] },
  { make: 'MAN', models: ['TGS', 'TGX', 'TGL'] },
];

const SA_COMPANIES = [
  { name: 'Mzansi Freight Solutions', city: 'Johannesburg' },
  { name: 'Cape Logistics CC', city: 'Cape Town' },
  { name: 'Durban Express Transport', city: 'Durban' },
  { name: 'Highveld Haulage (Pty) Ltd', city: 'Pretoria' },
  { name: 'Coastal Carriers Group', city: 'Port Elizabeth' },
  { name: 'Soweto Shuttle Services', city: 'Soweto' },
  { name: 'Blue Route Distribution', city: 'Cape Town' },
  { name: 'Rand Refrigerated Logistics', city: 'Germiston' },
];

const SA_STREETS = [
  'Jan Smuts Ave', 'Voortrekker Road', 'Louis Botha Ave', 'Commissioner Street',
  'Adderley Street', 'Buitenkant Street', 'Oxford Road', 'Rivonia Road',
];

const randomSaPlate = () => {
  const letters = () => faker.string.alpha({ length: 2, casing: 'upper' });
  const nums = () => faker.number.int({ min: 100, max: 999 });
  const provinces = ['GP', 'WP', 'NP', 'EC', 'KZN', 'MP'];
  return `${letters()}${nums()}${faker.helpers.arrayElement(provinces)}`;
};

const randomVehicle = () => {
  const entry = faker.helpers.arrayElement(SA_VEHICLE_MAKES);
  return { make: entry.make, model: faker.helpers.arrayElement(entry.models) };
};

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

// ── Service line items by type ─────────────────────────────────────────────────
const LINE_ITEMS = {
  service: [
    { description: 'Labour — Full Service', amount: 1800 },
    { description: 'Oil Filter', amount: 280 },
    { description: 'Air Filter', amount: 350 },
    { description: 'Engine Oil 10W40 (8L)', amount: 960 },
  ],
  licence_renewal: [
    { description: 'Licence Disc Renewal — Government Fee', amount: 480 },
    { description: 'Processing & Admin Fee', amount: 150 },
  ],
  roadworthy: [
    { description: 'Roadworthy Certificate Inspection', amount: 650 },
    { description: 'Brake Test', amount: 220 },
    { description: 'Emissions Test', amount: 180 },
  ],
  tyres: [
    { description: 'Continental 265/65R17 (x4)', amount: 14800 },
    { description: 'Fitting & Balancing (x4)', amount: 480 },
    { description: 'Wheel Alignment', amount: 350 },
  ],
  repairs: [
    { description: 'Diagnostic Scan', amount: 450 },
    { description: 'Alternator Replacement', amount: 3200 },
    { description: 'Labour — 3 hours', amount: 1350 },
  ],
};

// ── Main seeder ───────────────────────────────────────────────────────────────
const seed = async () => {
  await mongoose.connect(process.env.MONGO_URI);
  console.log('🔌 Connected to MongoDB');

  // Wipe existing data
  await Promise.all([
    User.deleteMany(), Company.deleteMany(), Driver.deleteMany(),
    Vehicle.deleteMany(), Invoice.deleteMany(), Reminder.deleteMany(),
  ]);
  console.log('🗑  Cleared existing data');

  // ── Users ──
  const passwordHash = await bcrypt.hash('Demo1234!', 12);
  const [adminUser, clerkUser] = await User.insertMany([
    { name: 'Thabo Nkosi', email: 'admin@fleetcore.co.za', passwordHash, role: 'admin' },
    { name: 'Priya Pillay', email: 'clerk@fleetcore.co.za', passwordHash, role: 'clerk' },
  ]);
  console.log('👤 Users seeded');

  // ── Companies ──
  const companies = await Company.insertMany(
    SA_COMPANIES.map((c) => ({
      name: c.name,
      registrationNumber: `${faker.number.int({ min: 2000, max: 2023 })}/${faker.number.int({ min: 100000, max: 999999 })}/07`,
      vatNumber: `4${faker.number.int({ min: 10000000, max: 99999999 })}`,
      phone: `0${faker.number.int({ min: 10, max: 99 })} ${faker.number.int({ min: 100, max: 999 })} ${faker.number.int({ min: 1000, max: 9999 })}`,
      email: `accounts@${c.name.toLowerCase().replace(/\s+/g, '').replace(/[^a-z]/g, '')}.co.za`,
      address: `${faker.number.int({ min: 1, max: 200 })} ${faker.helpers.arrayElement(SA_STREETS)}, ${c.city}`,
    }))
  );
  console.log(`🏢 ${companies.length} companies seeded`);

  // ── Drivers + Vehicles ──
  const allVehicles = [];
  for (const company of companies) {
    const driverCount = faker.number.int({ min: 2, max: 5 });
    const drivers = await Driver.insertMany(
      Array.from({ length: driverCount }, () => ({
        companyId: company._id,
        fullName: faker.person.fullName(),
        licenceNumber: `${faker.string.alpha({ length: 2, casing: 'upper' })}${faker.number.int({ min: 100000, max: 999999 })}`,
        licenceExpiry: futureDate(30, 730),
        phone: `07${faker.number.int({ min: 10000000, max: 99999999 })}`,
        email: faker.internet.email().toLowerCase(),
      }))
    );

    const vehicleCount = faker.number.int({ min: 2, max: 6 });
    const vehicles = await Vehicle.insertMany(
      Array.from({ length: vehicleCount }, (_, i) => {
        const { make, model } = randomVehicle();
        return {
          companyId: company._id,
          driverId: drivers[i % drivers.length]._id,
          make, model,
          year: faker.number.int({ min: 2015, max: 2023 }),
          colour: faker.helpers.arrayElement(['White', 'Silver', 'Black', 'Red', 'Blue']),
          registrationNumber: randomSaPlate(),
          vinNumber: faker.vehicle.vin(),
          licenceExpiryDate: futureDate(7, 180),   // some expiring soon for demo
          nextServiceDate: futureDate(5, 90),
          odometerKm: faker.number.int({ min: 50000, max: 350000 }),
        };
      })
    );
    allVehicles.push(...vehicles.map(v => ({ ...v.toObject(), company, drivers })));
  }
  console.log(`🚛 Vehicles and drivers seeded`);

  // ── Invoices ──
  const serviceTypes = ['service', 'licence_renewal', 'roadworthy', 'tyres', 'repairs'];
  const statuses = ['paid', 'paid', 'paid', 'issued', 'issued', 'overdue']; // weighted toward paid

  for (const { company, drivers, ...vehicle } of allVehicles) {
    const invoiceCount = faker.number.int({ min: 1, max: 4 });
    for (let i = 0; i < invoiceCount; i++) {
      const serviceType = faker.helpers.arrayElement(serviceTypes);
      const items = LINE_ITEMS[serviceType];
      const lineItems = faker.helpers.arrayElements(items, faker.number.int({ min: 1, max: items.length }));
      const subtotal = lineItems.reduce((s, l) => s + l.amount, 0);
      const vatAmount = parseFloat((subtotal * 0.15).toFixed(2));
      const total = parseFloat((subtotal + vatAmount).toFixed(2));
      const status = faker.helpers.arrayElement(statuses);
      const createdAt = pastDate(1, 180);
      const dueDate = new Date(createdAt);
      dueDate.setDate(dueDate.getDate() + 30);

      await Invoice.create({
        companyId: company._id,
        vehicleId: vehicle._id,
        driverId: drivers[0]._id,
        clerkId: faker.helpers.arrayElement([adminUser._id, clerkUser._id]),
        serviceType,
        lineItems,
        subtotal,
        vatIncluded: true,
        vatAmount,
        total,
        status,
        dueDate,
        paidAt: status === 'paid' ? pastDate(1, 30) : null,
        createdAt,
      });
    }
  }
  console.log('🧾 Invoices seeded');

  const invoiceCount = await Invoice.countDocuments();
  const totalRevenue = await Invoice.aggregate([
    { $match: { status: 'paid' } },
    { $group: { _id: null, total: { $sum: '$total' } } },
  ]);

  console.log('\n✅ Seed complete!');
  console.log(`   Companies : ${companies.length}`);
  console.log(`   Invoices  : ${invoiceCount}`);
  console.log(`   Revenue   : R ${totalRevenue[0]?.total?.toFixed(2) || 0}`);
  console.log('\n🔑 Login credentials:');
  console.log('   Admin → admin@fleetcore.co.za / Demo1234!');
  console.log('   Clerk → clerk@fleetcore.co.za / Demo1234!');
  await mongoose.disconnect();
};

seed().catch((err) => {
  console.error('Seed failed:', err);
  process.exit(1);
});