//vehiclesRoute.js

"use strict";

const router = require('express').Router();
const { Vehicle, Reminder } = require('../models');
const { protect } = require('../middleware/authMiddleware');

router.use(protect);

router.get('/', async (req, res) => {
  try {
    const q = req.query.companyId ? { companyId: req.query.companyId } : {};
    const vehicles = await Vehicle.find(q)
      .populate('companyId', 'name')
      .populate('driverId', 'fullName phone');
    res.json(vehicles);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

// Vehicles with service or licence due within N days
router.get('/due', async (req, res) => {
  try {
    const days = parseInt(req.query.days) || 30;
    const cutoff = new Date();
    cutoff.setDate(cutoff.getDate() + days);
    const vehicles = await Vehicle.find({
      $or: [
        { licenceExpiryDate: { $lte: cutoff, $gte: new Date() } },
        { nextServiceDate: { $lte: cutoff, $gte: new Date() } },
      ],
    }).populate('companyId', 'name phone').populate('driverId', 'fullName phone email');
    res.json(vehicles);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

router.post('/', async (req, res) => {
  try {
    const vehicle = await Vehicle.create(req.body);
    if (vehicle.licenceExpiryDate) {
      await Reminder.create({
        vehicleId: vehicle._id,
        companyId: vehicle.companyId,
        driverId: vehicle.driverId,
        reminderType: 'licence',
        dueDate: vehicle.licenceExpiryDate,
      });
    }
    if (vehicle.nextServiceDate) {
      await Reminder.create({
        vehicleId: vehicle._id,
        companyId: vehicle.companyId,
        driverId: vehicle.driverId,
        reminderType: 'service',
        dueDate: vehicle.nextServiceDate,
      });
    }
    res.status(201).json(vehicle);
  } catch (err) { res.status(400).json({ message: err.message }); }
});

router.get('/:id', async (req, res) => {
  try {
    const vehicle = await Vehicle.findById(req.params.id)
      .populate('companyId').populate('driverId');
    if (!vehicle) return res.status(404).json({ message: 'Vehicle not found' });
    res.json(vehicle);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

router.put('/:id', async (req, res) => {
  try {
    const vehicle = await Vehicle.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!vehicle) return res.status(404).json({ message: 'Vehicle not found' });
    res.json(vehicle);
  } catch (err) { res.status(400).json({ message: err.message }); }
});

module.exports = router;