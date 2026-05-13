'use strict';

const router          = require('express').Router();
const PDFDocument      = require('pdfkit');
const { sequelize }   = require('../config/db');
const { Invoice, Payment, Application, PrivateCustomer, DealershipCustomer, Dealership, Vehicle } = require('../models');
const { protect }     = require('../middleware/authMiddleware');

router.use(protect);

// Auto-generate invoice number: INV-YYYY-NNNN
const generateInvoiceNumber = async () => {
  const year  = new Date().getFullYear();
  const count = await Invoice.count();
  return `INV-${year}-${String(count + 1).padStart(4, '0')}`;
};

const fullInclude = [
  { model: Application,        as: 'application',
    include: [{ model: Vehicle, as: 'vehicle' }] },
  { model: PrivateCustomer,    as: 'privateCustomer',  required: false },
  { model: Dealership,         as: 'dealership',       required: false },
  { model: Payment,            as: 'payments',         required: false },
];

// GET /api/invoices
router.get('/', async (req, res) => {
  try {
    const { status, dealership_id, page = 1, limit = 20 } = req.query;
    const where = {};
    if (status)         where.status        = status;
    if (dealership_id)  where.dealership_id = dealership_id;

    const { rows: invoices, count: total } = await Invoice.findAndCountAll({
      where,
      include: fullInclude,
      order:   [['issued_at', 'DESC']],
      limit:   +limit,
      offset:  (+page - 1) * +limit,
      distinct: true,
    });
    res.json({ invoices, total, page: +page, pages: Math.ceil(total / limit) });
  } catch (err) { res.status(500).json({ message: err.message }); }
});

// POST /api/invoices
router.post('/', async (req, res) => {
  try {
    const { subtotal, vat_included = true, ...rest } = req.body;
    const vat   = vat_included ? parseFloat((subtotal * 0.15).toFixed(2)) : 0;
    const total = parseFloat((+subtotal + vat).toFixed(2));
    const invoice_number = await generateInvoiceNumber();
    const invoice = await Invoice.create({ ...rest, subtotal, vat, total, invoice_number });
    res.status(201).json(invoice);
  } catch (err) { res.status(400).json({ message: err.message }); }
});

// GET /api/invoices/:id
router.get('/:id', async (req, res) => {
  try {
    const invoice = await Invoice.findByPk(req.params.id, { include: fullInclude });
    if (!invoice) return res.status(404).json({ message: 'Invoice not found' });
    res.json(invoice);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

// PUT /api/invoices/:id
router.put('/:id', async (req, res) => {
  try {
    const invoice = await Invoice.findByPk(req.params.id);
    if (!invoice) return res.status(404).json({ message: 'Invoice not found' });
    await invoice.update(req.body);
    res.json(invoice);
  } catch (err) { res.status(400).json({ message: err.message }); }
});

// PATCH /api/invoices/:id/mark-paid
router.patch('/:id/mark-paid', async (req, res) => {
  try {
    const invoice = await Invoice.findByPk(req.params.id);
    if (!invoice) return res.status(404).json({ message: 'Invoice not found' });
    await invoice.update({ status: 'paid', paid_at: new Date() });
    res.json(invoice);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

// POST /api/invoices/:id/payments  — record a payment
router.post('/:id/payments', async (req, res) => {
  try {
    const invoice = await Invoice.findByPk(req.params.id);
    if (!invoice) return res.status(404).json({ message: 'Invoice not found' });
    const payment = await Payment.create({ ...req.body, invoice_id: invoice.id });
    // Check if fully paid
    const totalPaid = await Payment.sum('amount', { where: { invoice_id: invoice.id } });
    if (totalPaid >= invoice.total) await invoice.update({ status: 'paid', paid_at: new Date() });
    res.status(201).json(payment);
  } catch (err) { res.status(400).json({ message: err.message }); }
});

// GET /api/invoices/:id/pdf
router.get('/:id/pdf', async (req, res) => {
  try {
    const invoice = await Invoice.findByPk(req.params.id, { include: fullInclude });
    if (!invoice) return res.status(404).json({ message: 'Invoice not found' });

    const doc = new PDFDocument({ margin: 50 });
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="${invoice.invoice_number}.pdf"`);
    doc.pipe(res);

    const BRAND = '#1d4ed8';
    const LIGHT = '#f1f5f9';
    const GREY  = '#64748b';

    // Header band
    doc.rect(0, 0, 595, 80).fill(BRAND);
    doc.fontSize(22).font('Helvetica-Bold').fillColor('#fff').text('FleetCore', 50, 22);
    doc.fontSize(10).font('Helvetica').fillColor('#bfdbfe')
      .text('Licensing & Registration Services', 50, 50);

    // Invoice number + dates
    doc.fontSize(14).font('Helvetica-Bold').fillColor('#fff')
      .text(invoice.invoice_number, 350, 22, { align: 'right' });
    doc.fontSize(9).font('Helvetica').fillColor('#bfdbfe')
      .text(`Date: ${new Date(invoice.issued_at).toLocaleDateString('en-ZA')}`, 350, 44, { align: 'right' });
    if (invoice.due_date)
      doc.text(`Due: ${new Date(invoice.due_date).toLocaleDateString('en-ZA')}`, 350, 56, { align: 'right' });

    // Bill to block
    doc.rect(50, 100, 495, 70).fill(LIGHT);
    doc.fontSize(8).font('Helvetica-Bold').fillColor(GREY).text('BILL TO', 62, 110);
    const billTo = invoice.privateCustomer
      ? `${invoice.privateCustomer.first_name} ${invoice.privateCustomer.last_name}`
      : invoice.dealership?.name || 'N/A';
    const billPhone = invoice.privateCustomer?.phone || invoice.dealership?.phone || '';
    const billEmail = invoice.privateCustomer?.email || invoice.dealership?.email || '';
    doc.fontSize(11).font('Helvetica-Bold').fillColor('#000').text(billTo, 62, 122);
    doc.fontSize(9).font('Helvetica').fillColor('#333')
      .text(billPhone, 62, 138).text(billEmail, 62, 151);

    // Vehicle info
    const vehicle = invoice.application?.vehicle;
    if (vehicle) {
      doc.rect(50, 185, 495, 50).fill(LIGHT);
      doc.fontSize(8).font('Helvetica-Bold').fillColor(GREY).text('VEHICLE', 62, 195);
      doc.fontSize(10).font('Helvetica-Bold').fillColor('#000')
        .text(`${vehicle.make} ${vehicle.model} (${vehicle.year})`, 62, 207);
      doc.fontSize(9).font('Helvetica').fillColor('#333')
        .text(`VIN: ${vehicle.vin}${vehicle.reg_number ? '   Reg: ' + vehicle.reg_number : ''}`, 62, 220);
    }

    // Application type badge
    const appType = invoice.application?.app_type === 'new_registration'
      ? 'New Registration' : 'Ownership Transfer';
    doc.roundedRect(50, 250, 160, 22, 4).fill(BRAND);
    doc.fontSize(9).font('Helvetica-Bold').fillColor('#fff').text(appType, 58, 256);

    // Line: service description + licensing fee
    const tableY = 290;
    doc.rect(50, tableY, 495, 20).fill(BRAND);
    doc.fontSize(9).font('Helvetica-Bold').fillColor('#fff')
      .text('Description', 60, tableY + 6)
      .text('Amount (R)', 470, tableY + 6, { align: 'right' });

    let y = tableY + 28;
    const lines = [
      { description: `${appType} — Service Fee`, amount: +invoice.subtotal },
    ];
    lines.forEach((item, idx) => {
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
      .text(`R ${(+invoice.subtotal).toFixed(2)}`, 470, y, { align: 'right' });
    if (+invoice.vat > 0) {
      y += 16;
      doc.text('VAT (15%)', 370, y)
        .text(`R ${(+invoice.vat).toFixed(2)}`, 470, y, { align: 'right' });
    }
    y += 20;
    doc.rect(350, y - 4, 195, 22).fill(BRAND);
    doc.fontSize(11).font('Helvetica-Bold').fillColor('#fff')
      .text('TOTAL', 370, y + 2)
      .text(`R ${(+invoice.total).toFixed(2)}`, 470, y + 2, { align: 'right' });

    // Status stamp
    y += 40;
    const statusColors = { paid: '#16a34a', sent: '#d97706', overdue: '#dc2626', draft: '#6b7280', cancelled: '#6b7280' };
    const sc = statusColors[invoice.status] || '#6b7280';
    doc.rect(50, y, 90, 24).stroke(sc);
    doc.fontSize(11).font('Helvetica-Bold').fillColor(sc)
      .text(invoice.status.toUpperCase(), 56, y + 7);

    // Footer
    doc.fontSize(8).fillColor(GREY).font('Helvetica')
      .text('FleetCore — Licensing & Registration Services', 50, 750, { align: 'center' })
      .text('Generated automatically. Queries: support@fleetcore.co.za', 50, 762, { align: 'center' });

    doc.end();
  } catch (err) { res.status(500).json({ message: err.message }); }
});

module.exports = router;