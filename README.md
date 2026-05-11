# FleetCore
A full-stack fleet management &amp; service invoicing platform for logistics companies.
FleetCore 🚛
A full-stack fleet management & service invoicing platform for logistics companies.

Built with the MERN stack, deployed on AWS, with automated service reminders, PDF invoicing, role-based access, and a real-time operations dashboard.

🔗 Live Demo: https://fleetcore.netlify.app
📦 Backend API: https://api.fleetcore.co.za/health

Demo credentials:
Admin — admin@fleetcore.co.za / Demo1234!
Clerk — clerk@fleetcore.co.za / Demo1234!


The Problem This Solves
Fleet managers at small-to-medium logistics companies track vehicle service schedules, roadworthy certificates, and maintenance invoices across spreadsheets, WhatsApp groups, and paper files. When a service is missed or an invoice goes unpaid, it costs money and creates compliance risk.
FleetCore replaces that with:

A centralised vehicle & driver registry
Automated service due / licence expiry reminders (email)
Professional PDF invoices with VAT, per transaction
An operations dashboard showing revenue, outstanding payments, and upcoming renewals
Role-based access — Operations Managers vs Fleet Clerks


Architecture
┌─────────────────────┐     HTTPS      ┌──────────────────────┐
│   React + Vite      │ ─────────────▶ │  Express.js API      │
│   Netlify (CDN)     │                │  AWS EC2 (t2.micro)  │
└─────────────────────┘                │  PM2 process mgr     │
                                       └──────────┬───────────┘
                                                  │
                              ┌───────────────────┼──────────────────┐
                              │                   │                  │
                    ┌─────────▼──────┐  ┌─────────▼──────┐  ┌──────▼──────┐
                    │ MongoDB Atlas  │  │   AWS S3        │  │  AWS SES    │
                    │ (M0 Free Tier) │  │ (Doc uploads)   │  │  (Emails)   │
                    └────────────────┘  └────────────────┘  └─────────────┘
CI/CD: GitHub Actions → auto-deploy backend to EC2 + frontend to Netlify on every push to main

Tech Stack
LayerTechnologyPurposeFrontendReact 18 + ViteSPA, fast HMR in devStylingTailwind CSSUtility-first, fully responsiveStateReact Context + hooksAuth state, no over-engineeringHTTP clientAxios + interceptorsAuto-attach JWT, handle 401 redirectBackendNode.js + ExpressREST APIDatabaseMongoDB + MongooseFlexible schema, Atlas cloud hostedAuthJWT + bcryptjsStateless, role-basedPDFpdfkitServer-side invoice generationEmailNodemailer + Gmail SMTPService due remindersSchedulernode-cronDaily reminder job at 08:00File storageAWS S3 + multer-s3Vehicle document uploadsHosting APIAWS EC2 (t2.micro)Ubuntu 22.04, Nginx reverse proxyHosting FENetlifyStatic deploy, instant CDNCI/CDGitHub ActionsDeploy on push to mainMonitoringAWS CloudWatchEC2 CPU/memory alarms

Features
Core

✅ JWT authentication with refresh — admin and clerk roles
✅ Company + driver registry (CRUD, soft delete, paginated search)
✅ Vehicle registry — make, model, reg number, VIN, service intervals
✅ Service job creation — link vehicle + driver + line items
✅ Auto-calculated VAT (15%) with toggle
✅ Invoice status workflow: draft → issued → paid → overdue
✅ Mark-as-paid with timestamp audit trail
✅ PDF invoice generation — download from browser

Dashboard

✅ Revenue this month vs last month
✅ Outstanding amount (issued + overdue invoices)
✅ 6-month revenue bar chart (Recharts)
✅ Vehicles due for service in next 30 days
✅ 5 most recent invoices with status badges

Automation

✅ Daily cron — checks vehicles with service/licence due in 30, 14, 7 days
✅ Sends personalised reminder emails to registered drivers
✅ Reminder audit log — tracks what was sent and when

DevOps

✅ GitHub Actions CI/CD pipeline
✅ Environment variables via .env (never committed)
✅ PM2 for Node process management on EC2
✅ Nginx as reverse proxy (port 80 → 5000)
✅ CloudWatch alarm on CPU > 80%


Data Models
Company ─────────── Vehicle (many)
    │                   │
    └── Driver (many)   └── ServiceJob/Invoice (many)
                                    │
                            LineItems (embedded)
Company
js{ name, registrationNumber, vatNumber, phone, email, address, isDeleted }
Driver
js{ companyId, fullName, licenceNumber, licenceExpiry, phone, email }
Vehicle
js{ companyId, driverId, make, model, year, colour,
  registrationNumber, vinNumber,
  licenceExpiryDate, nextServiceDate, odometerKm,
  documentUrl }  // S3
Invoice
js{ invoiceNumber,  // auto: FC-0001
  companyId, vehicleId, driverId, clerkId,
  serviceType,  // service | licence_renewal | roadworthy | tyres | other
  lineItems: [{ description, amount }],
  subtotal, vatAmount, total,
  status,  // draft | issued | paid | overdue
  dueDate, paidAt, notes }

Local Setup
bash# 1. Clone
git clone https://github.com/lihle-sibiya/fleetcore.git
cd fleetcore

# 2. Backend
cd backend
npm install
cp .env.example .env   # fill in your values
npm run dev            # runs on :5000

# 3. Seed fake data (companies, vehicles, invoices)
npm run seed

# 4. Frontend (new terminal)
cd ../frontend
npm install
cp .env.example .env   # set VITE_API_URL=http://localhost:5000/api
npm run dev            # runs on :5173

API Endpoints
POST   /api/auth/login
POST   /api/auth/register
GET    /api/auth/me

GET    /api/companies          paginated, searchable
POST   /api/companies
GET    /api/companies/:id      with vehicles + drivers
PUT    /api/companies/:id
DELETE /api/companies/:id      soft delete

GET    /api/vehicles           filter by companyId
POST   /api/vehicles
GET    /api/vehicles/due       service due in N days
GET    /api/vehicles/:id
PUT    /api/vehicles/:id

GET    /api/invoices           filter by status, companyId
POST   /api/invoices           auto-calculates VAT
GET    /api/invoices/:id
PUT    /api/invoices/:id
PATCH  /api/invoices/:id/mark-paid
GET    /api/invoices/:id/pdf   streams PDF to browser

GET    /api/dashboard/summary
GET    /api/dashboard/due

Key Engineering Decisions
Why server-side PDF generation?
PDFs generated in the browser via libraries like jsPDF can differ across devices and printers. Generating on the server with pdfkit ensures consistent output regardless of client. The /pdf route streams directly to the response — no temp files needed.
Why soft delete on companies?
Historical invoices reference a companyId. Hard-deleting a company would orphan invoice records and break financial history. Soft delete (an isDeleted flag) preserves referential integrity without complex cascading deletes.
Why node-cron over AWS EventBridge?
For a single-server deployment at this scale, an in-process cron is simpler to debug, requires no extra AWS cost, and keeps the reminder logic close to the codebase. At scale, this would migrate to a Lambda triggered by EventBridge.
Why JWT over sessions?
The API is stateless and designed to support a mobile client in a future iteration. JWT fits this better than server-side sessions, which would require sticky sessions or a shared session store like Redis.

Folder Structure
fleetcore/
├── backend/
│   ├── models/         Mongoose schemas
│   ├── routes/         Express route handlers
│   ├── middleware/      JWT auth, error handler
│   ├── utils/          PDF generator, email, cron job
│   ├── seed/           Fake data seeders (Faker.js)
│   └── server.js
├── frontend/
│   └── src/
│       ├── components/ Reusable UI components
│       ├── pages/      Route-level page components
│       ├── context/    AuthContext
│       ├── hooks/      useFetch, useDebounce
│       └── utils/      api.js (Axios instance)
└── .github/
    └── workflows/      deploy.yml (GitHub Actions)

AWS Infrastructure
ServiceUsageEC2 t2.microNode/Express API serverS3Vehicle document storageSES (or Gmail SMTP)Reminder emailsCloudWatchCPU alarm, log groupsIAMScoped role for EC2 → S3 access

Roadmap

 WhatsApp reminder integration (Twilio API)
 Mobile app (React Native + Expo)
 Multi-tenant SaaS (company sub-accounts)
 Stripe payment integration for online invoice payments
 Export invoice list to CSV / Excel


Author
Thembelihle Sibiya
Full Stack Developer | AWS Certified Cloud Practitioner
LinkedIn · Portfolio · GitHub
