'use strict';

const router                          = require('express').Router();
const { Op }                          = require('sequelize');
const { Dealership, DealershipCustomer, Vehicle } = require('../models');
const { protect }                     = require('../middleware/authMiddleware');

router.use(protect);

// GET /api/dealerships
router.get('/', async (req, res) => {
  try {
    const { page = 1, limit = 20, search } = req.query;
    const where = {};
    if (search) {
      where[Op.or] = [
        { name:         { [Op.like]: `%${search}%` } },
        { contact_name: { [Op.like]: `%${search}%` } },
      ];
    }
    const offset = (page - 1) * limit;
    const { rows: dealerships, count: total } = await Dealership.findAndCountAll({
      where,
      order:  [['name', 'ASC']],
      limit:  +limit,
      offset: +offset,
    });
    res.json({ dealerships, total, page: +page, pages: Math.ceil(total / limit) });
  } catch (err) { res.status(500).json({ message: err.message }); }
});

// POST /api/dealerships
router.post('/', async (req, res) => {
  try {
    const dealership = await Dealership.create(req.body);
    res.status(201).json(dealership);
  } catch (err) { res.status(400).json({ message: err.message }); }
});

// GET /api/dealerships/:id
router.get('/:id', async (req, res) => {
  try {
    const dealership = await Dealership.findByPk(req.params.id, {
      include: [{ model: DealershipCustomer, as: 'customers' }],
    });
    if (!dealership) return res.status(404).json({ message: 'Dealership not found' });
    res.json(dealership);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

// PUT /api/dealerships/:id
router.put('/:id', async (req, res) => {
  try {
    const dealership = await Dealership.findByPk(req.params.id);
    if (!dealership) return res.status(404).json({ message: 'Dealership not found' });
    await dealership.update(req.body);
    res.json(dealership);
  } catch (err) { res.status(400).json({ message: err.message }); }
});

// DELETE /api/dealerships/:id
router.delete('/:id', async (req, res) => {
  try {
    const dealership = await Dealership.findByPk(req.params.id);
    if (!dealership) return res.status(404).json({ message: 'Dealership not found' });
    await dealership.destroy();
    res.json({ message: 'Dealership removed' });
  } catch (err) { res.status(500).json({ message: err.message }); }
});

module.exports = router;