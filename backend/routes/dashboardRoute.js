"use strict";

const router = require('express').Router();
const { Invoice, Company, Vehicle } = require('../models');
const { protect } = require('../middleware/auth');

router.use(protect);

router.get('/summary', async (req, res) => {
  try {
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const endOfLastMonth = new Date(now.getFullYear(), now.getMonth(), 0);

    const [
      totalCompanies, totalVehicles, totalInvoices,
      revenueThisMonth, revenueLastMonth,
      outstanding, overdueCount,
      recentInvoices, monthlyRevenue,
    ] = await Promise.all([
      Company.countDocuments({ isDeleted: false }),
      Vehicle.countDocuments(),
      Invoice.countDocuments(),

      Invoice.aggregate([
        { $match: { status: 'paid', paidAt: { $gte: startOfMonth } } },
        { $group: { _id: null, total: { $sum: '$total' } } },
      ]),
      Invoice.aggregate([
        { $match: { status: 'paid', paidAt: { $gte: startOfLastMonth, $lte: endOfLastMonth } } },
        { $group: { _id: null, total: { $sum: '$total' } } },
      ]),
      Invoice.aggregate([
        { $match: { status: { $in: ['issued', 'overdue'] } } },
        { $group: { _id: null, total: { $sum: '$total' } } },
      ]),
      Invoice.countDocuments({ status: 'overdue' }),

      Invoice.find()
        .populate('companyId', 'name')
        .populate('vehicleId', 'registrationNumber')
        .sort({ createdAt: -1 })
        .limit(6)
        .select('invoiceNumber status total createdAt companyId vehicleId serviceType'),

      // 6-month revenue chart data
      Invoice.aggregate([
        {
          $match: {
            status: 'paid',
            paidAt: { $gte: new Date(new Date().setMonth(now.getMonth() - 5)) },
          },
        },
        {
          $group: {
            _id: { year: { $year: '$paidAt' }, month: { $month: '$paidAt' } },
            revenue: { $sum: '$total' },
            count: { $sum: 1 },
          },
        },
        { $sort: { '_id.year': 1, '_id.month': 1 } },
      ]),
    ]);

    // Format monthly revenue for chart
    const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
    const chartData = monthlyRevenue.map((m) => ({
      month: months[m._id.month - 1],
      revenue: m.revenue,
      jobs: m.count,
    }));

    res.json({
      totalCompanies,
      totalVehicles,
      totalInvoices,
      revenueThisMonth: revenueThisMonth[0]?.total || 0,
      revenueLastMonth: revenueLastMonth[0]?.total || 0,
      outstandingAmount: outstanding[0]?.total || 0,
      overdueCount,
      recentInvoices,
      monthlyRevenue: chartData,
    });
  } catch (err) { res.status(500).json({ message: err.message }); }
});

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
    })
      .populate('companyId', 'name phone')
      .populate('driverId', 'fullName phone email')
      .sort({ licenceExpiryDate: 1 });
    res.json(vehicles);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

module.exports = router;