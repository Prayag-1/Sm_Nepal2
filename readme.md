# Surgical Mart Nepal

Surgical Mart Nepal is a MERN-based ecommerce application focused on medical and surgical supplies for clinics, hospitals, and caregivers in Nepal. The app supports COD checkout, admin product/user/order management, and seeded demo data.

## Tech Stack

- MongoDB, Mongoose
- Express, Node.js
- React (CRA), Redux Toolkit with RTK Query
- Bootstrap 5 (customized)

## Setup

1. Install dependencies
   ```
   npm install
   cd frontend && npm install
   ```
2. Environment
   - Copy `.env.example` to `.env` and set values.
3. Seed data (optional)
   ```
   npm run data:import
   ```
4. Run in development
   ```
   npm run dev
   ```
   - Backend: http://localhost:5000
   - Frontend: http://localhost:3000

## Scripts

- `npm run dev` — run backend with nodemon and frontend concurrently
- `npm run server` — backend only
- `npm run client` — frontend only
- `npm run data:import` / `npm run data:destroy` — seed or reset data
- `npm run build` — install deps and build frontend

## Notes

- Default admin user/password is defined in `backend/data/users.js`.
- Image uploads are stored under `/uploads` locally (or `/var/data/uploads` in production).