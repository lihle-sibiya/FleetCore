'use strict';

const router        = require('express').Router();
const { Op, fn, col, literal } = require('sequelize');
const { sequelize } = require('../config/db');
const { Invoice, Application, Vehicle, Dealership, PrivateCustomer, Payment } = require('../models');
const { protect }   = require('../middleware/authMiddleware');

router.use(protect);

// GET /api/dashboard/summary
router.get('/summary', async (req, res) => {
  try {
    const now           = new Date();
    const startOfMonth  = new Date(now.getFullYear(), now.getMonth(), 1);
    const startOfLast   = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const endOfLast     = new Date(now.getFullYear(), now.getMonth(), 0);

    const [
      totalDealerships,
      totalVehicles,
      totalApplications,
      revenueThisMonth,
      revenueLastMonth,
      outstandingAmount,
      overdueCount,
      recentInvoices,
      monthlyRevenue,
    ] = await Promise.all([

      Dealership.count(),
      Vehicle.count(),
      Application.count(),

      // Revenue this month (paid invoices)
      Payment.sum('amount', {
        where: { paid_at: { [Op.gte]: startOfMonth } },
      }),

      // Revenue last month
      Payment.sum('amount', {
        where: { paid_at: { [Op.between]: [startOfLast, endOfLast] } },
      }),

      // Outstanding (sent + overdue invoices)
      Invoice.sum('total', {
        where: { status: { [Op.in]: ['sent', 'overdue'] } },
      }),

      Invoice.count({ where: { status: 'overdue' } }),

      // Recent invoices
      Invoice.findAll({
        include: [
          { model: PrivateCustomer, as: 'privateCustomer', required: false,
            attributes: ['first_name', 'last_name'] },
          { model: Dealership,      as: 'dealership',      required: false,
            attributes: ['name'] },
          { model: Application,     as: 'application',     required: false,
            attributes: ['app_type'] },
        ],
        order: [['issued_at', 'DESC']],
        limit: 6,
        attributes: ['id', 'invoice_number', 'status', 'total', 'issued_at'],
      }),

      // 6-month revenue chart — raw SQL for MySQL date grouping
      sequelize.query(`
        SELECT
          YEAR(p.paid_at)  AS yr,
          MONTH(p.paid_at) AS mo,
          SUM(p.amount)    AS revenue,
          COUNT(p.id)      AS jobs
        FROM payments p
        WHERE p.paid_at >= DATE_SUB(NOW(), INTERVAL 6 MONTH)
        GROUP BY YEAR(p.paid_at), MONTH(p.paid_at)
        ORDER BY yr ASC, mo ASC
      `, { type: sequelize.QueryTypes.SELECT }),
    ]);

    const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
    const chartData = monthlyRevenue.map((m) => ({
      month:   months[m.mo - 1],
      revenue: parseFloat(m.revenue || 0),
      jobs:    m.jobs,
    }));

    res.json({
      totalDealerships,
      totalVehicles,
      totalApplications,
      revenueThisMonth:  revenueThisMonth  || 0,
      revenueLastMonth:  revenueLastMonth  || 0,
      outstandingAmount: outstandingAmount || 0,
      overdueCount,
      recentInvoices,
      monthlyRevenue: chartData,
    });
  } catch (err) { res.status(500).json({ message: err.message }); }
});

// GET /api/dashboard/pending  — applications not yet completed
router.get('/pending', async (req, res) => {
  try {
    const applications = await Application.findAll({
      where: {
        status: { [Op.notIn]: ['completed', 'cancelled'] },
      },
      include: [
        { model: Vehicle,            as: 'vehicle' },
        { model: PrivateCustomer,    as: 'privateCustomer',    required: false },
        { model: Application.associations?.dealershipCustomer
            ? Application.associations.dealershipCustomer.target : require('../models/DealershipCustomer'),
          as: 'dealershipCustomer', required: false },
      ],
      order: [['created_at', 'ASC']],
    });
    res.json(applications);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

module.exports = router;