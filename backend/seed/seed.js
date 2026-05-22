'use strict';

/**
 * FleetCore — MySQL/Sequelize Database Seeder
 * Generates realistic SA licensing & registration data for portfolio demo.
 * Run: npm run seed
 */

require('dotenv').config();
const bcrypt   = require('bcryptjs');
const { faker } = require('@faker-js/faker');

// Load sequelize connection + all models via models/index.js
const { sequelize }  = require('../config/db');
require('../models'); // registers all associations
const {
  User, Dealership, DealershipCustomer,
  PrivateCustomer, Vehicle, Application,
  Invoice, Payment,
} = require('../models');

// ── SA data helpers ───────────────────────────────────────────────────────────

const SA_DEALERSHIPS = [
  { name: 'Mzansi Motors',          city: 'Johannesburg', contact: 'Thabo Nkosi' },
  { name: 'Cape Auto Group',         city: 'Cape Town',    contact: 'Anita Petersen' },
  { name: 'Durban Drive Centre',     city: 'Durban',       contact: 'Priya Pillay' },
  { name: 'Highveld Auto (Pty) Ltd', city: 'Pretoria',     contact: 'Gerhard van Rooyen' },
  { name: 'Coastal Car Sales',       city: 'Gqeberha',     contact: 'Sipho Dlamini' },
];

const SA_VEHICLES = [
  { make: 'Toyota',        models: ['Hilux', 'Land Cruiser', 'Fortuner', 'Quantum'] },
  { make: 'Ford',          models: ['Ranger', 'Everest', 'Transit'] },
  { make: 'Isuzu',         models: ['D-MAX', 'NMR 250'] },
  { make: 'Volkswagen',    models: ['Amarok', 'Polo', 'Tiguan'] },
  { make: 'Nissan',        models: ['Navara', 'Patrol', 'NP300'] },
  { make: 'Hyundai',       models: ['Tucson', 'H100', 'iX35'] },
];

const SA_FIRST_NAMES = ['Sipho', 'Thabo', 'Lungelo', 'Nomvula', 'Priya', 'Anita', 'Gerhard', 'Ruan', 'Fatima', 'Zanele', 'Bongani', 'Lerato'];
const SA_LAST_NAMES  = ['Nkosi', 'Dlamini', 'van Rooyen', 'Petersen', 'Pillay', 'Mokoena', 'Botha', 'Khumalo', 'Adams', 'Sithole', 'Meyer', 'Cele'];

const randomPlate = () => {
  const letters = faker.string.alpha({ length: 2, casing: 'upper' });
  const nums     = faker.number.int({ min: 100, max: 999 });
  const province = faker.helpers.arrayElement(['GP', 'WP', 'KZN', 'EC', 'MP', 'NW']);
  return `${letters} ${nums} ${province}`;
};

const randomIdNumber = () => {
  // SA ID: YYMMDD GGGG C A Z
  const year  = faker.number.int({ min: 60, max: 99 });
  const month = String(faker.number.int({ min: 1, max: 12 })).padStart(2, '0');
  const day   = String(faker.number.int({ min: 1, max: 28 })).padStart(2, '0');
  const seq   = faker.number.int({ min: 5000, max: 9999 }); // 5000+ = male
  const rest  = faker.number.int({ min: 100, max: 199 });
  return `${year}${month}${day}${seq}${rest}`;
};

const randomVehicle = () => {
  const entry = faker.helpers.arrayElement(SA_VEHICLES);
  return { make: entry.make, model: faker.helpers.arrayElement(entry.models) };
};

const pastDate = (minDays, maxDays) => {
  const d = new Date();
  d.setDate(d.getDate() - faker.number.int({ min: minDays, max: maxDays }));
  return d;
};

const futureDate = (minDays, maxDays) => {
  const d = new Date();
  d.setDate(d.getDate() + faker.number.int({ min: minDays, max: maxDays }));
  return d;
};

// ── Main seed ─────────────────────────────────────────────────────────────────
const seed = async () => {
  // Connect
  await sequelize.authenticate();
  console.log('✅ MySQL connected');

  // Wipe tables in FK-safe order (children first)
  await sequelize.query('SET FOREIGN_KEY_CHECKS = 0');
  for (const table of [
    'payments', 'invoices', 'documents', 'applications',
    'vehicles', 'dealership_customers', 'private_customers',
    'dealerships', 'users',
  ]) {
    await sequelize.query(`TRUNCATE TABLE \`${table}\``);
  }
  await sequelize.query('SET FOREIGN_KEY_CHECKS = 1');
  console.log('🗑  Tables cleared');

  // ── Users ──────────────────────────────────────────────────────────────────
  const passwordHash = await bcrypt.hash('Demo1234!', 12);
  const [adminUser, clerkUser] = await Promise.all([
    User.create({ name: 'Thabo Nkosi',   email: 'admin@fleetcore.co.za', passwordHash, role: 'admin' }),
    User.create({ name: 'Priya Pillay',  email: 'clerk@fleetcore.co.za', passwordHash, role: 'clerk' }),
  ]);
  console.log('👤 Users seeded (admin + clerk)');

  // ── Dealerships ────────────────────────────────────────────────────────────
  const dealerships = await Promise.all(
    SA_DEALERSHIPS.map(d =>
      Dealership.create({
        name:         d.name,
        contact_name: d.contact,
        phone:        `0${faker.number.int({ min: 10, max: 99 })} ${faker.number.int({ min: 100, max: 999 })} ${faker.number.int({ min: 1000, max: 9999 })}`,
        email:        `sales@${d.name.toLowerCase().replace(/\s+/g, '').replace(/[^a-z]/g, '')}.co.za`,
        address:      `${faker.number.int({ min: 1, max: 200 })} Main Road, ${d.city}`,
      })
    )
  );
  console.log(`🏢 ${dealerships.length} dealerships seeded`);

  // ── Private customers ──────────────────────────────────────────────────────
  const privateCustomers = await Promise.all(
    Array.from({ length: 12 }, () => {
      const first = faker.helpers.arrayElement(SA_FIRST_NAMES);
      const last  = faker.helpers.arrayElement(SA_LAST_NAMES);
      return PrivateCustomer.create({
        first_name: first,
        last_name:  last,
        id_number:  randomIdNumber(),
        phone:      `07${faker.number.int({ min: 10000000, max: 99999999 })}`,
        email:      `${first.toLowerCase()}.${last.toLowerCase().replace(/\s+/g,'_')}@gmail.com`,
        address:    `${faker.number.int({ min: 1, max: 200 })} ${faker.helpers.arrayElement(['Church St', 'Long St', 'Main Rd', 'Oxford Rd'])}, Cape Town`,
      });
    })
  );
  console.log(`👥 ${privateCustomers.length} private customers seeded`);

  // ── Dealership customers ───────────────────────────────────────────────────
  const dealershipCustomers = [];
  for (const d of dealerships) {
    const count = faker.number.int({ min: 2, max: 4 });
    for (let i = 0; i < count; i++) {
      const first = faker.helpers.arrayElement(SA_FIRST_NAMES);
      const last  = faker.helpers.arrayElement(SA_LAST_NAMES);
      const dc = await DealershipCustomer.create({
        dealership_id: d.id,
        first_name:    first,
        last_name:     last,
        id_number:     randomIdNumber(),
        phone:         `07${faker.number.int({ min: 10000000, max: 99999999 })}`,
        email:         `${first.toLowerCase()}@${d.name.toLowerCase().replace(/\s+/g,'').replace(/[^a-z]/g,'')}.co.za`,
      });
      dealershipCustomers.push(dc);
    }
  }
  console.log(`🏢👥 ${dealershipCustomers.length} dealership customers seeded`);

  // ── Vehicles ───────────────────────────────────────────────────────────────
  const vehicles = [];

  // 10 private vehicles
  for (const pc of privateCustomers.slice(0, 10)) {
    const { make, model } = randomVehicle();
    const v = await Vehicle.create({
      private_customer_id:    pc.id,
      dealership_customer_id: null,
      make, model,
      year:       faker.number.int({ min: 2010, max: 2023 }),
      vin:        faker.vehicle.vin(),
      reg_number: randomPlate(),
    });
    vehicles.push({ vehicle: v, ownerType: 'private', ownerId: pc.id, dealershipId: null });
  }

  // 15 dealership vehicles
  for (const dc of dealershipCustomers.slice(0, 15)) {
    const { make, model } = randomVehicle();
    const v = await Vehicle.create({
      private_customer_id:    null,
      dealership_customer_id: dc.id,
      make, model,
      year:       faker.number.int({ min: 2015, max: 2024 }),
      vin:        faker.vehicle.vin(),
      reg_number: randomPlate(),
    });
    const dealership = dealerships.find(d => d.id === dc.dealership_id);
    vehicles.push({ vehicle: v, ownerType: 'dealership', ownerId: dc.id, dealershipId: dealership?.id });
  }
  console.log(`🚗 ${vehicles.length} vehicles seeded`);

  // ── Applications + Invoices + Payments ────────────────────────────────────
  const APP_TYPES    = ['new_registration', 'ownership_transfer'];
  const APP_STATUSES = ['pending', 'documents_received', 'submitted_to_licensing', 'completed', 'completed', 'completed'];
  const INV_STATUSES = ['draft', 'sent', 'paid', 'paid', 'paid', 'overdue'];

  let appCount = 0;
  let invCount = 0;
  let payCount = 0;

  for (const { vehicle, ownerType, ownerId, dealershipId } of vehicles) {
    const numApps = faker.number.int({ min: 1, max: 3 });

    for (let i = 0; i < numApps; i++) {
      const appType   = faker.helpers.arrayElement(APP_TYPES);
      const appStatus = faker.helpers.arrayElement(APP_STATUSES);
      const createdAt = pastDate(10, 365);

      const appData = {
        vehicle_id:             vehicle.id,
        private_customer_id:    ownerType === 'private'    ? ownerId : null,
        dealership_customer_id: ownerType === 'dealership' ? ownerId : null,
        app_type:               appType,
        status:                 appStatus,
        created_at:             createdAt,
      };

      if (appStatus === 'submitted_to_licensing' || appStatus === 'completed') {
        appData.submitted_at        = pastDate(1, 10);
        appData.licensing_fee_paid  = faker.helpers.arrayElement([280, 480, 560, 650]);
        appData.licensing_dept_ref  = `LIC-${faker.number.int({ min: 10000, max: 99999 })}`;
      }
      if (appStatus === 'completed') {
        appData.completed_at = pastDate(1, 5);
      }

      const app = await Application.create(appData);
      appCount++;

      // Create invoice for most completed + some pending applications
      const shouldInvoice = appStatus === 'completed' ||
        (appStatus === 'submitted_to_licensing' && faker.datatype.boolean()) ||
        (appStatus === 'documents_received' && faker.datatype.boolean(0.4));

      if (!shouldInvoice) continue;

      const subtotal   = faker.helpers.arrayElement([450, 650, 850, 950, 1200, 1500, 2000]);
      const vat        = parseFloat((subtotal * 0.15).toFixed(2));
      const total      = parseFloat((subtotal + vat).toFixed(2));
      const invStatus  = faker.helpers.arrayElement(INV_STATUSES);
      const issuedAt   = new Date(createdAt.getTime() + 2 * 24 * 60 * 60 * 1000);
      const dueDate    = new Date(issuedAt.getTime() + 30 * 24 * 60 * 60 * 1000);

      // Generate sequential invoice number
      const invSeq    = String(invCount + 1).padStart(4, '0');
      const invYear   = issuedAt.getFullYear();
      const invNumber = `INV-${invYear}-${invSeq}`;

      const invoice = await Invoice.create({
        application_id:      app.id,
        private_customer_id: ownerType === 'private'    ? ownerId      : null,
        dealership_id:       ownerType === 'dealership' ? dealershipId : null,
        invoice_number:      invNumber,
        subtotal, vat, total,
        status:              invStatus,
        due_date:            dueDate,
        issued_at:           issuedAt,
        paid_at:             invStatus === 'paid' ? pastDate(1, 25) : null,
      });
      invCount++;

      // Record payment for paid invoices
      if (invStatus === 'paid') {
        await Payment.create({
          invoice_id: invoice.id,
          amount:     total,
          method:     faker.helpers.arrayElement(['eft', 'cash', 'card']),
          reference:  `REF-${faker.number.int({ min: 100000, max: 999999 })}`,
          paid_at:    invoice.paid_at,
        });
        payCount++;
      }
    }
  }

  console.log(`📋 ${appCount} applications seeded`);
  console.log(`🧾 ${invCount} invoices seeded`);
  console.log(`💳 ${payCount} payments seeded`);

  // ── Summary ────────────────────────────────────────────────────────────────
  const [paidRevenue] = await sequelize.query(
    `SELECT SUM(amount) AS total FROM payments`,
    { type: sequelize.QueryTypes.SELECT }
  );

  console.log('\n✅ Seed complete!');
  console.log(`   Dealerships       : ${dealerships.length}`);
  console.log(`   Private customers : ${privateCustomers.length}`);
  console.log(`   Vehicles          : ${vehicles.length}`);
  console.log(`   Applications      : ${appCount}`);
  console.log(`   Invoices          : ${invCount}`);
  console.log(`   Revenue (paid)    : R ${Number(paidRevenue?.total || 0).toFixed(2)}`);
  console.log('\n🔑 Login credentials:');
  console.log('   Admin → admin@fleetcore.co.za / Demo1234!');
  console.log('   Clerk → clerk@fleetcore.co.za / Demo1234!');

  await sequelize.close();
};

seed().catch((err) => {
  console.error('❌ Seed failed:', err.message);
  process.exit(1);
});
