<!-- # FleetCore Backend — File Structure

```
fleetcore-backend/
├── config/
│   └── db.js                    # Sequelize MySQL connection
├── middleware/
│   └── authMiddleware.js        # JWT protect + adminOnly
├── models/
│   ├── index.js                 # All models + associations
│   ├── User.js
│   ├── Dealership.js
│   ├── PrivateCustomer.js
│   ├── DealershipCustomer.js
│   ├── Vehicle.js
│   ├── Application.js
│   ├── Document.js
│   ├── Invoice.js
│   └── Payment.js
├── routes/
│   ├── authRoute.js             # POST /api/auth/register, /login, GET /me
│   ├── dealershipsRoute.js      # CRUD /api/dealerships
│   ├── customersRoute.js        # /api/customers/private + /api/customers/dealership
│   ├── vehiclesRoute.js         # CRUD /api/vehicles
│   ├── applicationsRoute.js     # CRUD /api/applications
│   ├── documentsRoute.js        # Upload/delete /api/documents/:applicationId
│   ├── invoicesRoute.js         # CRUD + PDF + mark-paid /api/invoices
│   └── dashboardRoute.js        # GET /api/dashboard/summary + /pending
├── utils/
│   └── reminderCron.js          # Daily overdue invoice check + email
├── uploads/                     # Document file storage (auto-created)
├── .env                         # See below
├── package.json
└── server.js
```

## .env file
```
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=your_mysql_password
DB_NAME=fleetcore
JWT_SECRET=your_long_random_secret
FRONTEND_URL=http://localhost:3000
EMAIL_USER=your@gmail.com
EMAIL_PASS=your_gmail_app_password
PORT=5000
```

## Setup
```bash
npm install
node server.js
```

## Key API changes from old MongoDB version
| Old (MongoDB)        | New (MySQL/Sequelize)            |
|----------------------|----------------------------------|
| /api/companies       | /api/dealerships                 |
| /api/drivers         | /api/customers/private or /api/customers/dealership |
| Company.find()       | Dealership.findAll()             |
| findById()           | findByPk()                       |
| $regex / $or         | Op.like / Op.or                  |
| populate()           | include: [{ model, as }]         |
| isDeleted soft delete| Hard delete (destroy())          | -->
\
<div align="center">

# 🚗 FleetCore — Licensing & Registration CRM

**A full-stack SaaS CRM for vehicle licensing clerks in South Africa.**
Process registrations, ownership transfers, and invoices — without the paperwork.

![Node.js](https://img.shields.io/badge/Node.js-18+-339933?style=flat-square&logo=node.js&logoColor=white)
![Express](https://img.shields.io/badge/Express-4.x-000000?style=flat-square&logo=express&logoColor=white)
![React](https://img.shields.io/badge/React-18-61dafb?style=flat-square&logo=react&logoColor=black)
![MySQL](https://img.shields.io/badge/MySQL-8.0-4479A1?style=flat-square&logo=mysql&logoColor=white)
![Sequelize](https://img.shields.io/badge/Sequelize-ORM-52B0E7?style=flat-square&logo=sequelize&logoColor=white)

</div>

---

## 📋 What FleetCore Does

FleetCore is a **Licensing & Registration CRM** built for invoicing clerks who handle:

- 🆕 **New vehicle registrations** — capturing new vehicles into the system with owner details
- 🔄 **Ownership transfers** — processing when a vehicle changes hands between parties
- 📄 **Invoice generation** — creating VAT-inclusive PDF invoices for licensing services
- 💳 **Payment tracking** — recording EFT, cash, card payments against invoices
- 🏢 **Dealership management** — managing dealership accounts and their associated customers
- 👥 **Customer management** — both private individuals and dealership-linked customers
- 🚗 **Vehicle registry** — tracking all registered vehicles with VIN, reg number, owner
- 📊 **Operations dashboard** — revenue stats, pending work, overdue invoice alerts
- 📧 **Automated reminders** — daily cron job emails clients when invoices become overdue

> **Real-world context:** This system replaces manual paperwork, spreadsheets, and WhatsApp messages that licensing clerks typically use to manage their workflow.

---

## 🏗️ System Architecture

```
FleetCore/
├── 📁 backend/              # Node.js + Express REST API
│   ├── config/db.js         # MySQL connection (Sequelize)
│   ├── models/              # Sequelize models (9 tables)
│   ├── routes/              # REST API routes
│   ├── middleware/          # JWT authentication
│   ├── jobs/                # Cron job — overdue invoice checker
│   ├── seed/                # SA fake data seeder (@faker-js)
│   └── server.js            # Entry point — also serves React build
│
├── 📁 frontend/             # React 18 + Vite SPA
│   ├── src/
│   │   ├── pages/           # Dashboard, Applications, Invoices, etc.
│   │   ├── components/      # Layout (dark sidebar) + shared UI
│   │   ├── context/         # Auth context (JWT stored in localStorage)
│   │   ├── hooks/           # useFetch, useDebounce
│   │   └── utils/api.js     # Axios instance with JWT interceptor
│   └── dist/                # Built output (copy to backend for single-URL deploy)
│
└── README.md
```

---

## 🗃️ Database Schema (MySQL)

| Table | Purpose |
|---|---|
| `users` | Admin and clerk accounts with bcrypt passwords |
| `private_customers` | Individual SA clients with ID number |
| `dealerships` | Dealership companies |
| `dealership_customers` | Individuals linked to a dealership |
| `vehicles` | Vehicle registry — VIN, reg number, owner |
| `applications` | Licensing/transfer applications with status pipeline |
| `documents` | Uploaded files (PDFs, images) attached to applications |
| `invoices` | VAT invoices with status (draft → sent → paid) |
| `payments` | Payments recorded against invoices |

---

## ✨ Features

### ✅ Implemented
- 🔐 **JWT authentication** — login with role-based access (admin / clerk)
- 📋 **Applications pipeline** — status tracking: Pending → Docs In → Submitted → Completed
- 🧾 **PDF invoice generation** — auto-numbered invoices with VAT breakdown (pdfkit)
- 💰 **Payment recording** — EFT, cash, card, other
- 📧 **Overdue reminders** — daily cron at 08:00 emails overdue invoice recipients
- 🏢 **Unified customer page** — Private and Dealership customers in one view with tabs
- 🔍 **Live search** — debounced search on customers and dealerships
- 📊 **Revenue dashboard** — 6-month bar chart, stat cards, pending applications
- 🌱 **Database seeder** — realistic SA data for demo (faker-js)
- 🚀 **Single-URL deployment** — Express serves the React build, one port, one domain

### 🔮 Future Development
- 📱 **Mobile app** — React Native companion for field agents
- 📤 **Document uploads to S3** — store licensing docs in AWS S3 instead of local disk
- 📬 **Email invoices** — send PDF invoices directly to clients via Nodemailer
- 🔔 **In-app notifications** — real-time alerts for status changes (Socket.io)
- 📈 **Advanced reporting** — monthly/annual revenue reports with export to Excel
- 🔑 **Role permissions** — granular permissions per route (admin vs clerk restrictions)
- 🌐 **Multi-branch support** — one system, multiple licensing offices
- 📋 **Bulk application processing** — process multiple applications in one batch
- 🗓️ **Renewal calendar** — licence disc expiry calendar with advance reminders

---

## ⚡ Challenges & Solutions

| Challenge | Solution |
|---|---|
| Sequelize model validators firing on status-only updates | Added `{ validate: false }` to bulk `Invoice.update()` in cron job and mark-paid routes |
| Two customer types with different fields | Kept separate MySQL tables (correct for FK integrity), unified in one frontend page with tabs |
| MongoDB seed in a MySQL project | Completely rewrote seed.js using Sequelize + @faker-js/faker with SA-specific data |
| Single URL deployment (no separate frontend host) | Express detects `dist/` folder and serves it statically; React Router catch-all returns `index.html` |
| Frontend blank screen | All Tailwind `className=` replaced with pure inline styles — zero CSS framework dependency |
| Cron job crashing on startup | `validate: false` on bulk Invoice update; fixed associations reference in dashboard route |

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- MySQL 8.0 running locally
- Create a database: `CREATE DATABASE fleetcore;`

### 1️⃣ Backend setup
```bash
cd backend
npm install
cp .env.example .env   # fill in DB_PASSWORD and JWT_SECRET
npm run seed           # populate with SA demo data
npm run dev            # starts on http://localhost:5000
```

### 2️⃣ Frontend setup (development)
```bash
cd frontend
npm install
npm run dev            # starts on http://localhost:5173
```

### 3️⃣ Single-URL production build
```bash
# Build the React app
cd frontend && npm run build

# Copy the output into the backend
cp -r dist ../backend/dist

# Now just run the backend — it serves everything
cd ../backend && npm start
# Visit http://localhost:5000
```

---

## 🔑 Demo Credentials

| Role | Email | Password |
|---|---|---|
| Admin | admin@fleetcore.co.za | Demo1234! |
| Clerk | clerk@fleetcore.co.za | Demo1234! |

---

## 🌍 Deployment (AWS EC2)

```bash
# On your EC2 instance (Ubuntu)
git clone https://github.com/yourusername/FleetCore.git
cd FleetCore

# Install deps
cd backend && npm install
cd ../frontend && npm install && npm run build
cp -r dist ../backend/dist

# Set environment variables
cd ../backend && nano .env

# Run with PM2
npm install -g pm2
pm2 start server.js --name fleetcore
pm2 save && pm2 startup
```

---

## 👨‍💻 Built By

**Thembelihle Sibiya** — AWS Cloud Institute Graduate | Full-Stack Developer  
Cape Town, South Africa 🇿🇦

> FleetCore demonstrates real-world SaaS architecture: REST API, JWT auth, MySQL relational design, automated jobs, PDF generation, and a professional CRM UI — built to solve an actual business problem in the South African vehicle licensing industry.

---

<div align="center">
  <sub>Built with ❤️ in Cape Town · MySQL · Express · React · Node.js</sub>
</div>