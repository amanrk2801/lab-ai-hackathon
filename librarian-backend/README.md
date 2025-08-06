# Library Management System - Backend API

A comprehensive Node.js/Express backend API for the Library Management System with MySQL database integration.

## 🚀 Features

- **Complete REST API** for library management operations
- **MySQL Database** with optimized schema design
- **JWT Authentication** for secure access
- **CORS Support** for frontend integration
- **Comprehensive Error Handling** with proper HTTP status codes
- **Modular Architecture** with organized route handlers
- **Database Connection Pooling** for optimal performance

## 📋 Prerequisites

- Node.js (v14 or higher)
- MySQL Server (v8.0 or higher)
- npm or pnpm package manager

## 🛠 Installation

1. **Clone or extract the project**
   ```bash
   cd librarian-backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   pnpm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   ```
   
   Update the `.env` file with your configuration:
   ```env
   PORT=3000
   DB_HOST=localhost
   DB_USER=root
   DB_PASSWORD=your_password
   DB_NAME=library_management
   JWT_SECRET=your_jwt_secret_key
   NODE_ENV=development
   ```

4. **Set up MySQL database**
   ```bash
   # Start MySQL service
   sudo systemctl start mysql
   
   # Run the database schema
   mysql -u root -p < database/schema.sql
   ```

5. **Start the server**
   ```bash
   npm start
   # or for development with auto-reload
   npm run dev
   ```

## 🗄️ Database Schema

The system uses the following main entities:

### Core Tables
- **users** - System users (librarians, admins)
- **books** - Book catalog with metadata
- **book_copies** - Physical copies of books with location tracking
- **members** - Library members with contact information
- **issues** - Book borrowing transactions
- **payments** - Payment records for fines and fees
- **racks** - Physical storage locations

### Key Relationships
- Books have multiple copies (1:N)
- Members can have multiple issues (1:N)
- Issues track book copies to members (N:1:N)
- Payments are linked to members (N:1)
- Book copies are assigned to racks (N:1)

## 🔌 API Endpoints

### Authentication
```
POST   /api/auth/register     - Register new user
POST   /api/auth/login        - User login
GET    /api/auth/verify       - Verify JWT token
```

### Books Management
```
GET    /api/books             - Get all books (with pagination)
GET    /api/books/:id         - Get book by ID
POST   /api/books             - Add new book
PUT    /api/books/:id         - Update book
DELETE /api/books/:id         - Delete book
GET    /api/books/categories  - Get book categories
GET    /api/books/languages   - Get book languages
```

### Members Management
```
GET    /api/members           - Get all members (with pagination)
GET    /api/members/:id       - Get member by ID
POST   /api/members           - Add new member
PUT    /api/members/:id       - Update member
DELETE /api/members/:id       - Delete member
GET    /api/members/stats     - Get member statistics
```

### Issues Management
```
GET    /api/issues            - Get all issues (with pagination)
GET    /api/issues/:id        - Get issue by ID
POST   /api/issues            - Issue a book
PUT    /api/issues/:id/return - Return a book
PUT    /api/issues/:id        - Update issue
GET    /api/issues/overdue    - Get overdue books
GET    /api/issues/stats      - Get issue statistics
```

### Payments Management
```
GET    /api/payments          - Get all payments (with pagination)
GET    /api/payments/:id      - Get payment by ID
POST   /api/payments          - Record new payment
PUT    /api/payments/:id      - Update payment
DELETE /api/payments/:id      - Delete payment
GET    /api/payments/reports  - Get payment reports
GET    /api/payments/member/:member_id/status - Get member payment status
```

### Book Copies Management
```
GET    /api/copies            - Get all book copies (with pagination)
GET    /api/copies/:id        - Get copy by ID
POST   /api/copies            - Add new book copy
PUT    /api/copies/:id        - Update book copy
DELETE /api/copies/:id        - Delete book copy
GET    /api/copies/book/:book_id/available - Get available copies for a book
```

### Racks Management
```
GET    /api/racks             - Get all racks
GET    /api/racks/:id         - Get rack by ID
POST   /api/racks             - Add new rack
PUT    /api/racks/:id         - Update rack
DELETE /api/racks/:id         - Delete rack
GET    /api/racks/stats       - Get rack utilization statistics
GET    /api/racks/rack/:rack_number/shelf/:shelf_number/books - Get books by location
```

## 🔐 Authentication

The API uses JWT (JSON Web Tokens) for authentication. Include the token in the Authorization header:

```
Authorization: Bearer <your_jwt_token>
```

### Protected Routes
Most endpoints require authentication except:
- `GET /api/books` (public book catalog)
- `POST /api/auth/login`
- `POST /api/auth/register`

## 📊 Query Parameters

### Pagination
Most list endpoints support pagination:
```
GET /api/books?page=1&limit=10
```

### Filtering
Many endpoints support filtering:
```
GET /api/books?category=Fiction&language=English
GET /api/members?status=Active&search=john
GET /api/issues?status=issued&overdue_only=true
```

### Sorting
Results are typically sorted by relevant fields:
- Books: by title
- Members: by last name, first name
- Issues: by issue date (newest first)
- Payments: by payment date (newest first)

## 🚨 Error Handling

The API returns consistent error responses:

```json
{
  "error": "Error message description"
}
```

### HTTP Status Codes
- `200` - Success
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `409` - Conflict
- `500` - Internal Server Error

## 🧪 Testing

### Manual Testing with curl

1. **Test server health**
   ```bash
   curl http://localhost:3000/api/test
   ```

2. **Register a user**
   ```bash
   curl -X POST http://localhost:3000/api/auth/register \
     -H "Content-Type: application/json" \
     -d '{"email":"admin@library.com","password":"password123","role":"librarian"}'
   ```

3. **Login**
   ```bash
   curl -X POST http://localhost:3000/api/auth/login \
     -H "Content-Type: application/json" \
     -d '{"email":"admin@library.com","password":"password123"}'
   ```

4. **Get books (with token)**
   ```bash
   curl -H "Authorization: Bearer YOUR_TOKEN" \
     http://localhost:3000/api/books
   ```

### Sample Data

The database schema includes sample data for testing:
- Default admin user: `admin@library.com` / `password123`
- Sample books, members, and transactions
- Rack configurations for testing

## 🔧 Configuration

### Environment Variables
- `PORT` - Server port (default: 3000)
- `DB_HOST` - MySQL host (default: localhost)
- `DB_USER` - MySQL username
- `DB_PASSWORD` - MySQL password
- `DB_NAME` - Database name
- `JWT_SECRET` - Secret key for JWT tokens
- `NODE_ENV` - Environment (development/production)

### Database Configuration
The connection pool is configured for optimal performance:
- Connection limit: 10
- Idle timeout: 600000ms
- Acquire timeout: 60000ms

## 📁 Project Structure

```
librarian-backend/
├── database/
│   ├── connection.js      # Database connection setup
│   └── schema.sql         # Database schema and sample data
├── middleware/
│   └── auth.js           # JWT authentication middleware
├── routes/
│   ├── auth.js           # Authentication routes
│   ├── books.js          # Books management routes
│   ├── members.js        # Members management routes
│   ├── issues.js         # Issues management routes
│   ├── payments.js       # Payments management routes
│   ├── copies.js         # Book copies management routes
│   └── racks.js          # Racks management routes
├── .env                  # Environment configuration
├── package.json          # Dependencies and scripts
├── server.js             # Main application entry point
└── README.md             # This file
```

## 🚀 Deployment

### Production Setup

1. **Set environment to production**
   ```env
   NODE_ENV=production
   ```

2. **Use process manager**
   ```bash
   npm install -g pm2
   pm2 start server.js --name "library-api"
   ```

3. **Set up reverse proxy (nginx)**
   ```nginx
   server {
       listen 80;
       server_name your-domain.com;
       
       location /api {
           proxy_pass http://localhost:3000;
           proxy_set_header Host $host;
           proxy_set_header X-Real-IP $remote_addr;
       }
   }
   ```

### Docker Deployment

```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install --production
COPY . .
EXPOSE 3000
CMD ["npm", "start"]
```

## 🤝 Integration with Frontend

The backend is designed to work seamlessly with the React frontend:

1. **CORS Configuration** - Allows requests from frontend domain
2. **Consistent API Response Format** - Standardized JSON responses
3. **Error Handling** - Proper HTTP status codes and error messages
4. **Authentication Flow** - JWT token-based authentication
5. **Pagination Support** - Efficient data loading for large datasets

### Frontend Integration Example

```javascript
// API service configuration
const API_BASE_URL = 'http://localhost:3000/api';

// Example API call
const response = await fetch(`${API_BASE_URL}/books`, {
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  }
});
```

## 📝 License

This project is part of the Library Management System and is intended for educational and demonstration purposes.

## 🐛 Troubleshooting

### Common Issues

1. **Database Connection Error**
   - Verify MySQL is running: `sudo systemctl status mysql`
   - Check credentials in `.env` file
   - Ensure database exists: `mysql -u root -p -e "SHOW DATABASES;"`

2. **Port Already in Use**
   - Change PORT in `.env` file
   - Kill existing process: `lsof -ti:3000 | xargs kill`

3. **JWT Token Issues**
   - Ensure JWT_SECRET is set in `.env`
   - Check token expiration (default: 24h)
   - Verify Authorization header format

4. **CORS Errors**
   - Check frontend URL in CORS configuration
   - Ensure proper headers are sent from frontend

### Logs and Debugging

- Server logs are output to console in development
- Use `DEBUG=*` environment variable for detailed logs
- Check MySQL logs: `/var/log/mysql/error.log`

## 📞 Support

For issues and questions:
1. Check the troubleshooting section
2. Review API documentation
3. Verify database schema and sample data
4. Test with provided curl examples

