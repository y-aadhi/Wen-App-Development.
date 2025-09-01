# Wen-App-Development.
Full Stack Developer Task - OralVis Healthcare
# OralVis Healthcare

## Tech Stack
- Frontend: React + Vite
- Backend: Node.js + Express
- Database: SQLite
- File Storage: Cloudinary
- PDF Generation: PDFKit

## Features
- Login with Technician / Dentist roles
- Technician: Upload patient scans
- Dentist: View scans and download PDF reports

## Setup
### Backend
```bash
cd backend
npm install
touch .env  # Add CLOUD_NAME, CLOUD_API_KEY, CLOUD_API_SECRET, JWT_SECRET
npm run dev
