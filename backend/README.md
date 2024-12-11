# Arthik Backend API

A robust Node.js/Express backend API for the Arthik Financial Dashboard application, featuring MongoDB integration, JWT authentication, and comprehensive financial data management.

## 🚀 Features

- **User Authentication**: JWT-based authentication with secure password hashing
- **Financial Data Management**: Complete CRUD operations for expenses, incomes, budgets, and goals
- **Data Analytics**: Built-in analytics and reporting capabilities
- **Security**: Rate limiting, CORS protection, input validation, and error handling
- **Scalable Architecture**: Modular design with middleware and proper separation of concerns

## 📋 Prerequisites

- Node.js (v14 or higher)
- MongoDB (local or cloud instance)
- npm or yarn package manager

## 🛠️ Installation

1. **Clone the repository and navigate to backend directory**
   ```bash
   cd backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp env.example .env
   ```
   
   Edit `.env` file with your configuration:
   ```env
   # Server Configuration
   PORT=5000
   NODE_ENV=development

   # MongoDB Configuration
   MONGODB_URI=mongodb://localhost:27017/arthik

   # Frontend URL (for CORS)
   FRONTEND_URL=http://localhost:3000

   # JWT Configuration
   JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
   JWT_EXPIRE=30d

   # Rate Limiting
   RATE_LIMIT_WINDOW_MS=900000
   RATE_LIMIT_MAX_REQUESTS=100
   ```

4. **Start the development server**
   ```bash
   npm run dev
   ```

## 📊 API Endpoints

### Authentication

#### Register User
```http
POST /api/users/register
Content-Type: application/json

{
  "username": "john_doe",
  "email": "john@example.com",
  "password": "password123",
  "firstName": "John",
  "lastName": "Doe"
}
```

#### Login User
```http
POST /api/users/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "password123"
}
```

#### Get User Profile
```http
GET /api/users/profile
Authorization: Bearer <token>
```

#### Update User Profile
```http
PUT /api/users/profile
Authorization: Bearer <token>
Content-Type: application/json

{
  "firstName": "John",
  "lastName": "Smith",
  "currency": "USD"
}
```

#### Change Password
```http
POST /api/users/change-password
Authorization: Bearer <token>
Content-Type: application/json

{
  "currentPassword": "password123",
  "newPassword": "newpassword123"
}
```

### Expenses

#### Get All Expenses
```http
GET /api/expenses?page=1&limit=20&category=Food&startDate=2024-01-01&endDate=2024-12-31
Authorization: Bearer <token>
```

#### Create Expense
```http
POST /api/expenses
Authorization: Bearer <token>
Content-Type: application/json

{
  "title": "Grocery Shopping",
  "amount": 85.50,
  "category": "Food & Dining",
  "description": "Weekly groceries",
  "date": "2024-12-11",
  "paymentMethod": "Credit Card",
  "location": "Walmart",
  "tags": ["groceries", "weekly"]
}
```

#### Get Expense Analytics
```http
GET /api/expenses/analytics/summary?startDate=2024-01-01&endDate=2024-12-31
Authorization: Bearer <token>
```

### Incomes

#### Get All Incomes
```http
GET /api/incomes?page=1&limit=20&category=Salary
Authorization: Bearer <token>
```

#### Create Income
```http
POST /api/incomes
Authorization: Bearer <token>
Content-Type: application/json

{
  "title": "Monthly Salary",
  "amount": 5000.00,
  "category": "Salary",
  "description": "Monthly salary payment",
  "date": "2024-12-01",
  "source": "Company Inc.",
  "paymentMethod": "Direct Deposit"
}
```

### Budgets

#### Get All Budgets
```http
GET /api/budgets?page=1&limit=20&category=Food&isActive=true
Authorization: Bearer <token>
```

#### Create Budget
```http
POST /api/budgets
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "Food Budget",
  "amount": 500.00,
  "category": "Food & Dining",
  "period": "monthly",
  "startDate": "2024-12-01",
  "endDate": "2024-12-31",
  "description": "Monthly food and dining budget",
  "color": "#3b82f6",
  "icon": "🍽️"
}
```

### Goals

#### Get All Goals
```http
GET /api/goals?page=1&limit=20&status=active&priority=high
Authorization: Bearer <token>
```

#### Create Goal
```http
POST /api/goals
Authorization: Bearer <token>
Content-Type: application/json

{
  "title": "Emergency Fund",
  "targetAmount": 10000.00,
  "category": "Emergency Fund",
  "targetDate": "2024-12-31",
  "description": "Build emergency fund for 6 months of expenses",
  "priority": "high",
  "color": "#10b981",
  "icon": "🛡️"
}
```

#### Add Contribution to Goal
```http
POST /api/goals/:id/contribute
Authorization: Bearer <token>
Content-Type: application/json

{
  "amount": 500.00,
  "description": "Monthly contribution"
}
```

## 🔐 Authentication

All protected endpoints require a JWT token in the Authorization header:

```http
Authorization: Bearer <your-jwt-token>
```

## 📝 Response Format

All API responses follow a consistent format:

### Success Response
```json
{
  "success": true,
  "message": "Operation completed successfully",
  "data": {
    // Response data
  }
}
```

### Error Response
```json
{
  "success": false,
  "message": "Error description",
  "errors": [
    {
      "field": "email",
      "message": "Please enter a valid email"
    }
  ]
}
```

## 🗄️ Database Models

### User
- Authentication and profile information
- Preferences and settings
- Virtual fields for related data

### Expense
- Financial transaction details
- Categories and tags
- Payment methods and locations
- Analytics and reporting capabilities

### Income
- Income source tracking
- Categories and payment methods
- Recurring income support

### Budget
- Budget planning and tracking
- Period-based budgets
- Progress monitoring
- Notification settings

### Goal
- Financial goal management
- Progress tracking
- Milestone support
- Contribution history

## 🛡️ Security Features

- **JWT Authentication**: Secure token-based authentication
- **Password Hashing**: bcrypt for password security
- **Input Validation**: Comprehensive validation using express-validator
- **Rate Limiting**: Protection against abuse
- **CORS Protection**: Configurable cross-origin resource sharing
- **Helmet**: Security headers
- **Error Handling**: Consistent error responses

## 🚀 Deployment

### Environment Variables for Production
```env
NODE_ENV=production
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/arthik
JWT_SECRET=your-super-secure-jwt-secret
FRONTEND_URL=https://your-frontend-domain.com
```

### PM2 Deployment
```bash
npm install -g pm2
pm2 start server.js --name arthik-backend
pm2 save
pm2 startup
```

### Docker Deployment
```dockerfile
FROM node:16-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
EXPOSE 5000
CMD ["npm", "start"]
```

## 🧪 Testing

Run tests with:
```bash
npm test
```

## 📈 Performance

- Database indexing for optimal query performance
- Pagination for large datasets
- Efficient aggregation pipelines
- Caching strategies (can be implemented)

## 🔧 Development

### Scripts
- `npm start`: Start production server
- `npm run dev`: Start development server with nodemon
- `npm test`: Run test suite

### Code Structure
```
backend/
├── config/          # Database configuration
├── middleware/      # Authentication and error handling
├── models/          # MongoDB schemas
├── routes/          # API endpoints
├── server.js        # Main application file
└── package.json     # Dependencies and scripts
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

For support and questions, please open an issue in the repository or contact the development team.
