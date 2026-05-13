'use strict';

const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const Dealership = sequelize.define('Dealership', {
  id: {
    type:          DataTypes.INTEGER.UNSIGNED,
    autoIncrement: true,
    primaryKey:    true,
  },
  name: {
    type:      DataTypes.STRING(150),
    allowNull: false,
  },
  contact_name: {
    type: DataTypes.STRING(100),
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
  tableName:  'dealerships',
  timestamps: true,
  createdAt:  'created_at',
  updatedAt:  false,
});

module.exports = Dealership;