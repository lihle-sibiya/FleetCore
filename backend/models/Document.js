'use strict';

const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const Document = sequelize.define('Document', {
  id: {
    type:          DataTypes.INTEGER.UNSIGNED,
    autoIncrement: true,
    primaryKey:    true,
  },
  application_id: {
    type:      DataTypes.INTEGER.UNSIGNED,
    allowNull: false,
  },
  doc_type: {
    type:      DataTypes.ENUM('id_document', 'proof_of_address', 'proof_of_ownership', 'vehicle_registration', 'roadworthy_certificate', 'other'),
    allowNull: false,
  },
  source: {
    type:         DataTypes.ENUM('digital_upload', 'paper_scan'),
    allowNull:    false,
    defaultValue: 'digital_upload',
  },
  file_path: {
    type:      DataTypes.STRING(500),
    allowNull: false,
  },
  original_filename: {
    type: DataTypes.STRING(255),
  },
}, {
  tableName:  'documents',
  timestamps: true,
  createdAt:  'uploaded_at',
  updatedAt:  false,
});

module.exports = Document;