'use strict';

const cron         = require('node-cron');
const nodemailer   = require('nodemailer');
const { Op }       = require('sequelize');
const { Invoice }  = require('../models');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS },
});

const sendEmail = async (to, subject, html) => {
  await transporter.sendMail({
    from: `FleetCore <${process.env.EMAIL_USER}>`,
    to, subject, html,
  });
};

const startReminderJob = () => {
  // Runs daily at 08:00
  cron.schedule('0 8 * * *', async () => {
    console.log('[Cron] Checking overdue invoices...');
    try {
      const today = new Date();

      // Mark sent invoices as overdue if due_date has passed
      const [overdueCount] = await Invoice.update(
        { status: 'overdue' },
        {
          where: {
            status:   'sent',
            due_date: { [Op.lt]: today },
          },
        }
      );
      if (overdueCount > 0) console.log(`[Cron] Marked ${overdueCount} invoice(s) as overdue`);

      // Find newly overdue invoices to send email alerts
      const overdue = await Invoice.findAll({
        where: {
          status:   'overdue',
          due_date: {
            [Op.between]: [
              new Date(today.getFullYear(), today.getMonth(), today.getDate() - 1),
              today,
            ],
          },
        },
        include: [
          { model: require('../models/PrivateCustomer'), as: 'privateCustomer', required: false },
          { model: require('../models/Dealership'),      as: 'dealership',      required: false },
        ],
      });

      let sent = 0;
      for (const inv of overdue) {
        const recipient = inv.privateCustomer?.email || inv.dealership?.email;
        const name      = inv.privateCustomer
          ? `${inv.privateCustomer.first_name} ${inv.privateCustomer.last_name}`
          : inv.dealership?.name;
        if (!recipient) continue;

        const html = `
          <div style="font-family:sans-serif;max-width:560px">
            <div style="background:#1d4ed8;padding:20px;border-radius:8px 8px 0 0">
              <h2 style="color:#fff;margin:0">FleetCore Payment Reminder</h2>
            </div>
            <div style="padding:24px;border:1px solid #e2e8f0;border-top:none;border-radius:0 0 8px 8px">
              <p>Hi ${name},</p>
              <p>Invoice <strong>${inv.invoice_number}</strong> for
                <strong>R ${(+inv.total).toFixed(2)}</strong>
                was due on <strong>${new Date(inv.due_date).toLocaleDateString('en-ZA')}</strong>
                and is now overdue.
              </p>
              <p>Please arrange payment as soon as possible to avoid further delays.</p>
              <p style="margin-top:24px;color:#64748b;font-size:13px">
                FleetCore — Licensing & Registration Services
              </p>
            </div>
          </div>`;

        await sendEmail(recipient, `Payment overdue — ${inv.invoice_number}`, html);
        sent++;
      }
      console.log(`[Cron] Done — ${sent} overdue reminder(s) sent`);
    } catch (err) {
      console.error('[Cron] Error:', err.message);
    }
  });
  console.log('[Cron] Overdue invoice check scheduled (daily 08:00)');
};

module.exports = { startReminderJob };