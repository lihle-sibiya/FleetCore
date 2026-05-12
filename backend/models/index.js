// index.js

// const User = require('./User');
const Company = require('./Company');
const Driver = require('./Driver');
const Vehicle = require('./Vehicle');
const Invoice = require('./Invoice');
const Reminder = require('./Reminder');

// Company relationships
Company.hasMany(Driver, { foreignKey: 'companyId' });
Company.hasMany(Vehicle, { foreignKey: 'companyId' });

// Driver relationships
Driver.belongsTo(Company, { foreignKey: 'companyId' });
Driver.hasMany(Vehicle, { foreignKey: 'driverId' });

// Vehicle relationships
Vehicle.belongsTo(Company, { foreignKey: 'companyId' });
Vehicle.belongsTo(Driver, { foreignKey: 'driverId' });

// Invoice relationships
Invoice.belongsTo(Company, { foreignKey: 'companyId' });
Invoice.belongsTo(Vehicle, { foreignKey: 'vehicleId' });
Invoice.belongsTo(Driver, { foreignKey: 'driverId' });
Invoice.belongsTo(User, { foreignKey: 'clerkId' });

module.exports = {
  User,
  Company,
  Driver,
  Vehicle,
  Invoice,
  Reminder,
};