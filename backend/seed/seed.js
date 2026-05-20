'use strict';

/**
 * FleetCore — MySQL Seeder
 * Generates realistic demo data for FleetCore using MySQL/Sequelize.
 * Run: npm run seed
 */

require('dotenv').config();
const bcrypt = require('bcryptjs');
const { faker } = require('@faker-js/faker');
const { connectDB } = require('../config/db');
const {
  User,
  Dealership,
  DealershipCustomer,
  PrivateCustomer,
  Vehicle,
  Application,
  Document,
  Invoice,
  Payment,
} = require('../models');

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
  'Jan Smuts Ave',
  'Voortrekker Road',
  'Louis Botha Ave',
  'Commissioner Street',
  'Adderley Street',
  'Buitenkant Street',
  'Oxford Road',
  'Rivonia Road',
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

const seed = async () => {
  await connectDB();

  await Payment.destroy({ where: {} });
  await Document.destroy({ where: {} });
  await Invoice.destroy({ where: {} });
  await Application.destroy({ where: {} });
  await Vehicle.destroy({ where: {} });
  await DealershipCustomer.destroy({ where: {} });
  await PrivateCustomer.destroy({ where: {} });
  await Dealership.destroy({ where: {} });
  await User.destroy({ where: {} });

  console.log('🗑  Cleared existing data');

  const passwordHash = await bcrypt.hash('Demo1234!', 12);
  const [adminUser, clerkUser] = await Promise.all([
    User.create({ name: 'Thabo Nkosi', email: 'admin@fleetcore.co.za', passwordHash, role: 'admin' }),
    User.create({ name: 'Priya Pillay', email: 'clerk@fleetcore.co.za', passwordHash, role: 'clerk' }),
  ]);
  console.log('👤 Users seeded');

  const dealerships = [];
  for (const company of SA_COMPANIES) {
    const dealership = await Dealership.create({
      name: company.name,
      contact_name: faker.person.fullName(),
      phone: `0${faker.number.int({ min: 71, max: 79 })} ${faker.number.int({ min: 100, max: 999 })} ${faker.number.int({ min: 1000, max: 9999 })}`,
      email: `info@${company.name.toLowerCase().replace(/\s+/g, '').replace(/[^a-z]/g, '')}.co.za`,
      address: `${faker.number.int({ min: 1, max: 200 })} ${faker.helpers.arrayElement(SA_STREETS)}, ${company.city}`,
    });
    dealerships.push(dealership);
  }
  console.log(`🏢 ${dealerships.length} dealerships seeded`);

  const dealershipCustomers = [];
  for (const dealership of dealerships) {
    const customerCount = faker.number.int({ min: 2, max: 4 });
    for (let i = 0; i < customerCount; i += 1) {
      const customer = await DealershipCustomer.create({
        dealership_id: dealership.id,
        first_name: faker.person.firstName(),
        last_name: faker.person.lastName(),
        id_number: faker.string.numeric(13),
        phone: `0${faker.number.int({ min: 71, max: 79 })} ${faker.number.int({ min: 100, max: 999 })} ${faker.number.int({ min: 1000, max: 9999 })}`,
        email: faker.internet.email().toLowerCase(),
      });
      dealershipCustomers.push(customer);
    }
  }
  console.log(`👥 ${dealershipCustomers.length} dealership customers seeded`);

  const privateCustomers = [];
  for (let i = 0; i < 4; i += 1) {
    const privateCustomer = await PrivateCustomer.create({
      first_name: faker.person.firstName(),
      last_name: faker.person.lastName(),
      id_number: faker.string.numeric(13),
      phone: `0${faker.number.int({ min: 71, max: 79 })} ${faker.number.int({ min: 100, max: 999 })} ${faker.number.int({ min: 1000, max: 9999 })}`,
      email: faker.internet.email().toLowerCase(),
      address: `${faker.number.int({ min: 1, max: 200 })} ${faker.helpers.arrayElement(SA_STREETS)}, ${faker.helpers.arrayElement(['Cape Town', 'Johannesburg', 'Durban'])}`,
    });
    privateCustomers.push(privateCustomer);
  }
  console.log(`🧑‍🤝‍🧑 ${privateCustomers.length} private customers seeded`);

  const vehicles = [];
  for (const customer of dealershipCustomers) {
    const vehicleCount = faker.number.int({ min: 1, max: 3 });
    for (let i = 0; i < vehicleCount; i += 1) {
      const { make, model } = randomVehicle();
      const vehicle = await Vehicle.create({
        dealership_customer_id: customer.id,
        make,
        model,
        year: faker.number.int({ min: 2015, max: 2024 }),
        vin: faker.vehicle.vin(),
        reg_number: randomSaPlate(),
      });
      vehicles.push(vehicle);
    }
  }

  for (const privateCustomer of privateCustomers) {
    const vehicleCount = faker.number.int({ min: 1, max: 2 });
    for (let i = 0; i < vehicleCount; i += 1) {
      const { make, model } = randomVehicle();
      const vehicle = await Vehicle.create({
        private_customer_id: privateCustomer.id,
        make,
        model,
        year: faker.number.int({ min: 2015, max: 2024 }),
        vin: faker.vehicle.vin(),
        reg_number: randomSaPlate(),
      });
      vehicles.push(vehicle);
    }
  }
  console.log(`🚗 ${vehicles.length} vehicles seeded`);

  const applications = [];
  for (const vehicle of vehicles.slice(0, 8)) {
    const isDealership = vehicle.dealership_customer_id !== null;
    const application = await Application.create({
      vehicle_id: vehicle.id,
      private_customer_id: isDealership ? null : vehicle.private_customer_id,
      dealership_customer_id: isDealership ? vehicle.dealership_customer_id : null,
      app_type: faker.helpers.arrayElement(['new_registration', 'ownership_transfer']),
      status: faker.helpers.arrayElement(['pending', 'documents_received', 'submitted_to_licensing', 'completed']),
      licensing_fee_paid: faker.number.int({ min: 800, max: 1800 }),
      licensing_dept_ref: `LIC-${faker.number.int({ min: 10000, max: 99999 })}`,
      submitted_at: pastDate(14, 60),
      completed_at: faker.helpers.arrayElement([null, pastDate(1, 14)]),
    });
    applications.push(application);
  }
  console.log(`📝 ${applications.length} applications seeded`);

  const documents = [];
  const documentTypes = ['id_document', 'proof_of_address', 'proof_of_ownership', 'vehicle_registration'];
  for (const application of applications) {
    const docCount = faker.number.int({ min: 1, max: 3 });
    for (let i = 0; i < docCount; i += 1) {
      const doc = await Document.create({
        application_id: application.id,
        doc_type: faker.helpers.arrayElement(documentTypes),
        source: 'digital_upload',
        file_path: `/uploads/demo/${application.id}-${i + 1}.pdf`,
        original_filename: `document-${application.id}-${i + 1}.pdf`,
      });
      documents.push(doc);
    }
  }
  console.log(`📄 ${documents.length} documents seeded`);

  const invoices = [];
  for (const application of applications) {
    const isDealership = application.dealership_customer_id !== null;
    const invoice = await Invoice.create({
      application_id: application.id,
      private_customer_id: isDealership ? null : application.private_customer_id,
      dealership_id: isDealership ? dealershipCustomers.find((cust) => cust.id === application.dealership_customer_id).dealership_id : null,
      invoice_number: `FLEET-${faker.number.int({ min: 1000, max: 9999 })}`,
      subtotal: faker.number.int({ min: 900, max: 7500 }),
      vat: 0,
      total: 0,
      status: faker.helpers.arrayElement(['draft', 'sent', 'paid', 'overdue']),
      due_date: futureDate(7, 30),
      paid_at: null,
    });
    invoice.vat = parseFloat((invoice.subtotal * 0.15).toFixed(2));
    invoice.total = parseFloat((invoice.subtotal + invoice.vat).toFixed(2));
    if (invoice.status === 'paid') {
      invoice.paid_at = pastDate(1, 15);
    }
    await invoice.save();
    invoices.push(invoice);
  }
  console.log(`🧾 ${invoices.length} invoices seeded`);

  const payments = [];
  for (const invoice of invoices.filter((invoice) => invoice.status === 'paid')) {
    const payment = await Payment.create({
      invoice_id: invoice.id,
      amount: invoice.total,
      method: faker.helpers.arrayElement(['eft', 'card', 'cash']),
      reference: `PAY-${faker.number.int({ min: 10000, max: 99999 })}`,
    });
    payments.push(payment);
  }
  console.log(`💳 ${payments.length} payments seeded`);

  const [userCount, dealershipCount, vehicleCount, applicationCount, invoiceCount] = await Promise.all([
    User.count(),
    Dealership.count(),
    Vehicle.count(),
    Application.count(),
    Invoice.count(),
  ]);

  console.log('\n✅ Seed complete!');
  console.log(`   Users       : ${userCount}`);
  console.log(`   Dealerships : ${dealershipCount}`);
  console.log(`   Vehicles    : ${vehicleCount}`);
  console.log(`   Applications: ${applicationCount}`);
  console.log(`   Invoices    : ${invoiceCount}`);
  console.log('\n🔑 Login credentials:');
  console.log('   Admin → admin@fleetcore.co.za / Demo1234!');
  console.log('   Clerk → clerk@fleetcore.co.za / Demo1234!');
};

seed().catch((err) => {
  console.error('Seed failed:', err);
  process.exit(1);
});
