# The Grand Lounge | Luxury Event Venue & Lounge Management Platform

A premium, full-stack digital solution tailored for contemporary luxury event curations, master slot reservations, customized package pipelines, and curator-driven CRM control. Built using a modern serverless-ready architecture.

---

## 🌟 Key Features

### 1. Client Experience & Booking Engine
* **Interactive Booking Wizard**: A step-by-step reservation pipeline guiding guests through guest count scaling, occasion selections, and package configurations.
* **Real-time Slot Availability**: Synchronized date picker that blocks out conflicts in real-time (e.g., locking out overlapping Morning/Evening slots when a Full Day slot is reserved).
* **Dynamic Surcharges**: Automatic calculation of upgrade fees (e.g., Full Day booking upgrades calculated dynamically per guest).
* **Client Portal**: Dedicated user dashboard to track inquiry status, view approval states, and handle mock payment deposits.

### 2. Admin Curator Panel
* **Live Overview Analytics**: Dashboard summarizing key metrics (Estimated revenue, active enquiries, approved slots, calendar blockouts) with bold, clean typography.
* **Real-time Enquiry Pipeline**: Real-time polling and updates with toast notifications for incoming client submissions.
* **Master Interactive Calendar**: View scheduled events month-by-month, styled with states for pending/approved slots, and dimmed out past-date grids.
* **Custom CMS Panel**: Admin dashboard tab to control public website components, including live marquee banner alerts and dynamic gallery search descriptors.
* **Pexels Curation Feed**: Dual-pane gallery workspace displaying local featured uploads alongside live curated feeds matching album search terms.

### 3. Under the Hood
* **Dynamic API Proxying**: Frontend handles external backend endpoints securely through Next.js proxy route handlers to prevent browser CORS blocks and protect credentials.
* **Mongoose Connection Pooling**: Safe serverless database connector that monitors connection state directly using Mongoose `readyState` to avoid cold-start timeouts on platforms like Vercel.
* **Pure JS Cryptography**: Migrated from native bindings to pure-JS algorithms to guarantee 100% platform-agnostic serverless deployments.

---

## 🛠️ Technology Stack

| Layer | Technologies Used |
| :--- | :--- |
| **Frontend** | Next.js 14 (App Router), React, TypeScript, Tailwind CSS, Auth.js (NextAuth v5), Jose JWT |
| **Backend** | Node.js, Express.js, TypeScript, Mongoose |
| **Database** | MongoDB Atlas |
| **Email Services** | Nodemailer |

---

## 📁 Repository Structure

```
├── backend/
│   ├── src/
│   │   ├── config/          # DB connection and pooling config
│   │   ├── middleware/      # Admin and client auth verification
│   │   ├── routes/          # Express REST API routes
│   │   ├── models/          # Mongoose database models
│   │   └── server.ts        # Server entry point (Vercel serverless compatible)
│   ├── vercel.json          # Server routing definitions for Vercel
│   └── package.json
│
├── frontend/
│   ├── app/                 # Next.js App Router (pages and API proxies)
│   ├── components/          # Reusable UX layout blocks (Navbar, Footer, etc.)
│   ├── lib/                 # NextAuth settings, email helper and MongoDB configs
│   ├── scripts/             # DB seeding and clear scripts
│   └── package.json
```

---

## ⚙️ Environment Configurations

Create a `.env` file in the `backend/` directory, and a `.env.local` file in the `frontend/` directory.

### Backend Environment Variables (`backend/.env`)
```env
PORT=5000
MONGODB_URI=your_mongodb_atlas_connection_string
CLIENT_URL=http://localhost:3000,https://your-frontend-domain.vercel.app
ADMIN_EMAIL=admin@yourvenue.com
ADMIN_PASSWORD=your_secure_admin_password
EMAIL_USER=your_nodemailer_smtp_email
EMAIL_PASS=your_nodemailer_smtp_password
```

### Frontend Environment Variables (`frontend/.env.local`)
```env
MONGODB_URI=your_mongodb_atlas_connection_string
NEXTAUTH_SECRET=your_nextauth_jwt_signing_secret
NEXTAUTH_URL=http://localhost:3000
AUTH_SECRET=your_nextauth_jwt_signing_secret
AUTH_TRUST_HOST=true
BACKEND_API_URL=http://localhost:5000
NEXT_PUBLIC_PEXELS_API_KEY=your_pexels_curator_feed_api_key
```

---

## 🚀 Getting Started

### 1. Database Setup & Seeding
Ensure your local or remote MongoDB instance is running, and matching environment variables are loaded. Seed the initial admin account by running the following command inside the `frontend/` folder:
```bash
npx tsx scripts/seedAdmin.ts
```

### 2. Run the Backend API
Navigate to the `backend/` directory:
```bash
npm install
npm run dev
```

### 3. Run the Frontend Client
Navigate to the `frontend/` directory:
```bash
npm install
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser to view the client app, or [http://localhost:3000/admin](http://localhost:3000/admin) to log in to the admin curator panel.

---

## 🛡️ Production Deployment (Vercel)

1. **Frontend App**: Deploy the `frontend/` directory. Add all variables listed under `frontend/.env.local` to Vercel Environment Settings. Set `NEXTAUTH_URL` to your production frontend domain (or delete it to let NextAuth v5 auto-detect it).
2. **Backend API**: Deploy the `backend/` directory. Add all variables listed under `backend/.env` to Vercel Environment Settings. Set `CLIENT_URL` to your production frontend domain.
3. **MongoDB Atlas Whitelist**: Ensure that IP whitelist settings in MongoDB Atlas allow access from `0.0.0.0/0` (Allow Access From Anywhere) so that dynamic Vercel serverless outgoing IPs can handshake successfully.
