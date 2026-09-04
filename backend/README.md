# AI Interview Analyzer - Backend

> An intelligent interview preparation platform powered by Google Gemini AI. Analyze resumes, get personalized interview questions, and receive comprehensive preparation plans.

**Live API:** `https://your-backend-domain.com/api`  
**Version:** 1.0.0  
**Node.js:** 18+  
**Database:** MongoDB 5.0+

---

## 📋 Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Configuration](#configuration)
- [Running the Server](#running-the-server)
- [Project Structure](#project-structure)
- [API Endpoints](#api-endpoints)
- [Authentication](#authentication)
- [Database Models](#database-models)
- [Deployment](#deployment)
- [Troubleshooting](#troubleshooting)
- [Contributing](#contributing)

---

## ✨ Features

### Core Functionality
- 🔐 **JWT Authentication** - Secure cookie-based authentication with token blacklisting
- 📄 **Resume Analysis** - Extract and analyze PDF resumes with AI
- 🎯 **Smart Job Matching** - Compare resume against job descriptions
- 💡 **Interview Preparation** - Generate tailored technical & behavioral questions
- 🎓 **Skill Gap Analysis** - Identify missing skills with severity levels
- 📋 **Preparation Roadmap** - 5-7 day personalized study plan
- 📝 **Resume Optimization** - Generate ATS-friendly resume PDFs

### Technical Features
- Express.js 5.x server with middleware
- MongoDB with Mongoose ODM
- Google Gemini AI integration
- PDF processing (extraction & generation)
- Comprehensive error handling
- Production-ready deployment

---

## 🛠 Tech Stack

| Layer | Technology | Purpose |
|-------|-----------|---------|
| **Runtime** | Node.js 18+ | JavaScript runtime |
| **Framework** | Express.js 5.x | REST API server |
| **Database** | MongoDB 5.0+ | Document database |
| **ODM** | Mongoose | MongoDB object modeling |
| **Authentication** | JWT + HTTP Cookies | Secure auth mechanism |
| **AI/LLM** | Google Gemini API | AI-powered analysis |
| **PDF Processing** | Puppeteer, PDF-Parse | PDF extraction & generation |
| **File Upload** | Multer | Multipart form data handling |
| **Validation** | Zod | Schema validation |
| **Environment** | dotenv | Environment variables |

---

## 📦 Prerequisites

Before you begin, ensure you have:

- **Node.js** (v18 or higher) - [Download](https://nodejs.org)
- **npm** (v9 or higher)
- **MongoDB** (v5.0 or higher)
  - Local: Install from [mongodb.com](https://mongodb.com)
  - Cloud: [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) (free tier available)
- **Google Gemini API Key** - Get from [Google AI Studio](https://aistudio.google.com/app/apikey)

### Verify Installations
```bash
node --version      # v18.x.x
npm --version       # v9.x.x or higher
```

---

## 🚀 Installation

### 1. Clone Repository
```bash
git clone https://github.com/Akash138170/AI-Interview-Analyzer.git
cd AI-Interview-Analyzer
```

### 2. Navigate to Backend Directory
```bash
cd backend
```

### 3. Install Dependencies
```bash
npm install
```

### 4. Verify Installation
```bash
npm list                    # Check installed packages
node -v && npm -v          # Verify versions
```

---

## ⚙️ Configuration

### 1. Create Environment File
```bash
cp .env.example .env
# Or create new file
touch .env
```

### 2. Configure `.env` File

```env
# ==========================================
# SERVER CONFIGURATION
# ==========================================
PORT=3000
NODE_ENV=development
# Use 'production' for deployment

# ==========================================
# DATABASE CONFIGURATION
# ==========================================
# Local MongoDB
MONGODB_URI=mongodb://localhost:27017/interview-analyzer

# MongoDB Atlas (Cloud)
# MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/interview-analyzer

# ==========================================
# JWT AUTHENTICATION
# ==========================================
JWT_SECRET=your-super-secret-jwt-key-min-32-characters-here

# Generate secure secret:
# node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"

JWT_EXPIRE=24h
# Token expires after 24 hours

# ==========================================
# COOKIE SETTINGS
# ==========================================
COOKIE_SAME_SITE=lax
# Use 'none' for cross-origin (requires HTTPS)
# Use 'lax' for same-origin deployment
# Use 'strict' for maximum security

# ==========================================
# GOOGLE GEMINI AI
# ==========================================
GOOGLE_GENAI_API_KEY=your-google-gemini-api-key-here
GEMINI_MODEL=gemini-2-flash-preview
# Models available: gemini-pro, gemini-2-flash-preview

# ==========================================
# CORS & FRONTEND URLs
# ==========================================
FRONTEND_URL_LOCAL=http://localhost:5173
FRONTEND_URL_PRODUCTION=https://ai-interview-analyzer.vercel.app

# ==========================================
# OPTIONAL: MONITORING & LOGGING
# ==========================================
# DEBUG=*
# LOG_LEVEL=debug

# ==========================================
# OPTIONAL: RATE LIMITING
# ==========================================
RATE_LIMIT_WINDOW_MS=900000      # 15 minutes
RATE_LIMIT_MAX_REQUESTS=100      # max 100 requests per window
```

### 3. Get API Keys

#### Google Gemini API Key
1. Visit [Google AI Studio](https://aistudio.google.com/app/apikey)
2. Click "Create API Key" → "Create API key in new project"
3. Copy the key and paste in `.env`

#### MongoDB Atlas (Recommended)
1. Visit [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create free account
3. Create new cluster (free tier)
4. Click "Connect" → "Drivers" → Copy connection string
5. Add username/password to connection string

---

## ▶️ Running the Server

### Development Mode
```bash
# Install dev dependencies (nodemon)
npm install --save-dev nodemon

# Run with auto-reload
npm run dev
```

### Production Mode
```bash
# Build if needed
npm run build

# Start server
npm start
```

### Check Server Status
```bash
# Should see output like:
# Server running on port 3000
# ✓ Connected to MongoDB
# ✓ Google Gemini API initialized
```

### Access Server
- **Local**: http://localhost:3000
- **API Base**: http://localhost:3000/api

---

## 📁 Project Structure

```
backend/
├── models/                    # Database schemas
│   ├── User.js               # User model
│   ├── InterviewReport.js    # Interview report model
│   └── TokenBlacklist.js     # Token blacklist model
│
├── routes/                    # API route handlers
│   ├── auth.js               # Authentication routes
│   └── interview.js          # Interview analysis routes
│
├── controllers/              # Business logic
│   ├── authController.js     # Auth operations
│   └── interviewController.js # Interview operations
│
├── middleware/               # Custom middleware
│   ├── authMiddleware.js     # JWT verification
│   ├── errorHandler.js       # Error handling
│   └── rateLimiter.js        # Rate limiting
│
├── utils/                    # Helper functions
│   ├── ai.js                 # Google Gemini integration
│   ├── pdfParser.js          # PDF extraction
│   ├── pdfGenerator.js       # Resume PDF generation
│   └── validators.js         # Input validation
│
├── config/                   # Configuration
│   └── database.js           # MongoDB connection
│
├── server.js                 # Main entry point
├── .env                      # Environment variables
├── .env.example              # Example env file
├── package.json              # Dependencies
└── README.md                 # This file
```

---

## 🔌 API Endpoints

### Authentication Routes
**Base:** `/api/auth`

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---|
| POST | `/register` | Create new account | ❌ No |
| POST | `/login` | Login & get JWT | ❌ No |
| GET | `/logout` | Logout & invalidate token | ✅ Yes |
| GET | `/get-me` | Get current user details | ✅ Yes |

**Example:**
```bash
# Register
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "john_doe",
    "email": "john@example.com",
    "password": "SecurePass123"
  }'

# Login
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "SecurePass123"
  }'
```

### Interview Routes
**Base:** `/api/interview`

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---|
| POST | `/` | Generate interview report | ✅ Yes |
| GET | `/` | Get all reports | ✅ Yes |
| GET | `/report/:id` | Get specific report | ✅ Yes |
| POST | `/resume/pdf/:id` | Generate resume PDF | ✅ Yes |

**Example:**
```bash
# Generate Report
curl -X POST http://localhost:3000/api/interview \
  -H "Cookie: token=<JWT_TOKEN>" \
  -F "resume=@resume.pdf" \
  -F "selfDescription=I have 3 years of experience..." \
  -F "jobDescription=Looking for Full-Stack Developer..."

# Get Report
curl -X GET http://localhost:3000/api/interview/report/507f1f77bcf86cd799439012 \
  -H "Cookie: token=<JWT_TOKEN>"
```

📖 **Full API docs:** See [docs/API.md](../docs/API.md)

---

## 🔐 Authentication

### How It Works
1. **Registration** → User account created, password hashed (bcrypt)
2. **Login** → JWT token generated, stored in HTTP-only cookie
3. **Protected Endpoints** → Cookie validated, user ID attached to request
4. **Logout** → Token added to blacklist, cookie cleared

### Cookie Configuration (Production)
```javascript
{
  httpOnly: true,        // Not accessible from JavaScript
  secure: true,          // HTTPS only
  sameSite: "none",      // Cross-origin allowed
  maxAge: 24 * 60 * 60 * 1000  // 24 hours expiration
}
```

### JWT Token
- **Algorithm:** HS256
- **Expiration:** 24 hours
- **Payload:** `{ userId, iat, exp }`
- **Secret:** Stored in `JWT_SECRET` environment variable

---

## 💾 Database Models

### User Schema
```javascript
{
  _id: ObjectId,
  username: String,          // Unique, required
  email: String,             // Unique, required
  password: String,          // Bcrypted, required
  createdAt: Date,           // Auto-generated
  updatedAt: Date            // Auto-updated
}
```

### Interview Report Schema
```javascript
{
  _id: ObjectId,
  user: ObjectId,            // Reference to User
  title: String,             // Job title analyzed
  matchScore: Number,        // 0-100 percentage
  
  resume: String,            // Extracted resume text
  selfDescription: String,   // User's background
  jobDescription: String,    // Target job description
  
  technicalQuestions: [{
    question: String,
    intention: String,
    answer: String
  }],
  
  behavioralQuestions: [{
    question: String,
    intention: String,
    answer: String
  }],
  
  skillGaps: [{
    skill: String,
    severity: String          // 'low', 'medium', 'high'
  }],
  
  preparationPlan: [{
    day: Number,
    focus: String,
    tasks: [String]
  }],
  
  createdAt: Date,
  updatedAt: Date
}
```

### Token Blacklist Schema
```javascript
{
  _id: ObjectId,
  token: String,             // Unique JWT token
  createdAt: Date,           // Auto-generated
  expiresAt: Date            // TTL: 24 hours (auto-delete)
}
```

### Database Indexes (Performance)
```javascript
// Create these for optimal performance
db.users.createIndex({ email: 1 }, { unique: true });
db.users.createIndex({ username: 1 }, { unique: true });

db.interviewreports.createIndex({ user: 1, createdAt: -1 });
db.interviewreports.createIndex({ _id: 1, user: 1 });

db.tokenblacklists.createIndex({ expiresAt: 1 }, { expireAfterSeconds: 0 });
```

---

## 🚢 Deployment

### Heroku Deployment

1. **Install Heroku CLI**
```bash
npm install -g heroku
heroku login
```

2. **Create Heroku App**
```bash
heroku create your-app-name
```

3. **Set Environment Variables**
```bash
heroku config:set MONGODB_URI=mongodb+srv://...
heroku config:set JWT_SECRET=your-secret-key
heroku config:set GOOGLE_GENAI_API_KEY=your-api-key
heroku config:set COOKIE_SAME_SITE=none
heroku config:set NODE_ENV=production
heroku config:set FRONTEND_URL_PRODUCTION=https://your-frontend.com
```

4. **Deploy**
```bash
git push heroku main
heroku logs --tail
```

### Docker Deployment

**Dockerfile:**
```dockerfile
FROM node:18-alpine

WORKDIR /app

# Install Puppeteer dependencies
RUN apk add --no-cache \
  chromium \
  noto-sans \
  freetype \
  fontconfig \
  dumb-init

COPY package*.json ./
RUN npm ci --only=production

COPY . .

ENV NODE_ENV=production
EXPOSE 3000

ENTRYPOINT ["dumb-init", "--"]
CMD ["node", "server.js"]
```

**Build & Run:**
```bash
docker build -t ai-interview-backend .
docker run -p 3000:3000 --env-file .env ai-interview-backend
```

### Vercel Deployment (Serverless)

1. Add `vercel.json`:
```json
{
  "buildCommand": "npm install",
  "outputDirectory": "./",
  "framework": "express",
  "functions": {
    "server.js": {
      "memory": 1024,
      "maxDuration": 60
    }
  }
}
```

2. Deploy:
```bash
npm i -g vercel
vercel
```

### AWS/EC2 Deployment

1. SSH into EC2 instance
2. Install Node.js & MongoDB
3. Clone repository
4. Configure `.env` with production values
5. Start with PM2:
```bash
npm install -g pm2
pm2 start server.js --name "ai-interview-backend"
pm2 save
```

### Production Checklist
- [ ] Set `NODE_ENV=production`
- [ ] Use strong `JWT_SECRET` (32+ characters)
- [ ] Enable HTTPS/SSL certificate
- [ ] Configure `COOKIE_SAME_SITE=none` (if cross-origin)
- [ ] Enable CORS for trusted domains only
- [ ] Use production MongoDB connection
- [ ] Set up rate limiting (recommended)
- [ ] Enable request logging
- [ ] Configure error monitoring (Sentry)
- [ ] Set up database backups
- [ ] Monitor API performance & costs

---

## 🐛 Troubleshooting

### Common Issues

#### 1. Connection Errors
```
Error: connect ECONNREFUSED 127.0.0.1:27017
```
**Solution:**
- Start MongoDB service: `mongod`
- Or use MongoDB Atlas connection string

#### 2. Invalid Token
```
Error: Invalid token
```
**Solution:**
- User token expired (24-hour limit)
- Login again to get new token
- Clear browser cookies

#### 3. PDF Extraction Fails
```
Error: Could not extract text from resume
```
**Causes:**
- Scanned/image-based PDF
- Password-protected PDF
- Corrupted file
**Solution:**
- Use text-based PDF
- Extract from password protection
- Verify file integrity

#### 4. AI Service Failure
```
Error: 502 Bad Gateway - AI service failure
```
**Causes:**
- Gemini API rate limited
- Invalid API key
- Insufficient quota
**Solution:**
- Wait before retrying
- Verify `GOOGLE_GENAI_API_KEY`
- Check API quota on Google Cloud

#### 5. Rate Limiting
```
Error: Too many requests
```
**Solution:**
- Wait 15 minutes
- Increase rate limit config
- Contact support

#### 6. CORS Errors
```
Error: Cross-Origin Request Blocked
```
**Solution:**
- Add frontend URL to CORS whitelist
- Set `COOKIE_SAME_SITE=none` with HTTPS
- Verify backend is accessible

### Debug Mode

Enable detailed logging:
```bash
# Run with debug output
DEBUG=* npm run dev

# Or set in .env
NODE_DEBUG=http,net
```

Check logs:
```bash
# Heroku
heroku logs --tail

# Docker
docker logs container-id

# Local
tail -f app.log
```

---

## 📊 Performance Optimization

### Response Times
- **Interview Report Generation:** 15-30 seconds (AI processing)
- **Resume PDF Generation:** 5-10 seconds
- **Authentication:** < 100ms
- **Database Queries:** < 50ms

### Optimization Tips
1. **Caching** - Cache frequently requested reports
2. **Job Queue** - Use Bull/RabbitMQ for heavy tasks
3. **CDN** - Serve PDFs from CloudFront/CDN
4. **Connection Pooling** - Configure MongoDB pool
5. **Compression** - Enable gzip compression
6. **Indexing** - Create DB indexes (see Models section)

### Recommended Configuration
```javascript
// server.js
const compression = require('compression');
const helmet = require('helmet');

app.use(compression());              // Gzip compression
app.use(helmet());                   // Security headers
app.use(rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  skip: (req) => req.path === '/health'
}));
```

---

## 📝 Scripts

```bash
# Development
npm run dev          # Start with nodemon

# Production
npm start            # Start server

# Linting
npm run lint         # ESLint check

# Testing
npm test             # Run tests
npm run test:watch   # Watch mode

# Database
npm run db:seed      # Seed sample data
npm run db:migrate   # Run migrations
```

---

## 🤝 Contributing

### Development Workflow
1. Create feature branch: `git checkout -b feature/your-feature`
2. Make changes following code style
3. Test thoroughly
4. Commit: `git commit -am 'Add feature description'`
5. Push: `git push origin feature/your-feature`
6. Open Pull Request

### Code Standards
- Use async/await, avoid callbacks
- Add JSDoc comments for functions
- Handle errors properly
- Follow REST conventions
- Validate all inputs

---

## 📄 License

Part of the AI Interview Analyzer project.

---

## 📞 Support

**Issues & Bugs:** [GitHub Issues](https://github.com/Akash138170/AI-Interview-Analyzer/issues)

**Questions:** Create a discussion in the repository

**Email:** your-email@example.com

---

## 🙏 Acknowledgments

- Google Gemini AI for powerful AI capabilities
- MongoDB for flexible database
- Express.js community for excellent framework

---

**Last Updated:** January 2024 | Version 1.0.0
