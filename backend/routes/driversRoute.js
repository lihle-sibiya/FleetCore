//driversRoute.js

"use strict";

const router = require('express').Router();
const { Driver } = require('../models');
const { protect } = require('../middleware/authMiddleware');

router.use(protect);

router.get('/', async (req, res) => {
  try {
    const q = req.query.companyId ? { companyId: req.query.companyId } : {};
    const drivers = await Driver.find(q).populate('companyId', 'name');
    res.json(drivers);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

router.post('/', async (req, res) => {
  try {
    const driver = await Driver.create(req.body);
    res.status(201).json(driver);
  } catch (err) { res.status(400).json({ message: err.message }); }
});

router.get('/:id', async (req, res) => {
  try {
    const driver = await Driver.findById(req.params.id).populate('companyId', 'name');
    if (!driver) return res.status(404).json({ message: 'Driver not found' });
    res.json(driver);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

router.put('/:id', async (req, res) => {
  try {
    const driver = await Driver.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!driver) return res.status(404).json({ message: 'Driver not found' });
    res.json(driver);
  } catch (err) { res.status(400).json({ message: err.message }); }
});

router.delete('/:id', async (req, res) => {
  try {
    await Driver.findByIdAndDelete(req.params.id);
    res.json({ message: 'Driver removed' });
  } catch (err) { res.status(500).json({ message: err.message }); }
});

module.exports = router;