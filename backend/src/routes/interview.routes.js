const express = require("express");

const authMiddleware = require("../middleware/auth.middleware");
const interviewController = require("../controllers/interview.controller");
const upload = require("../middleware/file.middleware");

const interviewRouter = express.Router();

/*
|--------------------------------------------------------------------------
| Interview Routes
|--------------------------------------------------------------------------
*/

// Generate interview report
interviewRouter.post(
  "/",
  authMiddleware.authUser,
  upload.single("resume"),
  interviewController.generateInterviewReportController
);

// Get all interview reports
interviewRouter.get(
  "/",
  authMiddleware.authUser,
  interviewController.getAllInterviewReportsController
);

// Get interview report by ID
interviewRouter.get(
  "/report/:interviewId",
  authMiddleware.authUser,
  interviewController.getInterviewReportByIdController
);

// Generate resume PDF
interviewRouter.post(
  "/resume/pdf/:interviewId",
  authMiddleware.authUser,
  interviewController.generateResumeController
);

module.exports = interviewRouter;