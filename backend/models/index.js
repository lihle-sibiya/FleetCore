'use strict';

const User               = require('./User');
const Dealership         = require('./Dealership');
const PrivateCustomer    = require('./PrivateCustomer');
const DealershipCustomer = require('./DealershipCustomer');
const Vehicle            = require('./Vehicle');
const Application        = require('./Application');
const Document           = require('./Document');
const Invoice            = require('./Invoice');
const Payment            = require('./Payment');

// ── Dealership → DealershipCustomer ─────────────────────────────────────────
Dealership.hasMany(DealershipCustomer, { foreignKey: 'dealership_id', as: 'customers' });
DealershipCustomer.belongsTo(Dealership, { foreignKey: 'dealership_id', as: 'dealership' });

// ── Customers → Vehicle ──────────────────────────────────────────────────────
PrivateCustomer.hasMany(Vehicle, { foreignKey: 'private_customer_id', as: 'vehicles' });
Vehicle.belongsTo(PrivateCustomer, { foreignKey: 'private_customer_id', as: 'privateCustomer' });

DealershipCustomer.hasMany(Vehicle, { foreignKey: 'dealership_customer_id', as: 'vehicles' });
Vehicle.belongsTo(DealershipCustomer, { foreignKey: 'dealership_customer_id', as: 'dealershipCustomer' });

// ── Vehicle → Application ────────────────────────────────────────────────────
Vehicle.hasMany(Application, { foreignKey: 'vehicle_id', as: 'applications' });
Application.belongsTo(Vehicle, { foreignKey: 'vehicle_id', as: 'vehicle' });

// ── Customers → Application ──────────────────────────────────────────────────
PrivateCustomer.hasMany(Application, { foreignKey: 'private_customer_id', as: 'applications' });
Application.belongsTo(PrivateCustomer, { foreignKey: 'private_customer_id', as: 'privateCustomer' });

DealershipCustomer.hasMany(Application, { foreignKey: 'dealership_customer_id', as: 'applications' });
Application.belongsTo(DealershipCustomer, { foreignKey: 'dealership_customer_id', as: 'dealershipCustomer' });

// ── Application → Document ───────────────────────────────────────────────────
Application.hasMany(Document, { foreignKey: 'application_id', as: 'documents' });
Document.belongsTo(Application, { foreignKey: 'application_id', as: 'application' });

// ── Application → Invoice ────────────────────────────────────────────────────
Application.hasOne(Invoice, { foreignKey: 'application_id', as: 'invoice' });
Invoice.belongsTo(Application, { foreignKey: 'application_id', as: 'application' });

// ── Billed to: PrivateCustomer or Dealership ─────────────────────────────────
PrivateCustomer.hasMany(Invoice, { foreignKey: 'private_customer_id', as: 'invoices' });
Invoice.belongsTo(PrivateCustomer, { foreignKey: 'private_customer_id', as: 'privateCustomer' });

Dealership.hasMany(Invoice, { foreignKey: 'dealership_id', as: 'invoices' });
Invoice.belongsTo(Dealership, { foreignKey: 'dealership_id', as: 'dealership' });

// ── Invoice → Payment ────────────────────────────────────────────────────────
Invoice.hasMany(Payment, { foreignKey: 'invoice_id', as: 'payments' });
Payment.belongsTo(Invoice, { foreignKey: 'invoice_id', as: 'invoice' });

module.exports = {
  User,
  Dealership,
  PrivateCustomer,
  DealershipCustomer,
  Vehicle,
  Application,
  Document,
  Invoice,
  Payment,
};