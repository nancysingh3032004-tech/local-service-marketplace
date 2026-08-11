# Local Service Marketplace

A MERN-stack implementation based on the submitted Local Service Marketplace synopsis.

## Included MVP modules
- Customer / Provider / Admin registration and login with JWT + bcrypt
- Service discovery and provider listing
- Normal and emergency booking
- Provider accept/reject and job-status updates
- Before/after photo upload
- QR-based job completion verification
- Customer/provider chat API (REST MVP; Socket.IO-ready structure)
- Payment status and automatic invoice generation
- Provider ratings/reviews and trust score
- Admin analytics dashboard
- Multi-language UI selector (English/Hindi)
- Maintenance reminders
- Role-based authorization

## Technology
Frontend: React.js
Backend: Node.js + Express.js
Database: MongoDB
Authentication: JWT + bcrypt
QR: qrcode
Charts: Recharts
File upload: Multer (local development storage)
PDF invoice: PDFKit

## Run
1. Install Node.js and MongoDB.
2. Open `backend/.env.example`, copy it to `backend/.env`, and update values.
3. Run:
   - `cd backend && npm install && npm run seed`
   - `npm run dev`
4. In another terminal:
   - `cd frontend && npm install`
   - `npm start`

Frontend: http://localhost:3000
Backend: http://localhost:5000

Seed accounts:
- Admin: admin@lsm.local / Admin@123
- Provider: provider@lsm.local / Provider@123
- Customer: customer@lsm.local / Customer@123

This is an academic MVP. Real payment gateway, cloud storage, production email/SMS,
live geolocation and production-grade QR tamper protection require external services
and credentials.
