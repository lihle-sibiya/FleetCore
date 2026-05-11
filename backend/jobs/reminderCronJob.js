"use strict";

const cron = require('node-cron');
const nodemailer = require('nodemailer');
const { Reminder, Vehicle, Driver } = require('../models');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS },
});

const REMIND_AT_DAYS = [30, 14, 7];

const sendEmail = async (to, subject, html) => {
  await transporter.sendMail({ from: `FleetCore <${process.env.EMAIL_USER}>`, to, subject, html });
};

const startReminderJob = () => {
  // Runs daily at 08:00
  cron.schedule('0 8 * * *', async () => {
    console.log('[Cron] Running service reminder check...');
    try {
      const pending = await Reminder.find({ status: 'pending' })
        .populate('vehicleId')
        .populate({ path: 'driverId', select: 'fullName email phone' })
        .populate({ path: 'companyId', select: 'name email' });

      const today = new Date();
      let sent = 0;

      for (const reminder of pending) {
        const daysLeft = Math.ceil((new Date(reminder.dueDate) - today) / 86400000);
        if (!REMIND_AT_DAYS.includes(daysLeft)) continue;

        const recipient = reminder.driverId?.email || reminder.companyId?.email;
        if (!recipient) continue;

        const v = reminder.vehicleId;
        const typeLabel = reminder.reminderType === 'licence' ? 'Licence Disc Renewal' : 'Vehicle Service';

        const html = `
          <div style="font-family:sans-serif;max-width:560px">
            <div style="background:#1d4ed8;padding:20px;border-radius:8px 8px 0 0">
              <h2 style="color:#fff;margin:0">FleetCore Reminder</h2>
            </div>
            <div style="padding:24px;border:1px solid #e2e8f0;border-top:none;border-radius:0 0 8px 8px">
              <p>Hi ${reminder.driverId?.fullName || reminder.companyId?.name},</p>
              <p>Your <strong>${typeLabel}</strong> for 
                <strong>${v.make} ${v.model} (${v.registrationNumber})</strong>
                is due in <strong>${daysLeft} days</strong>.
              </p>
              <p>Please contact us to arrange this as soon as possible to avoid penalties.</p>
              <p style="margin-top:24px;color:#64748b;font-size:13px">
                FleetCore — Fleet Management & Service Invoicing
              </p>
            </div>
          </div>`;

        await sendEmail(recipient, `${typeLabel} due in ${daysLeft} days — ${v.registrationNumber}`, html);
        await reminder.updateOne({ reminderSentAt: new Date(), status: 'sent' });
        sent++;
      }
      console.log(`[Cron] Done — ${sent} reminder(s) sent`);
    } catch (err) {
      console.error('[Cron] Error:', err.message);
    }
  });
  console.log('[Cron] Reminder job scheduled (daily 08:00)');
};

module.exports = { startReminderJob };