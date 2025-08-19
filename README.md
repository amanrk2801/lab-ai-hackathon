# Library Management System - Frontend & Backend Connection Guide

## 🚀 Quick Start

### Prerequisites
- Node.js (v14 or higher)
- MySQL Server (v8.0 or higher)
- npm or pnpm package manager

### Setup Instructions

1. **Backend Setup**
   ```bash
   cd librarian-backend
   npm install
   ```

2. **Database Setup**
   - Ensure MySQL is running
   - Update `.env` file with your MySQL credentials:
   ```env
   DB_HOST=localhost
   DB_USER=root
   DB_PASSWORD=your_mysql_password
   DB_NAME=library_management
   ```
   - Initialize the database:
   ```bash
   mysql -u root -p < database/schema.sql
   ```

3. **Frontend Setup**
   ```bash
   cd librarian-spa
   npm install
   ```

4. **Start Both Servers**
   
   **Option A: Use the startup script**
   ```bash
   start-servers.bat
   ```
   
   **Option B: Manual start**
   
   Terminal 1 (Backend):
   ```bash
   cd librarian-backend
   npm start
   ```
   
   Terminal 2 (Frontend):
   ```bash
   cd librarian-spa
   npm run dev
   ```

## 🔗 Connection Details

### API Endpoints
- **Backend**: http://localhost:3000
- **Frontend**: http://localhost:5173 (or as shown in terminal)
- **API Base URL**: http://localhost:3000/api

### Authentication Flow
1. Register a new account at `/register`
2. Login with credentials at `/login`
3. JWT token is automatically stored in localStorage
4. Protected routes require valid token

### Key Integration Points

#### Frontend API Service (`src/services/api.js`)
- Centralized API communication
- Automatic token management
- Error handling for all endpoints

#### Authentication Components
- **Login**: `/src/components/Login.jsx`
- **Register**: `/src/components/Register.jsx`
- **Auth Context**: `/src/contexts/AuthContext.jsx`

#### Backend API Routes
- **Auth**: `/api/auth/*`
- **Books**: `/api/books/*`
- **Members**: `/api/members/*`
- **Issues**: `/api/issues/*`
- **Payments**: `/api/payments/*`
- **Racks**: `/api/racks/*`
- **Copies**: `/api/copies/*`

## 🛠 Features Connected

### ✅ Implemented
- User authentication (login/register)
- JWT token management
- API service layer
- Error handling
- Loading states

### 🔄 Ready for Implementation
- Books management
- Member management
- Issue tracking
- Payment processing
- Rack management
- Book copies management

## 📝 Environment Configuration

### Backend (.env)
```env
PORT=3000
NODE_ENV=development
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=library_management
JWT_SECRET=your_super_secret_jwt_key_here_make_it_long_and_random
```

### Frontend (Vite)
- API base URL is configured in `src/services/api.js`
- CORS is enabled in backend for frontend domain

## 🚨 Troubleshooting

### Common Issues

1. **Database Connection Failed**
   - Check MySQL is running: `mysql --version`
   - Verify credentials in `.env` file
   - Ensure database exists: `mysql -u root -p -e "SHOW DATABASES;"`

2. **CORS Issues**
   - Backend CORS is configured to allow all origins (`*`)
   - For production, update `CORS_ORIGIN` in backend `.env`

3. **Token Issues**
   - Check JWT_SECRET is set in backend `.env`
   - Clear localStorage in browser dev tools if needed

4. **Port Conflicts**
   - Backend default: 3000
   - Frontend default: 5173
   - Update ports in respective config files if needed

## 🔧 Development Tips

1. **API Testing**
   - Use browser dev tools Network tab
   - Backend provides detailed error messages
   - Console logs show authentication status

2. **Database Management**
   - Use MySQL Workbench or phpMyAdmin for GUI
   - Check `database/schema.sql` for table structure

3. **Hot Reload**
   - Frontend: Automatic with Vite
   - Backend: Use `npm run dev` for nodemon auto-restart

## 📋 Next Steps

1. Implement remaining component API integrations
2. Add form validation
3. Implement protected routes
4. Add data fetching to dashboard components
5. Implement real-time features if needed

## 🔐 Security Notes

- JWT tokens expire in 24 hours
- Passwords are hashed with bcrypt
- Always use HTTPS in production
- Sanitize user inputs
- Implement rate limiting for production

---

## 🏅 Certificate

This project was built and presented during the Lab AI Hackathon.

![AI Hackathon Certificate](https://github.com/amanrk2801/lab-ai-hackathon/raw/main/ai-certificate.jpg)
