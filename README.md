# AI Interview Analyzer

<div align="center">

![AI Interview Analyzer](https://img.shields.io/badge/React-19-blue?style=flat-square&logo=react)
![Node.js](https://img.shields.io/badge/Node.js-Express-green?style=flat-square&logo=node.js)
![MongoDB](https://img.shields.io/badge/MongoDB-Database-brightgreen?style=flat-square&logo=mongodb)
![Google GenAI](https://img.shields.io/badge/Google%20GenAI-AI%20Powered-yellow?style=flat-square)
![License](https://img.shields.io/badge/License-ISC-blue?style=flat-square)

**AI-powered interview preparation platform that analyzes your resume, job description, and provides personalized interview guidance with AI-generated insights.**

[Live Demo](https://ai-interview-analyzer-xi.vercel.app) • [Report a Bug](../../issues) • [Request Feature](../../issues)

</div>

---

## 📋 Overview

**AI Interview Analyzer** is a full-stack web application designed to help job candidates prepare for interviews. By analyzing your resume, target job description, and self-description, the platform uses Google's Gemini AI to generate comprehensive interview preparation reports with:

- **Technical Assessment**: Key technical skills and knowledge areas to focus on
- **Behavioral Insights**: Common behavioral questions and suggested preparation
- **Skill Gap Analysis**: Areas where you need to improve for the target role
- **Preparation Roadmap**: Actionable steps and interview questions tailored to your profile
- **Resume Optimization**: AI-suggested resume enhancements for the specific role

### 🎯 Key Features

- ✅ **Secure Authentication**: User registration, login, and authenticated sessions
- ✅ **Resume Upload**: PDF upload with validation (max 5 MB)
- ✅ **AI-Powered Analysis**: Google Gemini integration for intelligent report generation
- ✅ **Interview Reports**: Comprehensive, downloadable reports with actionable insights
- ✅ **Report History**: Track all previously generated reports from your dashboard
- ✅ **Tailored Resume**: Download a role-specific resume PDF based on analysis
- ✅ **Responsive Design**: Seamless experience on desktop, tablet, and mobile
- ✅ **Report Details**: Expandable sections covering overview, technical, behavioral, and skill gaps

---

## 🚀 Tech Stack

### Frontend
- **React 19** - Modern UI framework with hooks and context API
- **Vite** - Lightning-fast build tool and development server
- **React Router 8** - Client-side routing
- **Tailwind CSS 4** - Utility-first CSS framework
- **Sass** - CSS preprocessor for advanced styling
- **Axios** - HTTP client for API communication
- **Lucide React** - Beautiful, consistent icon library

### Backend
- **Node.js** - JavaScript runtime
- **Express 5** - Lightweight web framework
- **MongoDB** - NoSQL database with Mongoose ODM
- **Google Gemini API** - AI-powered content generation
- **JWT** - Secure token-based authentication
- **Bcryptjs** - Password hashing and security
- **Multer** - File upload middleware
- **Puppeteer** - PDF generation and manipulation
- **Zod** - TypeScript-first schema validation

---

## 📁 Project Structure

```
AI-Interview-Analyzer/
├── frontend/                          # React + Vite application
│   ├── src/
│   │   ├── features/
│   │   │   ├── auth/                 # Authentication feature
│   │   │   │   ├── components/       # Protected route wrapper
│   │   │   │   ├── hooks/            # useAuth hook
│   │   │   │   ├── pages/            # Login, Registration pages
│   │   │   │   └── services/         # Auth API calls
│   │   │   └── interview/            # Interview feature
│   │   │       ├── hooks/            # Interview state management
│   │   │       ├── pages/            # Dashboard, Report pages
│   │   │       └── services/         # Interview API & context
│   │   ├── App.jsx                   # Root component with providers
│   │   ├── app.routes.jsx            # Route definitions
│   │   ├── main.jsx                  # Entry point
│   │   └── index.css                 # Global styles
│   ├── package.json
│   ├── vite.config.js
│   ├── index.html
│   └── vercel.json                   # Deployment config
│
├── backend/                           # Express.js server
│   ├── src/
│   │   ├── config/
│   │   │   └── database.js           # MongoDB connection
│   │   ├── controllers/              # Request handlers
│   │   ├── middleware/               # Custom middleware
│   │   ├── models/                   # Database schemas
│   │   ├── routes/
│   │   │   ├── auth.routes.js
│   │   │   └── interview.routes.js
│   │   ├── services/                 # Business logic
│   │   └── app.js                    # Express app setup
│   ├── server.js                     # Entry point
│   ├── package.json
│   ├── .env.example
│   └── .puppeteerrc.cjs              # Puppeteer config
│
└── README.md                          # This file
```

---

## 🔄 Application Flow

```
┌─────────────────────────────────────────────────────────────┐
│                                                             │
│  ┌──────────────┐         ┌──────────────┐                │
│  │   Register   │         │    Login     │                │
│  └──────┬───────┘         └──────┬───────┘                │
│         │                        │                         │
│         └────────────┬───────────┘                         │
│                      ▼                                      │
│              ┌────────────────┐                            │
│              │   Dashboard    │                            │
│              └────────┬───────┘                            │
│                       │                                     │
│         ┌─────────────┼─────────────┐                      │
│         ▼             ▼             ▼                      │
│   ┌─────────────┐ ┌──────────┐ ┌─────────────┐           │
│   │Upload Resume│ │Add Job   │ │Add Self     │           │
│   │(PDF)        │ │Desc.     │ │Description  │           │
│   └─────────────┘ └──────────┘ └─────────────┘           │
│         │             │             │                      │
│         └─────────────┼─────────────┘                      │
│                       ▼                                     │
│           ┌──────────────────────┐                         │
│           │ Generate AI Report   │ (Google Gemini)         │
│           └──────────┬───────────┘                         │
│                      ▼                                      │
│           ┌──────────────────────┐                         │
│           │  View Full Report    │                         │
│           │  • Technical Skills  │                         │
│           │  • Behavioral Tips   │                         │
│           │  • Skill Gaps        │                         │
│           │  • Interview Q&A     │                         │
│           └──────────┬───────────┘                         │
│                      │                                      │
│         ┌────────────┼────────────┐                        │
│         ▼            ▼            ▼                        │
│   ┌──────────┐ ┌──────────┐ ┌──────────┐                  │
│   │Download  │ │View      │ │Browse    │                  │
│   │Resume    │ │History   │ │Past      │                  │
│   │PDF       │ │          │ │Reports   │                  │
│   └──────────┘ └──────────┘ └──────────┘                  │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

---

## 🛠️ Installation & Setup

### Prerequisites
- **Node.js** (v16 or higher)
- **npm** or **yarn**
- **MongoDB** (local or cloud instance)
- **Google Gemini API key** ([Get it here](https://ai.google.dev/))

### Backend Setup

1. **Navigate to backend directory:**
   ```bash
   cd backend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Create `.env` file:**
   ```bash
   cp .env.example .env
   ```

4. **Configure environment variables in `.env`:**
   ```env
   PORT=3000
   MONGODB_URI=mongodb://localhost:27017/ai-interview-analyzer
   JWT_SECRET=your_jwt_secret_key_here
   GOOGLE_GENAI_API_KEY=your_google_genai_api_key_here
   NODE_ENV=development
   ```

5. **Start the server:**
   ```bash
   # Development mode (with auto-reload)
   npm run dev

   # Production mode
   npm run start
   ```

   The backend will run on `http://localhost:3000`

### Frontend Setup

1. **Navigate to frontend directory:**
   ```bash
   cd frontend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Create `.env` file:**
   ```env
   VITE_API_URL=http://localhost:3000
   ```

4. **Start the development server:**
   ```bash
   npm run dev
   ```

   The frontend will run on `http://localhost:5173`

5. **Build for production:**
   ```bash
   npm run build
   npm run preview
   ```

---

## 📊 API Endpoints

### Authentication (`/api/auth`)
- `POST /register` - Create new user account
- `POST /login` - Authenticate user
- `POST /logout` - End session
- `GET /profile` - Get authenticated user profile
- `GET /verify` - Verify JWT token

### Interview (`/api/interview`)
- `POST /generate` - Generate AI interview report
- `GET /reports` - Fetch user's report history
- `GET /reports/:id` - Get specific report details
- `POST /reports/:id/resume` - Download tailored resume PDF
- `DELETE /reports/:id` - Delete a report

---

## 🔐 Security Features

- **JWT Authentication**: Secure token-based authentication with httpOnly cookies
- **Password Hashing**: Bcryptjs with salt rounds for secure password storage
- **CORS Configuration**: Restricted to authorized frontend origins
- **Input Validation**: Zod schema validation for all API requests
- **File Upload Validation**: PDF-only, max 5 MB file size
- **Environment Variables**: Sensitive data stored securely in `.env`

---

## 🌐 Deployment

### Frontend (Vercel)
```bash
cd frontend
npm run build
# Deploy the dist/ folder to Vercel
```

**Live Demo**: https://ai-interview-analyzer-xi.vercel.app

### Backend (Any Node.js Hosting)
- Render, Heroku, Railway, AWS, or DigitalOcean
- Set environment variables in hosting platform
- Update `VITE_API_URL` in frontend for production backend URL

---

## 📝 Environment Variables Reference

### Backend (`.env`)
| Variable | Description | Example |
|----------|-------------|---------|
| `PORT` | Server port | `3000` |
| `MONGODB_URI` | MongoDB connection string | `mongodb://localhost:27017/db` |
| `JWT_SECRET` | Secret key for JWT signing | `your-secret-key` |
| `GOOGLE_GENAI_API_KEY` | Google Gemini API key | `AIzaSy...` |
| `NODE_ENV` | Environment mode | `development` or `production` |

### Frontend (`.env`)
| Variable | Description | Example |
|----------|-------------|---------|
| `VITE_API_URL` | Backend API base URL | `http://localhost:3000` |

---

## 🧪 Development Workflow

1. **Create a feature branch:**
   ```bash
   git checkout -b feature/your-feature-name
   ```

2. **Make changes and test locally**

3. **Run linting (Frontend):**
   ```bash
   cd frontend
   npm run lint
   ```

4. **Build before committing (Frontend):**
   ```bash
   cd frontend
   npm run build
   ```

5. **Commit and push:**
   ```bash
   git add .
   git commit -m "feat: add new feature"
   git push origin feature/your-feature-name
   ```

6. **Open a pull request and wait for review**

---

## 📚 Documentation

- [Frontend README](./frontend/README.md) - Detailed frontend setup and structure
- [Backend Setup Guide](./backend/README.md) - Backend-specific configuration
- [API Documentation](./docs/API.md) - Complete API reference (if available)

---

## 🤝 Contributing

We welcome contributions! Please follow these steps:

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'feat: add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Code Standards
- Follow existing code style
- Write meaningful commit messages
- Include tests for new features
- Update documentation as needed

---

## 🐛 Troubleshooting

### Issue: Backend won't connect to MongoDB
**Solution**: Verify MongoDB is running and `MONGODB_URI` is correct in `.env`

### Issue: CORS errors in frontend
**Solution**: Ensure `VITE_API_URL` matches backend origin in frontend `.env`

### Issue: PDF generation fails
**Solution**: Ensure Puppeteer is installed: `npm run postinstall` in backend

### Issue: Google Gemini API errors
**Solution**: Verify `GOOGLE_GENAI_API_KEY` is valid and has proper permissions

---

## 📄 License

This project is licensed under the ISC License - see the LICENSE file for details.

---

## 👤 Author

**Akash138170**  
- GitHub: [@Akash138170](https://github.com/Akash138170)
- Email: [your-email@example.com]

---

## 🙏 Acknowledgments

- Google Gemini AI for powerful content generation
- React and Vite communities for excellent tools
- All contributors and users who provide feedback

---

## 📞 Support

Have questions or need help?
- 📧 Email: [your-email@example.com]
- 🐛 [Report a Bug](../../issues/new)
- 💡 [Request a Feature](../../issues/new)
- 💬 [Start a Discussion](../../discussions)

---

<div align="center">

**Made with ❤️ by Akash138170**

[⬆ Back to top](#ai-interview-analyzer)

</div>
