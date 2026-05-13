'use strict';

const router                                                       = require('express').Router();
const { Application, Vehicle, PrivateCustomer, DealershipCustomer, Dealership, Document } = require('../models');
const { protect }                                                  = require('../middleware/authMiddleware');

router.use(protect);

const fullInclude = [
  { model: Vehicle,            as: 'vehicle' },
  { model: PrivateCustomer,    as: 'privateCustomer',    required: false },
  { model: DealershipCustomer, as: 'dealershipCustomer', required: false,
    include: [{ model: Dealership, as: 'dealership', attributes: ['id', 'name'] }] },
  { model: Document,           as: 'documents',          required: false },
];

// GET /api/applications
router.get('/', async (req, res) => {
  try {
    const { status, app_type, page = 1, limit = 20 } = req.query;
    const where = {};
    if (status)   where.status   = status;
    if (app_type) where.app_type = app_type;

    const { rows: applications, count: total } = await Application.findAndCountAll({
      where,
      include: fullInclude,
      order:   [['created_at', 'DESC']],
      limit:   +limit,
      offset:  (+page - 1) * +limit,
      distinct: true,
    });
    res.json({ applications, total, page: +page, pages: Math.ceil(total / limit) });
  } catch (err) { res.status(500).json({ message: err.message }); }
});

// POST /api/applications
router.post('/', async (req, res) => {
  try {
    const application = await Application.create(req.body);
    res.status(201).json(application);
  } catch (err) { res.status(400).json({ message: err.message }); }
});

// GET /api/applications/:id
router.get('/:id', async (req, res) => {
  try {
    const application = await Application.findByPk(req.params.id, { include: fullInclude });
    if (!application) return res.status(404).json({ message: 'Application not found' });
    res.json(application);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

// PUT /api/applications/:id  — update status, licensing fee, ref, dates
router.put('/:id', async (req, res) => {
  try {
    const application = await Application.findByPk(req.params.id);
    if (!application) return res.status(404).json({ message: 'Application not found' });
    await application.update(req.body);
    res.json(application);
  } catch (err) { res.status(400).json({ message: err.message }); }
});

// PATCH /api/applications/:id/status
router.patch('/:id/status', async (req, res) => {
  try {
    const { status } = req.body;
    const application = await Application.findByPk(req.params.id);
    if (!application) return res.status(404).json({ message: 'Application not found' });
    const updates = { status };
    if (status === 'submitted_to_licensing') updates.submitted_at = new Date();
    if (status === 'completed')              updates.completed_at  = new Date();
    await application.update(updates);
    res.json(application);
  } catch (err) { res.status(400).json({ message: err.message }); }
});

module.exports = router;