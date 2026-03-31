# ResolveDesk – Digital Complaint Portal

[![React 19](https://img.shields.io/badge/React-19.2.0-blue.svg)](https://react.dev/)
[![Node.js](https://img.shields.io/badge/Node.js-18.x-green.svg)](https://nodejs.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-7.x-brightgreen.svg)](https://www.mongodb.com/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4.0-blueviolet.svg)](https://tailwindcss.com/)
[![License: ISC](https://img.shields.io/badge/License-ISC-yellow.svg)](https://opensource.org/licenses/ISC)

**ResolveDesk** is a state-of-the-art, full-stack digital grievance management system built on the **MERN** stack. It provides a seamless, transparent, and efficient way for users to lodge, track, and resolve complaints while empowering administrators with real-time analytics and automated grievance routing.

---

## 🌟 Key Features

### 👤 For Users
- **Secure Registration & Authentication:** JWT-based login and password hashing for data security.
- **Easy Complaint Submission:** Detailed forms with attachment support and category selection.
- **Real-Time Tracking:** Live updates on complaint status via WebSockets.
- **Profile Management:** Manage account details and view history of submitted grievances.
- **Feedback & Ratings:** Provide resolution quality feedback to improve service.

### 🛡️ For Administrators & Staff
- **Advanced Dashboard Analytics:** Interactive charts visualizing trends and resolution rates (powered by Recharts).
- **Grievance Lifecycle Management:** Assign, update, and resolve tickets with ease.
- **Automated SLA Monitoring:** Built-in deadlines (48h default) and escalation logic.
- **User & Staff Management:** Control roles and access permissions across the organization.
- **Notification Engine:** Real-time push notifications for urgent escalations.

---

## 🛠️ Tech Stack

### Frontend
- **Framework:** React 19 (Hooks & Router 7)
- **Styling:** Tailwind CSS v4 (Modern aesthetics & Responsive Design)
- **Icons:** Lucide React
- **Analytics:** Recharts
- **Communication:** Socket.io-client, Axios

### Backend
- **Server:** Node.js & Express.js
- **Database:** MongoDB with Mongoose ODM
- **Real-Time Communication:** Socket.io
- **Security:** JWT (JSON Web Tokens), Bcrypt.js
- **Tooling:** Vite, Concurrently, Nodemon

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v18.x or higher)
- MongoDB (Local or Atlas)
- npm or yarn

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/yourusername/digital-complaint-portal.git
   cd digital-complaint-portal
   ```

2. **Install Dependencies (Root & Backend):**
   ```bash
   # Install root dependencies (React frontend)
   npm install

   # Install backend dependencies
   cd backend
   npm install
   cd ..
   ```

3. **Configure Environment Variables:**
   Create a `.env` file in the `backend/` directory:
   ```env
   PORT=5000
   MONGO_URI=your_mongodb_connection_string
   JWT_SECRET=your_super_secret_key
   ```

4. **Run the Application:**
   From the root directory, run both frontend and backend concurrently:
   ```bash
   npm run dev:full
   ```
   - **Frontend:** http://localhost:5173
   - **Backend:** http://localhost:5000

---



## 📂 Project Structure

```text
Digital-Complaint-Portal/
├── backend/                # Express & Node.js Server
│   ├── models/             # Mongoose Schemas (User, Complaint, etc.)
│   ├── routes/             # API Endpoints
│   ├── controllers/        # Business Logic
│   └── server.js           # Server Entry Point
├── src/                    # React Frontend
│   ├── components/         # Reusable UI Components
│   ├── pages/              # Main Page Views
│   ├── utils/              # API helpers and Constants
│   └── App.jsx             # Main Routing
└── public/                 # Static Assets
```

---

## 📄 License
This project is licensed under the **ISC License**.

## 🤝 Contributing
Contributions, issues, and feature requests are welcome! Feel free to check the [issues page](https://github.com/yourusername/digital-complaint-portal/issues).

---

Built with ❤️ by [Kaveyan](https://github.com/kaveyan18)
