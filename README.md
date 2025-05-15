# 🕵️ Agent Management System (MERN Stack)

A powerful, full-featured agent management system built with the MERN stack (MongoDB, Express.js, React, Node.js). This application enables administrators to securely register and login, manage agents, upload leads via CSV, and visualize real-time data through an intuitive dashboard.

## 🚀 Features

- 🔐 **JWT Authentication** – Secure login/register with token-based authentication
- 🧑‍💼 **Agent Management** – Create, read, update, and delete agent profiles
- 📥 **CSV Lead Import** – Upload and distribute leads via CSV files
- 📦 **Batch Processing** – Track and manage lead batches efficiently
- 📋 **Lead Assignment** – Automatically assign leads to agents based on CSV data
- 📊 **Dashboard Analytics** – Comprehensive overview of agents, leads, and batch status
- 🎨 **Responsive UI** – Professional interface with animated transitions
- ⚙️ **Role-based Access Control** – Admin-specific functionalities and permissions
- 🔒 **Protected Routes** – Secure routing on both frontend and backend
- 📁 **File Handling** – Secure CSV upload with validation using Multer

## 📁 Project Structure

```
PROJECT/
├── client/                  # React frontend
│   ├── public/              # Static files
│   └── src/
│       ├── assets/          # Images & static assets
│       ├── components/      # Reusable UI components
│       ├── context/         # Auth context & state management
│       ├── pages/           # Main application screens
│       ├── services/        # API integration services
│       └── App.js           # Main application component
├── server/                  # Node.js + Express backend
│   ├── config/              # Database configuration
│   ├── controllers/         # API route controllers
│   ├── middleware/          # Authentication & error handling
│   ├── models/              # Mongoose data models
│   ├── routes/              # API endpoints
│   ├── utils/               # Helper functions
│   └── server.js            # Entry point
└── README.md
```

## ⚙️ Technologies Used

### Frontend
- React 18
- Tailwind CSS
- Axios for API requests
- React Router DOM (v6)
- Framer Motion for animations
- React Hot Toast for notifications
- Heroicons for UI icons

### Backend
- Node.js
- Express.js
- MongoDB Atlas
- Mongoose ODM
- JWT (jsonwebtoken) for authentication
- Bcrypt.js for password hashing
- Multer for file upload handling
- Dotenv for environment variables

## 🛠 Setup Instructions

### 1. Clone the repository

```bash
git clone https://github.com/yourusername/agent-management.git
cd agent-management
```

### 2. Backend Setup

```bash
cd server
npm install
```

Create a `.env` file in the `/server` directory:
```
NODE_ENV=development
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
JWT_EXPIRE=30d
JWT_COOKIE_EXPIRE=7
```

Start the backend server:
```bash
npm start
```

### 3. Frontend Setup

```bash
cd ../client
npm install
npm start
```

Ensure the proxy configuration in `client/package.json`:
```json
"proxy": "http://localhost:5000"
```

## 📂 CSV Format for Lead Upload

The system accepts CSV files with the following column structure:

```
firstName,lastName,email,phone,assignedTo
Aarav,Sharma,aarav@example.com,9876543210,Anushka Singh
Diya,Mehra,diya@example.com,9123456780,Jatin Srivastava
Kabir,Kapoor,kabir@example.com,9988776655,Anushka Singh
Sanya,Roy,sanya@example.com,9090909090,Jatin Srivastava
```

> **Note**: The `assignedTo` field should match the name of an existing agent in the system.

## ✅ Implemented Features

- ✓ Secure admin authentication with JWT
- ✓ Interactive dashboard with performance metrics
- ✓ CSV lead import with validation
- ✓ Complete agent lifecycle management
- ✓ Batch tracking and lead distribution
- ✓ Responsive and animated user interface
- ✓ Frontend and backend route protection
- ✓ Comprehensive error handling and validation

## 🧑‍💻 Author

Developed by Jatin Srivastava  
📧 jatinsrivastava4104@gmail.com

## 📄 License

This project is licensed under the MIT License.

## 🙌 Contributions

Contributions are welcome! Feel free to open issues for bugs or feature requests, or submit pull requests with improvements.