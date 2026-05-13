'use strict';

const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const Application = sequelize.define('Application', {
  id: {
    type:          DataTypes.INTEGER.UNSIGNED,
    autoIncrement: true,
    primaryKey:    true,
  },
  vehicle_id: {
    type:      DataTypes.INTEGER.UNSIGNED,
    allowNull: false,
  },
  private_customer_id: {
    type:         DataTypes.INTEGER.UNSIGNED,
    allowNull:    true,
    defaultValue: null,
  },
  dealership_customer_id: {
    type:         DataTypes.INTEGER.UNSIGNED,
    allowNull:    true,
    defaultValue: null,
  },
  app_type: {
    type:      DataTypes.ENUM('new_registration', 'ownership_transfer'),
    allowNull: false,
  },
  status: {
    type:         DataTypes.ENUM('pending', 'documents_received', 'submitted_to_licensing', 'completed', 'cancelled'),
    allowNull:    false,
    defaultValue: 'pending',
  },
  licensing_fee_paid: {
    type:         DataTypes.DECIMAL(10, 2),
    allowNull:    true,
    defaultValue: null,
  },
  licensing_dept_ref: {
    type:         DataTypes.STRING(100),
    allowNull:    true,
    defaultValue: null,
  },
  submitted_at: {
    type:         DataTypes.DATE,
    allowNull:    true,
    defaultValue: null,
  },
  completed_at: {
    type:         DataTypes.DATE,
    allowNull:    true,
    defaultValue: null,
  },
}, {
  tableName:  'applications',
  timestamps: true,
  createdAt:  'created_at',
  updatedAt:  false,
});

module.exports = Application;