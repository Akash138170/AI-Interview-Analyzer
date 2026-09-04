# AI Interview Analyzer - API Documentation

**Base URL:** `https://your-backend-domain.com/api`  
**Environment:** Production Ready  
**Version:** 1.0.0

---

## Table of Contents

1. [Overview](#overview)
2. [Authentication](#authentication)
3. [Error Handling](#error-handling)
4. [Endpoints](#endpoints)
   - [Authentication Routes](#authentication-routes)
   - [Interview Routes](#interview-routes)
5. [Request/Response Examples](#requestresponse-examples)
6. [Database Models](#database-models)
7. [Environment Variables](#environment-variables)
8. [Deployment Notes](#deployment-notes)

---

## Overview

AI Interview Analyzer is a full-stack web application that helps candidates prepare for technical and behavioral interviews by:

- **Resume Analysis**: Parse and analyze candidate resumes (PDF)
- **Job Matching**: Compare resume with job description
- **Interview Preparation**: Generate tailored interview questions and answers
- **Skill Gap Analysis**: Identify missing skills with severity levels
- **Preparation Plan**: Provide day-by-day interview preparation roadmap
- **Resume Enhancement**: Generate ATS-friendly, optimized resume PDF

### Technology Stack

- **Framework:** Express.js 5.x
- **Database:** MongoDB with Mongoose ODM
- **Authentication:** JWT (JSON Web Tokens) with HTTP-only cookies
- **AI/LLM:** Google Gemini API with structured JSON output
- **PDF Processing:** Puppeteer (HTML to PDF), PDF-Parse (PDF extraction)
- **File Upload:** Multer
- **Validation:** Zod schema validation

---

## Authentication

### Cookie-Based JWT Authentication

All protected endpoints require an HTTP-only authentication cookie containing a valid JWT token.

**Token Details:**
- **Issued on:** User registration or login
- **Expiration:** 24 hours
- **Storage:** HTTP-only cookie (secure in production)
- **Algorithm:** HS256

**Cookie Configuration (Production):**
```javascript
{
  httpOnly: true,
  secure: true,           // HTTPS only
  sameSite: "none",       // Cross-origin allowed
  maxAge: 24 * 60 * 60 * 1000  // 24 hours
}
```

### How Authentication Works

1. User logs in → JWT token generated → Stored in HTTP-only cookie
2. Every request to protected endpoints → Cookie automatically sent by browser
3. Middleware validates token and checks blacklist
4. If valid → User ID attached to `req.user.id`
5. User logs out → Token added to blacklist, cookie cleared

### Logout & Token Invalidation

When a user logs out, their token is added to a blacklist collection in MongoDB. This ensures:
- User cannot use old token after logout
- New login generates a new token
- Prevents token replay attacks

---

## Error Handling

### Response Format

All error responses follow this format:

```json
{
  "success": false,
  "message": "Error description",
  "error": "Optional detailed error info"
}
```

### HTTP Status Codes

| Code | Meaning | Scenario |
|------|---------|----------|
| **200** | OK | Successful GET/POST request |
| **201** | Created | Resource created successfully |
| **400** | Bad Request | Invalid input, missing fields, wrong file type |
| **401** | Unauthorized | Missing/invalid token, token expired |
| **404** | Not Found | Resource doesn't exist |
| **500** | Internal Server Error | Server error, database error |
| **502** | Bad Gateway | AI service failure |

### Common Error Scenarios

**Invalid Token:**
```json
{
  "message": "Invalid token"
}
```

**Missing Required Fields:**
```json
{
  "success": false,
  "message": "Please provide username, email and password"
}
```

**Duplicate Account:**
```json
{
  "message": "Account already exist with this email and username"
}
```

**Unauthorized Access:**
```json
{
  "success": false,
  "message": "Unauthorized"
}
```

---

## Endpoints

### Authentication Routes

Base: `/api/auth`

#### 1. Register User

**Endpoint:** `POST /register`

**Description:** Create a new user account

**Request Body:**
```json
{
  "username": "john_doe",
  "email": "john@example.com",
  "password": "SecurePassword123"
}
```

**Required Fields:**
- `username` (string, unique, required)
- `email` (string, unique, required)
- `password` (string, required)

**Response (201 Created):**
```json
{
  "message": "User registered successfully",
  "user": {
    "id": "507f1f77bcf86cd799439011",
    "username": "john_doe",
    "email": "john@example.com"
  }
}
```

**Error Cases:**
- Missing fields: `400 Bad Request`
- Account already exists: `400 Bad Request`
- Server error: `500 Internal Server Error`

---

#### 2. Login User

**Endpoint:** `POST /login`

**Description:** Authenticate user and receive JWT token

**Request Body:**
```json
{
  "email": "john@example.com",
  "password": "SecurePassword123"
}
```

**Required Fields:**
- `email` (string, required)
- `password` (string, required)

**Response (200 OK):**
```json
{
  "message": "User loggedIn successfully",
  "user": {
    "id": "507f1f77bcf86cd799439011",
    "username": "john_doe",
    "email": "john@example.com"
  }
}
```

**Sets Cookie:**
```
Set-Cookie: token=<JWT>; HttpOnly; Secure; SameSite=None; Max-Age=86400000
```

**Error Cases:**
- Invalid email: `400 Bad Request`
- Invalid password: `400 Bad Request`
- Server error: `500 Internal Server Error`

---

#### 3. Logout User

**Endpoint:** `GET /logout`

**Description:** Logout current user and invalidate token

**Authentication:** Required ✅

**Response (200 OK):**
```json
{
  "message": "User logged out successfully"
}
```

**Side Effects:**
- Token added to blacklist
- Cookie cleared

---

#### 4. Get Current User

**Endpoint:** `GET /get-me`

**Description:** Fetch current authenticated user details

**Authentication:** Required ✅

**Response (200 OK):**
```json
{
  "message": "user details fetched successfully",
  "user": {
    "id": "507f1f77bcf86cd799439011",
    "username": "john_doe",
    "email": "john@example.com"
  }
}
```

**Error Cases:**
- Invalid token: `401 Unauthorized`
- User not found: `404 Not Found`
- Server error: `500 Internal Server Error`

---

### Interview Routes

Base: `/api/interview`

#### 1. Generate Interview Report

**Endpoint:** `POST /`

**Description:** Analyze resume and generate comprehensive interview report

**Authentication:** Required ✅

**Content-Type:** `multipart/form-data`

**Request Body:**
```
Key: resume
Value: <PDF file>

Key: selfDescription
Value: "I am a full-stack developer with 3 years of experience..."

Key: jobDescription
Value: "We are looking for a Full-Stack Developer with React and Node.js..."
```

**Required Fields:**
- `resume` (file, PDF only, required)
- `selfDescription` (string, non-empty, required)
- `jobDescription` (string, non-empty, required)

**File Constraints:**
- Type: PDF only
- Size: Recommended max 5MB
- Must contain extractable text

**Response (201 Created):**
```json
{
  "success": true,
  "message": "Interview report generated successfully",
  "interviewReport": {
    "_id": "507f1f77bcf86cd799439012",
    "user": "507f1f77bcf86cd799439011",
    "title": "Full Stack Developer",
    "matchScore": 78,
    "resume": "extracted text from pdf...",
    "selfDescription": "I am a full-stack developer...",
    "jobDescription": "We are looking for...",
    "technicalQuestions": [
      {
        "question": "Explain the difference between async/await and promises",
        "intention": "Assess understanding of async patterns",
        "answer": "Async/await provides cleaner syntax... [detailed answer]"
      },
      {
        "question": "How would you optimize a React component?",
        "intention": "Evaluate React performance optimization skills",
        "answer": "Use React.memo, useMemo, useCallback... [detailed answer]"
      }
    ],
    "behavioralQuestions": [
      {
        "question": "Tell me about a time you had to learn a new technology quickly",
        "intention": "Assess learning ability and adaptability",
        "answer": "Use STAR method: Situation → Task → Action → Result..."
      }
    ],
    "skillGaps": [
      {
        "skill": "AWS/Cloud Deployment",
        "severity": "medium"
      },
      {
        "skill": "Docker & Kubernetes",
        "severity": "low"
      }
    ],
    "preparationPlan": [
      {
        "day": 1,
        "focus": "JavaScript Fundamentals Review",
        "tasks": [
          "Review ES6+ features",
          "Practice async/await patterns",
          "Solve 5 JavaScript coding problems"
        ]
      },
      {
        "day": 2,
        "focus": "React Deep Dive",
        "tasks": [
          "Study React hooks in detail",
          "Review component optimization",
          "Build a mini project"
        ]
      }
    ],
    "createdAt": "2024-01-15T10:30:00.000Z",
    "updatedAt": "2024-01-15T10:30:00.000Z"
  }
}
```

**Error Cases:**
- Unauthorized (missing token): `401 Unauthorized`
- Missing resume file: `400 Bad Request`
- Invalid file type (not PDF): `400 Bad Request`
- Empty file: `400 Bad Request`
- Missing selfDescription or jobDescription: `400 Bad Request`
- AI service failure: `502 Bad Gateway`
- Server error: `500 Internal Server Error`

**Report Structure:**

| Field | Type | Description |
|-------|------|-------------|
| `title` | String | Job title being analyzed |
| `matchScore` | Number | Overall match percentage (0-100) |
| `technicalQuestions` | Array | 3-5 relevant technical questions with guidance |
| `behavioralQuestions` | Array | 2-3 behavioral questions with STAR guidance |
| `skillGaps` | Array | Missing skills with severity (low/medium/high) |
| `preparationPlan` | Array | 5-7 day preparation roadmap |

---

#### 2. Get All Interview Reports

**Endpoint:** `GET /`

**Description:** Fetch all interview reports for authenticated user

**Authentication:** Required ✅

**Query Parameters:** None

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Interview reports fetched successfully",
  "count": 3,
  "interviewReports": [
    {
      "_id": "507f1f77bcf86cd799439012",
      "title": "Full Stack Developer",
      "matchScore": 78,
      "user": "507f1f77bcf86cd799439011",
      "createdAt": "2024-01-15T10:30:00.000Z",
      "updatedAt": "2024-01-15T10:30:00.000Z"
    },
    {
      "_id": "507f1f77bcf86cd799439013",
      "title": "Backend Engineer",
      "matchScore": 85,
      "user": "507f1f77bcf86cd799439011",
      "createdAt": "2024-01-14T15:20:00.000Z",
      "updatedAt": "2024-01-14T15:20:00.000Z"
    }
  ]
}
```

**Note:** Large fields (resume, questions, skillGaps, etc.) are excluded for list view

**Error Cases:**
- Unauthorized: `401 Unauthorized`
- Server error: `500 Internal Server Error`

---

#### 3. Get Interview Report By ID

**Endpoint:** `GET /report/:interviewId`

**Description:** Fetch a specific interview report with all details

**Authentication:** Required ✅

**URL Parameters:**
- `interviewId` (string, MongoDB ObjectId, required)

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Interview report fetched successfully",
  "interviewReport": {
    "_id": "507f1f77bcf86cd799439012",
    "user": "507f1f77bcf86cd799439011",
    "title": "Full Stack Developer",
    "matchScore": 78,
    "resume": "extracted text...",
    "selfDescription": "I am a full-stack developer...",
    "jobDescription": "We are looking for...",
    "technicalQuestions": [...],
    "behavioralQuestions": [...],
    "skillGaps": [...],
    "preparationPlan": [...],
    "createdAt": "2024-01-15T10:30:00.000Z",
    "updatedAt": "2024-01-15T10:30:00.000Z"
  }
}
```

**Error Cases:**
- Invalid report ID format: `400 Bad Request`
- Unauthorized: `401 Unauthorized`
- Report not found or not owned by user: `404 Not Found`
- Server error: `500 Internal Server Error`

---

#### 4. Generate Resume PDF

**Endpoint:** `POST /resume/pdf/:interviewId`

**Description:** Generate optimized, ATS-friendly resume PDF based on interview report

**Authentication:** Required ✅

**URL Parameters:**
- `interviewId` (string, MongoDB ObjectId, required)

**Request Body:** Empty (no body required)

**Response (200 OK):**
```
Content-Type: application/pdf
Content-Disposition: attachment; filename="resume.pdf"

[Binary PDF content]
```

**PDF Characteristics:**
- ATS-friendly format
- Professional styling
- Single-column layout
- A4 paper compatible
- Optimized for scanners
- Tailored to job description

**Error Cases:**
- Invalid report ID format: `400 Bad Request`
- Unauthorized: `401 Unauthorized`
- Report not found or not owned by user: `404 Not Found`
- AI service failure: `502 Bad Gateway`
- PDF generation failure: `500 Internal Server Error`

---

## Request/Response Examples

### Complete Flow Example

#### Step 1: Register
```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "john_doe",
    "email": "john@example.com",
    "password": "SecurePass123"
  }'
```

Response:
```json
{
  "message": "User registered successfully",
  "user": {
    "id": "507f1f77bcf86cd799439011",
    "username": "john_doe",
    "email": "john@example.com"
  }
}
```

#### Step 2: Login
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "SecurePass123"
  }'
```

Response:
```json
{
  "message": "User loggedIn successfully",
  "user": {
    "id": "507f1f77bcf86cd799439011",
    "username": "john_doe",
    "email": "john@example.com"
  }
}
```

#### Step 3: Generate Interview Report
```bash
curl -X POST http://localhost:3000/api/interview \
  -H "Cookie: token=<JWT_TOKEN>" \
  -F "resume=@resume.pdf" \
  -F "selfDescription=I have 3 years of full-stack development experience..." \
  -F "jobDescription=Senior Full-Stack Developer required with React, Node.js..."
```

#### Step 4: Get Interview Report
```bash
curl -X GET http://localhost:3000/api/interview/report/507f1f77bcf86cd799439012 \
  -H "Cookie: token=<JWT_TOKEN>"
```

#### Step 5: Generate Resume PDF
```bash
curl -X POST http://localhost:3000/api/interview/resume/pdf/507f1f77bcf86cd799439012 \
  -H "Cookie: token=<JWT_TOKEN>" \
  -o optimized_resume.pdf
```

---

## Database Models

### User Model

```javascript
{
  _id: ObjectId,
  username: String (unique, required),
  email: String (unique, required),
  password: String (bcrypted, required),
  createdAt: Date (auto),
  updatedAt: Date (auto)
}
```

### Interview Report Model

```javascript
{
  _id: ObjectId,
  user: ObjectId (ref: User, required),
  title: String (job title, required),
  matchScore: Number (0-100),
  resume: String,
  selfDescription: String,
  jobDescription: String,
  
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
    severity: String (enum: low, medium, high)
  }],
  
  preparationPlan: [{
    day: Number,
    focus: String,
    tasks: [String]
  }],
  
  createdAt: Date (auto),
  updatedAt: Date (auto)
}
```

### Token Blacklist Model

```javascript
{
  _id: ObjectId,
  token: String (unique, required),
  createdAt: Date (auto),
  expiresAt: Date (auto, TTL: 24 hours)
}
```

---

## Environment Variables

Create a `.env` file in the `/backend` directory:

```env
# Server Configuration
PORT=3000
NODE_ENV=production

# Database
MONGODB_URI=mongodb+srv://user:password@cluster.mongodb.net/interview-analyzer

# JWT Authentication
JWT_SECRET=your-super-secret-jwt-key-min-32-characters

# Cookie Settings
COOKIE_SAME_SITE=none

# Google Gemini AI
GOOGLE_GENAI_API_KEY=your-google-gemini-api-key
GEMINI_MODEL=gemini-2-flash-preview

# CORS Origins (Frontend URLs)
FRONTEND_URL_LOCAL=http://localhost:5173
FRONTEND_URL_PRODUCTION=https://ai-interview-analyzer.vercel.app
```

**Important Security Notes:**

1. **JWT_SECRET**: Use a strong, random 32+ character string
   ```bash
   # Generate secure secret
   node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
   ```

2. **COOKIE_SAME_SITE**: 
   - Set to `"none"` for cross-origin frontend/backend
   - Set to `"lax"` for same-origin deployment

3. **GOOGLE_GENAI_API_KEY**: Get from [Google AI Studio](https://aistudio.google.com/app/apikey)

4. **MONGODB_URI**: Use environment-specific connection strings

---

## Deployment Notes

### Prerequisites

- Node.js 18+
- MongoDB 5.0+
- Google Gemini API access
- Puppeteer browser dependencies

### Production Checklist

- [ ] Set `NODE_ENV=production`
- [ ] Use strong `JWT_SECRET`
- [ ] Configure `COOKIE_SAME_SITE=none` with HTTPS
- [ ] Enable CORS only for trusted frontend domains
- [ ] Use production MongoDB connection string
- [ ] Set up SSL/HTTPS certificate
- [ ] Configure rate limiting (recommended: 100 requests/15 min)
- [ ] Enable request logging
- [ ] Set up error monitoring (Sentry, LogRocket, etc.)
- [ ] Regular database backups
- [ ] Monitor API performance and AI costs

### Heroku Deployment

```bash
# Install Heroku CLI
npm install -g heroku

# Login
heroku login

# Create app
heroku create your-app-name

# Set environment variables
heroku config:set MONGODB_URI=<your-mongo-uri>
heroku config:set JWT_SECRET=<your-secret>
heroku config:set GOOGLE_GENAI_API_KEY=<your-api-key>
heroku config:set COOKIE_SAME_SITE=none
heroku config:set NODE_ENV=production

# Deploy
git push heroku main

# View logs
heroku logs --tail
```

### Docker Deployment

```dockerfile
FROM node:18-alpine

WORKDIR /app

COPY backend/package*.json ./
RUN npm ci --only=production

COPY backend ./

EXPOSE 3000

CMD ["node", "server.js"]
```

### Rate Limiting Recommendation

```javascript
const rateLimit = require("express-rate-limit");

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: "Too many requests, please try again later."
});

app.use("/api/", limiter);
```

---

## Performance Considerations

### AI Processing Time

- **Interview Report Generation**: 15-30 seconds (Google Gemini API)
- **Resume PDF Generation**: 5-10 seconds (Puppeteer + rendering)

### Optimization Tips

1. **Caching**: Cache commonly generated reports
2. **Queue System**: Use Bull/RabbitMQ for heavy AI tasks
3. **CDN**: Serve PDF files from CDN
4. **Database Indexing**: Create indexes on `user` and `createdAt`
5. **Connection Pooling**: Configure MongoDB connection pool

### Recommended Database Indexes

```javascript
// User collection
db.users.createIndex({ email: 1 }, { unique: true });
db.users.createIndex({ username: 1 }, { unique: true });

// Interview Reports collection
db.interviews.createIndex({ user: 1, createdAt: -1 });
db.interviews.createIndex({ _id: 1, user: 1 });

// Token Blacklist collection
db.tokenblacklists.createIndex({ token: 1 }, { unique: true });
db.tokenblacklists.createIndex({ expiresAt: 1 }, { expireAfterSeconds: 0 });
```

---

## Support & Troubleshooting

### Common Issues

**Issue: "Resume PDF is required"**
- Ensure file is uploaded with key name `resume`
- Check file is PDF format
- Verify file is not corrupted

**Issue: "Could not extract text from resume"**
- Resume PDF might be image-based (scanned)
- Try with text-based PDF
- Check PDF is not password-protected

**Issue: "Failed to generate interview report"**
- Google Gemini API might be rate limited
- Check API key is valid
- Verify sufficient API quota

**Issue: "Invalid token"**
- Token might have expired (24-hour limit)
- User must login again
- Clear browser cookies and retry

**Issue: "Too many requests"**
- Rate limiting is active
- Wait 15 minutes before retrying
- Contact support for higher limits

### Debugging

Enable debug logging:
```bash
DEBUG=* npm run dev
```

Monitor AI service:
```javascript
console.log("AI Request:", prompt);
console.log("AI Response:", response);
```

---

## Version History

| Version | Date | Changes |
|---------|------|---------|
| 1.0.0 | Jan 2024 | Initial release with auth and interview endpoints |

---

## License

This API is part of the AI Interview Analyzer project.

---

## Contact & Support

For API issues and support, please open an issue on the GitHub repository.

**Repository:** https://github.com/Akash138170/AI-Interview-Analyzer
