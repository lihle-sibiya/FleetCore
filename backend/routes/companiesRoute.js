"use strict";

const router = require('express').Router();
const { Company, Vehicle, Driver } = require('../models');
const { protect } = require('../middleware/auth');

router.use(protect);

router.get('/', async (req, res) => {
  try {
    const { page = 1, limit = 20, search } = req.query;
    const q = { isDeleted: false };
    if (search) q.$or = [
      { name: { $regex: search, $options: 'i' } },
      { registrationNumber: { $regex: search, $options: 'i' } },
    ];
    const [companies, total] = await Promise.all([
      Company.find(q).sort({ name: 1 }).skip((page - 1) * limit).limit(+limit),
      Company.countDocuments(q),
    ]);
    res.json({ companies, total, page: +page, pages: Math.ceil(total / limit) });
  } catch (err) { res.status(500).json({ message: err.message }); }
});

router.post('/', async (req, res) => {
  try {
    const company = await Company.create(req.body);
    res.status(201).json(company);
  } catch (err) { res.status(400).json({ message: err.message }); }
});

router.get('/:id', async (req, res) => {
  try {
    const company = await Company.findOne({ _id: req.params.id, isDeleted: false });
    if (!company) return res.status(404).json({ message: 'Company not found' });
    const [vehicles, drivers] = await Promise.all([
      Vehicle.find({ companyId: company._id }),
      Driver.find({ companyId: company._id }),
    ]);
    res.json({ ...company.toObject(), vehicles, drivers });
  } catch (err) { res.status(500).json({ message: err.message }); }
});

router.put('/:id', async (req, res) => {
  try {
    const company = await Company.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!company) return res.status(404).json({ message: 'Company not found' });
    res.json(company);
  } catch (err) { res.status(400).json({ message: err.message }); }
});

router.delete('/:id', async (req, res) => {
  try {
    await Company.findByIdAndUpdate(req.params.id, { isDeleted: true });
    res.json({ message: 'Company removed' });
  } catch (err) { res.status(500).json({ message: err.message }); }
});

module.exports = router;