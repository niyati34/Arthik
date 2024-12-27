# Backend Setup Guide

## 🚀 Quick Start

This guide will help you set up the backend for the Arthik Expense Tracker application.

## 📋 Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- MongoDB (local or cloud)

## 🔧 Installation Steps

### 1. Install Dependencies

```bash
cd backend
npm install
```

### 2. Environment Configuration

The `.env` file has been created with default settings for local development:

```env
# Server Configuration
NODE_ENV=development
PORT=5000

# MongoDB Configuration
MONGODB_URI=mongodb://localhost:27017/arthik_expense_tracker

# JWT Configuration
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
JWT_EXPIRE=30d

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
```

## 🗄️ MongoDB Setup

### Option A: MongoDB Atlas (Recommended - Cloud Database)

1. **Create MongoDB Atlas Account**
   - Go to [MongoDB Atlas](https://www.mongodb.com/atlas)
   - Click "Try Free" and create an account
   - Create a new cluster (choose the free tier)

2. **Get Connection String**
   - In your cluster, click "Connect"
   - Choose "Connect your application"
   - Copy the connection string

3. **Update Environment**
   - Run the setup script: `.\setup-mongodb-atlas.ps1`
   - Or manually update the `MONGODB_URI` in your `.env` file

### Option B: Local MongoDB

1. **Install MongoDB Community Server**
   - Download from: https://www.mongodb.com/try/download/community
   - Run the installer and follow the setup wizard
   - MongoDB will be installed as a service and start automatically

2. **Verify Installation**
   ```bash
   mongod --version
   ```

### Option C: Docker (if you have Docker installed)

```bash
docker run -d -p 27017:27017 --name mongodb mongo:latest
```

## 🏃‍♂️ Running the Application

### Development Mode

```bash
npm run dev
```

### Production Mode

```bash
npm start
```

The server will start on `http://localhost:5000`

## 🔍 Testing the API

### Health Check

```bash
curl http://localhost:5000/api/health
```

### Register a User

```bash
curl -X POST http://localhost:5000/api/users/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "testuser",
    "email": "test@example.com",
    "password": "password123",
    "firstName": "Test",
    "lastName": "User"
  }'
```

## 📚 API Documentation

### Authentication Endpoints

- `POST /api/users/register` - Register a new user
- `POST /api/users/login` - Login user
- `GET /api/users/profile` - Get user profile
- `PUT /api/users/profile` - Update user profile
- `PUT /api/users/password` - Change password

### Expense Endpoints

- `GET /api/expenses` - Get all expenses
- `POST /api/expenses` - Create new expense
- `GET /api/expenses/:id` - Get specific expense
- `PUT /api/expenses/:id` - Update expense
- `DELETE /api/expenses/:id` - Delete expense
- `GET /api/expenses/stats/overview` - Get expense statistics

### Income Endpoints

- `GET /api/incomes` - Get all incomes
- `POST /api/incomes` - Create new income
- `GET /api/incomes/:id` - Get specific income
- `PUT /api/incomes/:id` - Update income
- `DELETE /api/incomes/:id` - Delete income
- `GET /api/incomes/stats/overview` - Get income statistics

### Budget Endpoints

- `GET /api/budgets` - Get all budgets
- `POST /api/budgets` - Create new budget
- `GET /api/budgets/:id` - Get specific budget
- `PUT /api/budgets/:id` - Update budget
- `DELETE /api/budgets/:id` - Delete budget
- `GET /api/budgets/active` - Get active budgets

### Goal Endpoints

- `GET /api/goals` - Get all goals
- `POST /api/goals` - Create new goal
- `GET /api/goals/:id` - Get specific goal
- `PUT /api/goals/:id` - Update goal
- `DELETE /api/goals/:id` - Delete goal
- `POST /api/goals/:id/contribute` - Add contribution to goal

## 🔐 Security Features

- JWT token authentication
- Password hashing with bcrypt
- Input validation and sanitization
- Rate limiting protection
- CORS configuration
- Helmet security headers

## 🛠️ Development Tools

### Available Scripts

- `npm start` - Start production server
- `npm run dev` - Start development server with nodemon
- `npm test` - Run tests
- `npm run test:watch` - Run tests in watch mode

### Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `NODE_ENV` | Environment mode | `development` |
| `PORT` | Server port | `5000` |
| `MONGODB_URI` | MongoDB connection string | `mongodb://localhost:27017/arthik_expense_tracker` |
| `JWT_SECRET` | JWT secret key | `your_super_secret_jwt_key_change_this_in_production` |
| `JWT_EXPIRE` | JWT expiration time | `30d` |
| `RATE_LIMIT_WINDOW_MS` | Rate limit window | `900000` (15 minutes) |
| `RATE_LIMIT_MAX_REQUESTS` | Max requests per window | `100` |

## 🐛 Troubleshooting

### Common Issues

1. **MongoDB Connection Error**
   - Ensure MongoDB is running
   - Check connection string in `.env`
   - Verify network connectivity

2. **Port Already in Use**
   - Change `PORT` in `.env`
   - Or kill the process using the port

3. **JWT Token Issues**
   - Ensure `JWT_SECRET` is set
   - Check token expiration

4. **CORS Errors**
   - Update CORS configuration in `server.js`
   - Add your frontend URL to allowed origins

### Logs

Check the console output for detailed error messages and logs.

## 📞 Support

If you encounter any issues:

1. Check the troubleshooting section above
2. Verify all environment variables are set correctly
3. Ensure MongoDB is running and accessible
4. Check the console logs for detailed error messages

## 🚀 Next Steps

Once the backend is running:

1. Test the API endpoints using Postman or curl
2. Connect your React frontend to the API
3. Set up proper environment variables for production
4. Configure MongoDB Atlas for production deployment
