'use strict';

const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const DealershipCustomer = sequelize.define('DealershipCustomer', {
  id: {
    type:          DataTypes.INTEGER.UNSIGNED,
    autoIncrement: true,
    primaryKey:    true,
  },
  dealership_id: {
    type:      DataTypes.INTEGER.UNSIGNED,
    allowNull: false,
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
  },
  phone: {
    type: DataTypes.STRING(20),
  },
  email: {
    type: DataTypes.STRING(150),
  },
}, {
  tableName:  'dealership_customers',
  timestamps: true,
  createdAt:  'created_at',
  updatedAt:  false,
});

module.exports = DealershipCustomer;