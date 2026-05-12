
//authRoute.js
"use strict";


const router = require('express').Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { User } = require('../models');
const { protect } = require('../middleware/authMiddleware');

const sign = (id) => jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '7d' });
const safeUser = (u, token) => ({ _id: u._id, name: u.name, email: u.email, role: u.role, token });

router.post('/register', async (req, res) => {
  try {
    const { name, email, password, role } = req.body;
    if (await User.findOne({ email }))
      return res.status(400).json({ message: 'Email already registered' });
    const passwordHash = await bcrypt.hash(password, 12);
    const user = await User.create({ name, email, passwordHash, role });
    res.status(201).json(safeUser(user, sign(user._id)));
  } catch (err) { res.status(400).json({ message: err.message }); }
});

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user || !(await bcrypt.compare(password, user.passwordHash)))
      return res.status(401).json({ message: 'Invalid credentials' });
    res.json(safeUser(user, sign(user._id)));
  } catch (err) { res.status(500).json({ message: err.message }); }
});

router.get('/me', protect, (req, res) => res.json(req.user));

module.exports = router;