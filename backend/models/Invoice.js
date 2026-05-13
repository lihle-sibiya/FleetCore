'use strict';

const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const Invoice = sequelize.define('Invoice', {
  id: {
    type:          DataTypes.INTEGER.UNSIGNED,
    autoIncrement: true,
    primaryKey:    true,
  },
  application_id: {
    type:      DataTypes.INTEGER.UNSIGNED,
    allowNull: false,
  },
  private_customer_id: {
    type:         DataTypes.INTEGER.UNSIGNED,
    allowNull:    true,
    defaultValue: null,
  },
  dealership_id: {
    type:         DataTypes.INTEGER.UNSIGNED,
    allowNull:    true,
    defaultValue: null,
  },
  invoice_number: {
    type:      DataTypes.STRING(50),
    allowNull: false,
    unique:    true,
  },
  subtotal: {
    type:      DataTypes.DECIMAL(10, 2),
    allowNull: false,
  },
  vat: {
    type:         DataTypes.DECIMAL(10, 2),
    allowNull:    false,
    defaultValue: 0.00,
  },
  total: {
    type:      DataTypes.DECIMAL(10, 2),
    allowNull: false,
  },
  status: {
    type:         DataTypes.ENUM('draft', 'sent', 'paid', 'overdue', 'cancelled'),
    allowNull:    false,
    defaultValue: 'draft',
  },
  due_date: {
    type:         DataTypes.DATEONLY,
    allowNull:    true,
    defaultValue: null,
  },
  paid_at: {
    type:         DataTypes.DATE,
    allowNull:    true,
    defaultValue: null,
  },
}, {
  tableName:  'invoices',
  timestamps: true,
  createdAt:  'issued_at',
  updatedAt:  false,
  validate: {
    billedToCheck() {
      const hasPrivate     = this.private_customer_id !== null;
      const hasDealership  = this.dealership_id !== null;
      if (hasPrivate === hasDealership) {
        throw new Error('Invoice must be billed to either a private customer or a dealership, not both and not neither.');
      }
    },
  },
});

module.exports = Invoice;