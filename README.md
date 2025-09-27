# 🏢 Assignment

> **A Full Stack Agent Management & List Distribution System**

---

## 🚀 Project Overview

This project is a robust full-stack web application designed for managing agents and distributing contact lists among them. Built with a modern tech stack (React, Vite, Node.js, Express, MongoDB), it features secure authentication, agent CRUD, CSV/XLSX upload, and automatic list distribution. The system is ideal for call centers, sales teams, or any organization needing to assign leads or contacts to multiple agents efficiently

---

## 🌐 Deployment : https://assignment-client-x254.onrender.com

---
## 📁 Folder Structure

```
Cmpy Project/
├── client/                # Frontend (React + Vite)
│   ├── src/
│   │   ├── components/    # Reusable React components
│   │   ├── context/       # React Context (Auth)
│   │   ├── pages/         # Main pages (Dashboard, Login)
│   │   ├── App.jsx        # Main App component
│   │   ├── main.jsx       # Entry point
│   │   └── index.css      # Tailwind CSS
│   ├── public/
│   ├── package.json       # Frontend dependencies & scripts
│   └── ...
├── server/                # Backend (Node.js + Express)
│   ├── controllers/       # Route logic (auth, agent, list)
│   ├── middleware/        # Auth middleware
│   ├── models/            # Mongoose models (User, Agent, List)
│   ├── routes/            # API route definitions
│   ├── server.js          # Main server file
│   ├── .env               # Environment variables
│   └── package.json       # Backend dependencies
└── README.md              # Project documentation
```

---

## 🛠️ Tech Stack

- **Frontend:** React 19, Vite, Tailwind CSS, Axios, React Router, React Toastify
- **Backend:** Node.js, Express, MongoDB (Mongoose), JWT, Multer, CSV-Parser, XLSX
- **Authentication:** JWT-based, secure token storage
- **File Upload:** Multer (supports CSV/XLSX)
- **Styling:** Tailwind CSS

---

## 📦 Main Dependencies

### Frontend

- `react`, `react-dom`, `react-router-dom`, `axios`, `react-toastify`, `tailwindcss`, `@vitejs/plugin-react`, `eslint`

### Backend

- `express`, `mongoose`, `dotenv`, `bcryptjs`, `jsonwebtoken`, `multer`, `csv-parser`, `xlsx`, `cors`

---

## 🔑 Key Features & Definitions

- **Authentication:**
  - Secure login for admin (JWT token stored in localStorage)
  - Protected routes using custom middleware
- **Agent Management:**
  - Create, view, and manage agents (name, email, mobile, password)
  - Passwords are hashed before storage
- **List Distribution:**
  - Upload CSV/XLSX files containing contact lists
  - Lists are automatically and evenly distributed among agents
  - Each list item is assigned to an agent and stored in MongoDB
- **Agent Dashboard:**
  - View assigned lists per agent
  - Download or view distributed lists
- **Error Handling & Notifications:**
  - User-friendly toast notifications for all actions
  - Robust backend error handling

---

## 📡 API Endpoints & Responses

### Auth

- `POST /api/auth/login`
  - **Request:** `{ email, password }`
  - **Response:** `{ token }` (JWT)
  - **Errors:** `400 Invalid credentials`

### Agents

- `GET /api/agents` (Protected)
  - **Headers:** `x-auth-token: <JWT>`
  - **Response:** `[{ _id, name, email, mobileNumber, listCount }]`
- `POST /api/agents` (Protected)
  - **Headers:** `x-auth-token: <JWT>`
  - **Request:** `{ name, email, mobileNumber, password }`
  - **Response:** `{ message: 'Agent created successfully' }`
  - **Errors:** `400 Agent with this email already exists`

### Lists

- `POST /api/lists/upload` (Protected, file upload)
  - **Headers:** `x-auth-token: <JWT>`
  - **FormData:** `listFile: <CSV/XLSX file>`
  - **Response:** `{ message: 'List distributed successfully' }`
  - **Errors:** `400 No file uploaded`, `400 Invalid file type`
- `GET /api/lists/agent/:agentId` (Protected)
  - **Headers:** `x-auth-token: <JWT>`
  - **Response:** `[{ firstName, phone, notes, assignedTo }]`

---

## 📝 Definitions

- **Agent:** User who receives distributed list items (fields: name, email, mobileNumber, password, listCount)
- **List:** Contact/lead item (fields: firstName, phone, notes, assignedTo)
- **Admin:** User who manages agents and uploads lists (authenticated via JWT)

---

## ⚡ How It Works

1. **Admin Login:** Secure login using email & password
2. **Agent Management:** Add/view agents from dashboard
3. **Upload List:** Admin uploads CSV/XLSX; backend parses and distributes items among agents
4. **View Lists:** Each agent's assigned lists can be viewed/downloaded
5. **Security:** All sensitive routes are protected by JWT auth middleware

---

## 💡 Highlights

- Modern, responsive UI with Tailwind CSS
- Secure authentication and protected API routes
- Automatic, fair distribution of uploaded lists
- Clean, modular codebase (easy to extend)
- Real-time feedback with toast notifications
- Scalable for larger teams and datasets

---

## 👤 Initial Admin User (Insert Example)

To get started, insert an initial admin user into your MongoDB database. You can use the following JSON structure (replace the password hash with a bcrypt hash of `password123`):

```json
{
  "email": "admin@example",
  "password": "$2a$10$REPLACE_WITH_HASHED_PASSWORD"
}
```

> **Tip:** To generate a bcrypt hash for `password123`, you can use an online bcrypt generator or run this in Node.js:
>
> ```js
> const bcrypt = require("bcryptjs");
> bcrypt.hash("password123", 10, (err, hash) => console.log(hash));
> ```

---

## ⚙️ Example .env File Setup

### For `client/.env`:

```env
# Vite environment variables for the frontend
VITE_BACKEND_URL="http://localhost:5000/api"
```

### For `server/.env`:

```env
# Database
MONGO_URI=your_mongodb_connection_string

# Port
PORT=5000

# JWT Secret
JWT_SECRET=your_jwt_secret
```

---

1. **Clone the repository**
2. **Install dependencies** in both `client` and `server` folders:
   ```sh
   cd client && npm install
   cd ../server && npm install
   ```
3. **Set up environment variables** (`.env` files in both folders)
4. **Run the backend:**
   ```sh
   node server.js
   ```
5. **Run the frontend:**
   ```sh
   npm run dev
   ```
6. **Access the app:** Open [http://localhost:5173](http://localhost:5173)

---

> _Empowering your team with seamless agent management and list distribution!_
