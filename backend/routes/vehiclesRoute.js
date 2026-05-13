'use strict';

const router                                         = require('express').Router();
const { Op }                                         = require('sequelize');
const { Vehicle, PrivateCustomer, DealershipCustomer, Dealership } = require('../models');
const { protect }                                    = require('../middleware/authMiddleware');

router.use(protect);

// GET /api/vehicles
router.get('/', async (req, res) => {
  try {
    const where = {};
    if (req.query.private_customer_id)    where.private_customer_id    = req.query.private_customer_id;
    if (req.query.dealership_customer_id) where.dealership_customer_id = req.query.dealership_customer_id;

    const vehicles = await Vehicle.findAll({
      where,
      include: [
        { model: PrivateCustomer,    as: 'privateCustomer',    required: false },
        { model: DealershipCustomer, as: 'dealershipCustomer', required: false,
          include: [{ model: Dealership, as: 'dealership', attributes: ['id', 'name'] }] },
      ],
      order: [['created_at', 'DESC']],
    });
    res.json(vehicles);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

// POST /api/vehicles
router.post('/', async (req, res) => {
  try {
    const vehicle = await Vehicle.create(req.body);
    res.status(201).json(vehicle);
  } catch (err) { res.status(400).json({ message: err.message }); }
});

// GET /api/vehicles/:id
router.get('/:id', async (req, res) => {
  try {
    const vehicle = await Vehicle.findByPk(req.params.id, {
      include: [
        { model: PrivateCustomer,    as: 'privateCustomer',    required: false },
        { model: DealershipCustomer, as: 'dealershipCustomer', required: false,
          include: [{ model: Dealership, as: 'dealership', attributes: ['id', 'name'] }] },
      ],
    });
    if (!vehicle) return res.status(404).json({ message: 'Vehicle not found' });
    res.json(vehicle);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

// PUT /api/vehicles/:id
router.put('/:id', async (req, res) => {
  try {
    const vehicle = await Vehicle.findByPk(req.params.id);
    if (!vehicle) return res.status(404).json({ message: 'Vehicle not found' });
    await vehicle.update(req.body);
    res.json(vehicle);
  } catch (err) { res.status(400).json({ message: err.message }); }
});

module.exports = router;