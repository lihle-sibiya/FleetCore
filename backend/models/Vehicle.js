'use strict';

const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const Vehicle = sequelize.define('Vehicle', {
  id: {
    type:          DataTypes.INTEGER.UNSIGNED,
    autoIncrement: true,
    primaryKey:    true,
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
  make: {
    type:      DataTypes.STRING(100),
    allowNull: false,
  },
  model: {
    type:      DataTypes.STRING(100),
    allowNull: false,
  },
  year: {
    type:      DataTypes.INTEGER,
    allowNull: false,
  },
  vin: {
    type:      DataTypes.STRING(50),
    allowNull: false,
    unique:    true,
  },
  reg_number: {
    type: DataTypes.STRING(20),
  },
}, {
  tableName:  'vehicles',
  timestamps: true,
  createdAt:  'created_at',
  updatedAt:  false,
  validate: {
    // enforce: exactly one owner must be set
    ownerCheck() {
      const hasPrivate     = this.private_customer_id !== null;
      const hasDealership  = this.dealership_customer_id !== null;
      if (hasPrivate === hasDealership) {
        throw new Error('Vehicle must belong to either a private customer or a dealership customer, not both and not neither.');
      }
    },
  },
});

module.exports = Vehicle;