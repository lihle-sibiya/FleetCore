'use strict';

const jwt        = require('jsonwebtoken');
const { User }   = require('../models');

const protect = async (req, res, next) => {
  const auth = req.headers.authorization;
  if (!auth?.startsWith('Bearer '))
    return res.status(401).json({ message: 'Not authorised' });
  try {
    const decoded = jwt.verify(auth.split(' ')[1], process.env.JWT_SECRET);
    // Sequelize: findByPk instead of findById, exclude passwordHash manually
    const user = await User.findByPk(decoded.id, {
      attributes: { exclude: ['passwordHash'] },
    });
    if (!user) return res.status(401).json({ message: 'User not found' });
    req.user = user;
    next();
  } catch {
    res.status(401).json({ message: 'Token invalid or expired' });
  }
};

const adminOnly = (req, res, next) =>
  req.user?.role === 'admin'
    ? next()
    : res.status(403).json({ message: 'Admin access required' });

module.exports = { protect, adminOnly };