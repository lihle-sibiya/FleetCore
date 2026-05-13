# FleetCore Backend — File Structure

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
| isDeleted soft delete| Hard delete (destroy())          |