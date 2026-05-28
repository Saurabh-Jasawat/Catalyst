# Catalyst - Study Tracker Web Application

A comprehensive study tracking application built with the MERN stack (MongoDB, Express, React, Node.js). Catalyst helps students organize their exams, track syllabi, and plan their study schedules efficiently.

## ✨ Features

- **User Authentication**: Secure login and registration with JWT
- **Exam Management**: Create, manage, and switch between multiple exams
- **Syllabus Tracking**: Track subjects and topics covered in your studies
- **Study Planning**: Interactive planner to organize study sessions
- **Snapshots**: Save study progress snapshots for later review
- **Responsive Dashboard**: Clean, intuitive user interface built with React and Tailwind CSS
- **Email Notifications**: Set up email reminders for important study sessions

## 🛠️ Tech Stack

**Frontend:**
- React 19.2.6
- Vite 8.0.12
- Tailwind CSS 4.3.0
- React Router DOM 7.15.1
- Recharts 3.8.1 (for data visualization)
- Lucide React (for icons)

**Backend:**
- Node.js with Express 4.19.2
- MongoDB 8.4.1 with Mongoose
- JWT authentication with jsonwebtoken 9.0.2
- Bcrypt for password hashing
- CORS enabled for cross-origin requests
- Nodemailer for email notifications

## 📋 Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v14 or higher)
- **npm** (v6 or higher)
- **MongoDB** (running locally or MongoDB Atlas connection string)

## ⚙️ Installation

### 1. Clone the repository

```bash
git clone https://github.com/YOUR_USERNAME/Catalyst.git
cd Catalyst
```

### 2. Install dependencies

```bash
# Install both backend and frontend dependencies
npm run build

# Or install them separately:
npm run install-backend
npm run install-frontend
```

### 3. Set up environment variables

Create a `.env` file in the `backend` folder:

```env
# MongoDB Connection
MONGODB_URI=mongodb://127.0.0.1:27017/catalyst
# For MongoDB Atlas, use: mongodb+srv://username:password@cluster.mongodb.net/catalyst

# Node Environment
NODE_ENV=development

# JWT Secret (create a strong random string)
JWT_SECRET=your_jwt_secret_key_here

# Email Configuration (optional, for notifications)
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_password
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
```

Create a `.env` file in the `frontend` folder (if needed):

```env
VITE_API_URL=http://localhost:5000
```

## 🚀 Running the Application

### Option 1: Run both backend and frontend in separate terminals

**Terminal 1 - Backend:**
```bash
cd backend
npm run dev
```
Backend will start on `http://localhost:5000`

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
```
Frontend will start on `http://localhost:5173`

### Option 2: Run directly from root

```bash
npm start
```
This will run the backend in production mode on port 5000.

## 📁 Project Structure

```
Catalyst/
├── backend/
│   ├── config/
│   │   └── db.js                 # MongoDB connection
│   ├── middleware/
│   │   └── auth.js               # JWT authentication middleware
│   ├── models/
│   │   ├── User.js              # User schema
│   │   ├── ExamData.js          # Exam data schema
│   │   └── Snapshot.js          # Study snapshot schema
│   ├── routes/
│   │   ├── auth.js              # Authentication routes
│   │   ├── exam.js              # Exam management routes
│   │   └── snapshot.js          # Snapshot routes
│   ├── package.json
│   ├── server.js                # Express server entry point
│   └── setup-email.js           # Email configuration setup
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Dashboard.jsx    # Main dashboard
│   │   │   ├── Login.jsx        # Login page
│   │   │   ├── ExamSetup.jsx    # Exam creation
│   │   │   ├── ExamSwitcher.jsx # Switch between exams
│   │   │   ├── SyllabusTracker.jsx
│   │   │   ├── Planner.jsx      # Study planner
│   │   │   └── ...other components
│   │   ├── context/
│   │   │   └── AppContext.jsx   # Global app state
│   │   ├── data/
│   │   │   └── examsData.jsx    # Sample exam data
│   │   ├── App.jsx              # Main app component
│   │   └── main.jsx             # React entry point
│   ├── package.json
│   ├── vite.config.js
│   ├── tailwind.config.js
│   └── index.html
│
├── package.json                  # Root package.json
└── README.md                     # This file
```

## 🔐 Authentication

The application uses JWT (JSON Web Tokens) for authentication:

1. Users register with email and password
2. Password is hashed using bcryptjs
3. JWT token is issued on successful login
4. Token is stored in localStorage on the client
5. All protected routes require valid JWT token

## 📧 Email Setup (Optional)

To enable email notifications:

1. For Gmail: Create an [App Password](https://support.google.com/accounts/answer/185833)
2. Add credentials to `.env` file in backend folder
3. Run setup script:
   ```bash
   cd backend
   npm run setup-email
   ```

## 🐛 Troubleshooting

### MongoDB connection fails
- Ensure MongoDB is running: `mongod`
- Check `MONGODB_URI` in `.env` file
- For MongoDB Atlas, verify connection string format and network access

### Port already in use
- Backend default: 5000
- Frontend default: 5173
- Change ports in respective config files if needed

### Dependencies installation issues
- Clear npm cache: `npm cache clean --force`
- Delete `node_modules` and `package-lock.json`
- Reinstall: `npm install`

### CORS errors
- Backend already has CORS enabled for development
- For production, update `cors` configuration in `backend/server.js`

## 📝 Available Scripts

### Root level:
- `npm run install-backend` - Install backend dependencies
- `npm run install-frontend` - Install frontend dependencies
- `npm run build-frontend` - Build frontend for production
- `npm run build` - Install and build everything
- `npm start` - Start backend server in production mode

### Backend:
- `npm run dev` - Start with nodemon (auto-reload)
- `npm start` - Start server
- `npm run setup-email` - Configure email settings

### Frontend:
- `npm run dev` - Start Vite dev server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## 🚢 Deployment

The application is configured for deployment on Render or Railway:

1. Connect your GitHub repository
2. Set environment variables in the platform
3. The app will auto-build and deploy
4. Frontend build is served from the backend's `/dist` folder

## 👥 Contributing

Feel free to submit issues and enhancement requests!

## 📄 License

This project is open source and available under the MIT License.

## 📧 Support

For issues or questions, please open an issue on the GitHub repository.

---

**Happy studying with Catalyst! 🎓**
