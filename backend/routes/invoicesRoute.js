//invoicesRoute.js

"use strict";

const router = require('express').Router();
const PDFDocument = require('pdfkit');
const { Invoice } = require('../models');
const { protect } = require('../middleware/authMiddleware');

router.use(protect);

router.get('/', async (req, res) => {
  try {
    const { status, companyId, page = 1, limit = 20 } = req.query;
    const q = {};
    if (status) q.status = status;
    if (companyId) q.companyId = companyId;
    const [invoices, total] = await Promise.all([
      Invoice.find(q)
        .populate('companyId', 'name')
        .populate('vehicleId', 'registrationNumber make model')
        .populate('driverId', 'fullName')
        .populate('clerkId', 'name')
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(+limit),
      Invoice.countDocuments(q),
    ]);
    res.json({ invoices, total, page: +page, pages: Math.ceil(total / limit) });
  } catch (err) { res.status(500).json({ message: err.message }); }
});

router.post('/', async (req, res) => {
  try {
    const { lineItems, vatIncluded = true, ...rest } = req.body;
    const subtotal = lineItems.reduce((s, i) => s + i.amount, 0);
    const vatAmount = vatIncluded ? parseFloat((subtotal * 0.15).toFixed(2)) : 0;
    const total = parseFloat((subtotal + vatAmount).toFixed(2));
    const invoice = await Invoice.create({
      ...rest, lineItems, subtotal, vatIncluded, vatAmount, total,
      clerkId: req.user._id,
    });
    await invoice.populate('companyId', 'name');
    res.status(201).json(invoice);
  } catch (err) { res.status(400).json({ message: err.message }); }
});

router.get('/:id', async (req, res) => {
  try {
    const invoice = await Invoice.findById(req.params.id)
      .populate('companyId').populate('vehicleId').populate('driverId').populate('clerkId', 'name email');
    if (!invoice) return res.status(404).json({ message: 'Invoice not found' });
    res.json(invoice);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

router.put('/:id', async (req, res) => {
  try {
    const invoice = await Invoice.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!invoice) return res.status(404).json({ message: 'Invoice not found' });
    res.json(invoice);
  } catch (err) { res.status(400).json({ message: err.message }); }
});

router.patch('/:id/mark-paid', async (req, res) => {
  try {
    const invoice = await Invoice.findByIdAndUpdate(
      req.params.id,
      { status: 'paid', paidAt: new Date() },
      { new: true }
    );
    if (!invoice) return res.status(404).json({ message: 'Invoice not found' });
    res.json(invoice);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

// GET /api/invoices/:id/pdf — stream PDF to browser
router.get('/:id/pdf', async (req, res) => {
  try {
    const invoice = await Invoice.findById(req.params.id)
      .populate('companyId').populate('vehicleId').populate('driverId').populate('clerkId', 'name');
    if (!invoice) return res.status(404).json({ message: 'Invoice not found' });

    const doc = new PDFDocument({ margin: 50 });
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="${invoice.invoiceNumber}.pdf"`);
    doc.pipe(res);

    const BRAND = '#1d4ed8';
    const LIGHT  = '#f1f5f9';
    const GREY   = '#64748b';

    // Header band
    doc.rect(0, 0, 595, 80).fill(BRAND);
    doc.fontSize(22).font('Helvetica-Bold').fillColor('#fff').text('FleetCore', 50, 22);
    doc.fontSize(10).font('Helvetica').fillColor('#bfdbfe')
      .text('Fleet Management & Service Invoicing', 50, 50);

    // Invoice meta — right side
    doc.fontSize(14).font('Helvetica-Bold').fillColor('#fff')
      .text(invoice.invoiceNumber, 350, 22, { align: 'right' });
    doc.fontSize(9).font('Helvetica').fillColor('#bfdbfe')
      .text(`Date: ${new Date(invoice.createdAt).toLocaleDateString('en-ZA')}`, 350, 44, { align: 'right' });
    if (invoice.dueDate)
      doc.text(`Due: ${new Date(invoice.dueDate).toLocaleDateString('en-ZA')}`, 350, 56, { align: 'right' });

    // Bill to + vehicle info
    doc.rect(50, 100, 240, 90).fill(LIGHT);
    doc.rect(305, 100, 240, 90).fill(LIGHT);

    doc.fontSize(8).font('Helvetica-Bold').fillColor(GREY).text('BILL TO', 62, 110);
    const co = invoice.companyId;
    doc.fontSize(10).font('Helvetica-Bold').fillColor('#000')
      .text(co.name, 62, 122, { width: 216 });
    doc.fontSize(9).font('Helvetica').fillColor('#333')
      .text(co.phone, 62, 138)
      .text(co.email || '', 62, 151)
      .text(co.address || '', 62, 164, { width: 216 });

    if (invoice.vehicleId) {
      const v = invoice.vehicleId;
      doc.fontSize(8).font('Helvetica-Bold').fillColor(GREY).text('VEHICLE', 317, 110);
      doc.fontSize(10).font('Helvetica-Bold').fillColor('#000')
        .text(`${v.make} ${v.model}`, 317, 122);
      doc.fontSize(9).font('Helvetica').fillColor('#333')
        .text(`Reg: ${v.registrationNumber}`, 317, 138);
      if (invoice.driverId)
        doc.text(`Driver: ${invoice.driverId.fullName}`, 317, 151);
    }

    // Service type badge
    const serviceLabels = {
      service: 'Vehicle Service', licence_renewal: 'Licence Renewal',
      roadworthy: 'Roadworthy Certificate', tyres: 'Tyre Replacement',
      repairs: 'Mechanical Repairs', other: 'Other Services',
    };
    doc.roundedRect(50, 205, 150, 22, 4).fill(BRAND);
    doc.fontSize(9).font('Helvetica-Bold').fillColor('#fff')
      .text(serviceLabels[invoice.serviceType] || invoice.serviceType, 58, 211);

    // Line items table header
    const tableY = 245;
    doc.rect(50, tableY, 495, 20).fill(BRAND);
    doc.fontSize(9).font('Helvetica-Bold').fillColor('#fff')
      .text('Description', 60, tableY + 6)
      .text('Amount (R)', 470, tableY + 6, { align: 'right' });

    let y = tableY + 28;
    invoice.lineItems.forEach((item, idx) => {
      if (idx % 2 === 0) doc.rect(50, y - 4, 495, 18).fill('#f8fafc');
      doc.fontSize(9).font('Helvetica').fillColor('#333')
        .text(item.description, 60, y)
        .text(`R ${item.amount.toFixed(2)}`, 470, y, { align: 'right' });
      y += 20;
    });

    // Totals
    y += 10;
    doc.moveTo(350, y).lineTo(545, y).stroke('#e2e8f0');
    y += 10;
    doc.fontSize(9).font('Helvetica').fillColor('#333')
      .text('Subtotal', 370, y)
      .text(`R ${invoice.subtotal.toFixed(2)}`, 470, y, { align: 'right' });
    if (invoice.vatIncluded) {
      y += 16;
      doc.text('VAT (15%)', 370, y)
        .text(`R ${invoice.vatAmount.toFixed(2)}`, 470, y, { align: 'right' });
    }
    y += 20;
    doc.rect(350, y - 4, 195, 22).fill(BRAND);
    doc.fontSize(11).font('Helvetica-Bold').fillColor('#fff')
      .text('TOTAL', 370, y + 2)
      .text(`R ${invoice.total.toFixed(2)}`, 470, y + 2, { align: 'right' });

    // Status stamp
    y += 40;
    const statusColors = { paid: '#16a34a', issued: '#d97706', overdue: '#dc2626', draft: '#6b7280' };
    const sc = statusColors[invoice.status] || '#6b7280';
    doc.rect(50, y, 80, 24).stroke(sc);
    doc.fontSize(11).font('Helvetica-Bold').fillColor(sc)
      .text(invoice.status.toUpperCase(), 56, y + 7);

    // Footer
    doc.fontSize(8).fillColor(GREY).font('Helvetica')
      .text('FleetCore — Fleet Management & Service Invoicing', 50, 750, { align: 'center' })
      .text('Generated automatically. Queries: support@fleetcore.co.za', 50, 762, { align: 'center' });

    doc.end();
  } catch (err) { res.status(500).json({ message: err.message }); }
});

module.exports = router;