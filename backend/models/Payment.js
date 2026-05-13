'use strict';

const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const Payment = sequelize.define('Payment', {
  id: {
    type:          DataTypes.INTEGER.UNSIGNED,
    autoIncrement: true,
    primaryKey:    true,
  },
  invoice_id: {
    type:      DataTypes.INTEGER.UNSIGNED,
    allowNull: false,
  },
  amount: {
    type:      DataTypes.DECIMAL(10, 2),
    allowNull: false,
  },
  method: {
    type:      DataTypes.ENUM('eft', 'cash', 'card', 'other'),
    allowNull: false,
  },
  reference: {
    type:         DataTypes.STRING(100),
    allowNull:    true,
    defaultValue: null,
  },
}, {
  tableName:  'payments',
  timestamps: true,
  createdAt:  'paid_at',
  updatedAt:  false,
});

module.exports = Payment;