# AI Interview Analyzer

> Turn your resume and target role into a focused, AI-powered interview preparation report.
> The frontend for **AI Interview Analyzer** is a React and Vite application that helps candidates understand their interview readiness. It combines a resume, job description, and self-description to generate a structured report with technical questions, behavioral questions, skill gaps, and preparation guidance.

## Live Demo

Add the deployed frontend URL here:

https://ai-interview-analyzer-xi.vercel.app/

## Features

- Secure registration, login, logout, and authenticated routes
- Resume upload with PDF and 5 MB validation
- AI report generation from role and candidate context
- Interview report history from the dashboard
- Detailed report sections for overview, technical, behavioral, skill gaps, and preparation
- Expandable interview questions with severity and supporting insights
- Downloadable, report-specific resume PDF
- Responsive interface for desktop and mobile screens

## Tech Stack

- React 19
- Vite
- React Router
- Axios
- Tailwind CSS
- Sass
- Lucide React

## Application Flow

```text
Register / Login
	|
	v
Dashboard
	|
	+--> Upload resume PDF
	+--> Add job description
	+--> Add self-description
	|
	v
Generate AI report
	|
	v
Review report and preparation plan
	|
	+--> Browse report history
	+--> Download tailored resume PDF
```

## Project Structure

```text
src/
├── features/
│   ├── auth/
│   │   ├── component/       # Protected route wrapper
│   │   ├── hooks/           # Authentication hooks
│   │   ├── pages/           # Login and registration screens
│   │   └── services/        # Authentication API calls
│   └── interview/
│       ├── hooks/           # Interview state and actions
│       ├── pages/           # Dashboard and report screens
│       └── services/        # Interview API and context
├── App.jsx
├── app.routes.jsx
├── index.css
└── main.jsx
```

## Environment Variables

Create `frontend/.env` with the URL of the running backend:

```env
VITE_API_URL=http://localhost:3000
```

The backend must allow the frontend origin and credentialed requests. Keep secrets in the backend environment, never in the frontend.

## Installation

From the `frontend` directory:

```bash
npm install
```

## Running Locally

Start the backend first, then run the frontend:

```bash
npm run dev
```

Vite will print the local URL in the terminal, usually `http://localhost:5173`.

## Production Build

Create and preview an optimized production build:

```bash
npm run build
npm run preview
```

## Development Notes

- Authentication uses cookies, so frontend and backend CORS settings must support credentials.
- Resume uploads use `multipart/form-data` through Axios.
- The `.env` file is ignored by Git. Use an `.env.example` file for safe configuration documentation.
- Keep the backend running while testing login, report generation, and PDF downloads.

## Contributing

1. Create a feature branch.
2. Install dependencies with `npm install`.
3. Run `npm run lint` and `npm run build` before opening a pull request.
4. Keep changes focused and preserve the feature-based structure.

## License

Add the project's license here before publishing the repository publicly.

