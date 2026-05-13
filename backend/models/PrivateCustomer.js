'use strict';

const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const PrivateCustomer = sequelize.define('PrivateCustomer', {
  id: {
    type:          DataTypes.INTEGER.UNSIGNED,
    autoIncrement: true,
    primaryKey:    true,
  },
  first_name: {
    type:      DataTypes.STRING(100),
    allowNull: false,
  },
  last_name: {
    type:      DataTypes.STRING(100),
    allowNull: false,
  },
  id_number: {
    type:      DataTypes.STRING(20),
    allowNull: false,
    unique:    true,
  },
  phone: {
    type: DataTypes.STRING(20),
  },
  email: {
    type: DataTypes.STRING(150),
  },
  address: {
    type: DataTypes.TEXT,
  },
}, {
  tableName:  'private_customers',
  timestamps: true,
  createdAt:  'created_at',
  updatedAt:  false,
});

module.exports = PrivateCustomer;