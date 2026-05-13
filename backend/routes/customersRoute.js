'use strict';

const router                                      = require('express').Router();
const { Op }                                      = require('sequelize');
const { PrivateCustomer, DealershipCustomer, Dealership } = require('../models');
const { protect }                                 = require('../middleware/authMiddleware');

router.use(protect);

// ── Private Customers ────────────────────────────────────────────────────────

// GET /api/customers/private
router.get('/private', async (req, res) => {
  try {
    const { search } = req.query;
    const where = {};
    if (search) {
      where[Op.or] = [
        { first_name: { [Op.like]: `%${search}%` } },
        { last_name:  { [Op.like]: `%${search}%` } },
        { id_number:  { [Op.like]: `%${search}%` } },
      ];
    }
    const customers = await PrivateCustomer.findAll({ where, order: [['last_name', 'ASC']] });
    res.json(customers);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

// POST /api/customers/private
router.post('/private', async (req, res) => {
  try {
    const customer = await PrivateCustomer.create(req.body);
    res.status(201).json(customer);
  } catch (err) { res.status(400).json({ message: err.message }); }
});

// GET /api/customers/private/:id
router.get('/private/:id', async (req, res) => {
  try {
    const customer = await PrivateCustomer.findByPk(req.params.id);
    if (!customer) return res.status(404).json({ message: 'Customer not found' });
    res.json(customer);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

// PUT /api/customers/private/:id
router.put('/private/:id', async (req, res) => {
  try {
    const customer = await PrivateCustomer.findByPk(req.params.id);
    if (!customer) return res.status(404).json({ message: 'Customer not found' });
    await customer.update(req.body);
    res.json(customer);
  } catch (err) { res.status(400).json({ message: err.message }); }
});

// ── Dealership Customers ─────────────────────────────────────────────────────

// GET /api/customers/dealership?dealership_id=1
router.get('/dealership', async (req, res) => {
  try {
    const where = {};
    if (req.query.dealership_id) where.dealership_id = req.query.dealership_id;
    const customers = await DealershipCustomer.findAll({
      where,
      include: [{ model: Dealership, as: 'dealership', attributes: ['id', 'name'] }],
      order:   [['last_name', 'ASC']],
    });
    res.json(customers);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

// POST /api/customers/dealership
router.post('/dealership', async (req, res) => {
  try {
    const customer = await DealershipCustomer.create(req.body);
    res.status(201).json(customer);
  } catch (err) { res.status(400).json({ message: err.message }); }
});

// GET /api/customers/dealership/:id
router.get('/dealership/:id', async (req, res) => {
  try {
    const customer = await DealershipCustomer.findByPk(req.params.id, {
      include: [{ model: Dealership, as: 'dealership', attributes: ['id', 'name'] }],
    });
    if (!customer) return res.status(404).json({ message: 'Customer not found' });
    res.json(customer);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

// PUT /api/customers/dealership/:id
router.put('/dealership/:id', async (req, res) => {
  try {
    const customer = await DealershipCustomer.findByPk(req.params.id);
    if (!customer) return res.status(404).json({ message: 'Customer not found' });
    await customer.update(req.body);
    res.json(customer);
  } catch (err) { res.status(400).json({ message: err.message }); }
});

module.exports = router;