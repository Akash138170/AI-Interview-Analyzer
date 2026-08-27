const { PDFParse } = require("pdf-parse");
const mongoose = require("mongoose");

const {
  generateInterviewReport,
  generateResumePdf,
  generatePdfFromHtml,
} = require("../services/ai.service");

const interviewReportModel = require("../models/interviewReport.model");

/*
|--------------------------------------------------------------------------
| Generate Interview Report
|--------------------------------------------------------------------------
*/

async function generateInterviewReportController(
  req,
  res,
  next
) {
  try {
    /*
    |--------------------------------------------------------------------------
    | 1. Check authenticated user
    |--------------------------------------------------------------------------
    */

    if (!req.user?.id) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    /*
    |--------------------------------------------------------------------------
    | 2. Check uploaded file
    |--------------------------------------------------------------------------
    */

    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Resume PDF is required",
      });
    }

    /*
    |--------------------------------------------------------------------------
    | 3. Check file type
    |--------------------------------------------------------------------------
    */

    if (
      req.file.mimetype !==
      "application/pdf"
    ) {
      return res.status(400).json({
        success: false,
        message: "Only PDF files are allowed",
      });
    }

    /*
    |--------------------------------------------------------------------------
    | 4. Check file buffer
    |--------------------------------------------------------------------------
    */

    if (
      !req.file.buffer ||
      req.file.buffer.length === 0
    ) {
      return res.status(400).json({
        success: false,
        message: "Uploaded resume is empty",
      });
    }

    /*
    |--------------------------------------------------------------------------
    | 5. Validate request body
    |--------------------------------------------------------------------------
    */

    const {
      selfDescription,
      jobDescription,
    } = req.body;

    if (!selfDescription?.trim()) {
      return res.status(400).json({
        success: false,
        message:
          "selfDescription is required",
      });
    }

    if (!jobDescription?.trim()) {
      return res.status(400).json({
        success: false,
        message:
          "jobDescription is required",
      });
    }

    /*
    |--------------------------------------------------------------------------
    | 6. Parse PDF
    |--------------------------------------------------------------------------
    */

    const parser = new PDFParse({
      data: req.file.buffer,
    });

    let pdfResult;

    try {
      pdfResult =
        await parser.getText();
    } finally {
      /*
      | Always release parser resources,
      | even when PDF parsing fails.
      */
      await parser.destroy();
    }

    const resumeContent =
      pdfResult.text?.trim();

    /*
    |--------------------------------------------------------------------------
    | 7. Make sure text was extracted
    |--------------------------------------------------------------------------
    */

    if (!resumeContent) {
      return res.status(400).json({
        success: false,
        message:
          "Could not extract text from the resume",
      });
    }

    /*
    |--------------------------------------------------------------------------
    | 8. Generate AI interview report
    |--------------------------------------------------------------------------
    */

    const interviewReportByAi =
      await generateInterviewReport({
        resume: resumeContent,
        selfDescription:
          selfDescription.trim(),
        jobDescription:
          jobDescription.trim(),
      });

    /*
    |--------------------------------------------------------------------------
    | 9. Validate AI response
    |--------------------------------------------------------------------------
    */

    if (!interviewReportByAi) {
      return res.status(502).json({
        success: false,
        message:
          "Failed to generate interview report",
      });
    }

    /*
    |--------------------------------------------------------------------------
    | 10. Save report
    |--------------------------------------------------------------------------
    */

    const interviewReport =
      await interviewReportModel.create({
        user: req.user.id,
        resume: resumeContent,
        selfDescription:
          selfDescription.trim(),
        jobDescription:
          jobDescription.trim(),
        ...interviewReportByAi,
      });

    /*
    |--------------------------------------------------------------------------
    | 11. Response
    |--------------------------------------------------------------------------
    */

    return res.status(201).json({
      success: true,
      message:
        "Interview report generated successfully",
      interviewReport,
    });
  } catch (error) {
    console.error(
      "Generate Interview Report Controller Error:",
      error?.message || error
    );

    next(error);
  }
}

/*
|--------------------------------------------------------------------------
| Get Interview Report By ID
|--------------------------------------------------------------------------
*/

async function getInterviewReportByIdController(
  req,
  res
) {
  try {
    const { interviewId } =
      req.params;

    /*
    |--------------------------------------------------------------------------
    | 1. Validate interview ID
    |--------------------------------------------------------------------------
    */

    if (
      !mongoose.Types.ObjectId.isValid(
        interviewId
      )
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Invalid interview report ID",
      });
    }

    /*
    |--------------------------------------------------------------------------
    | 2. Ensure authenticated user exists
    |--------------------------------------------------------------------------
    */

    if (!req.user?.id) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    /*
    |--------------------------------------------------------------------------
    | 3. Fetch report belonging to logged-in user
    |--------------------------------------------------------------------------
    */

    const interviewReport =
      await interviewReportModel
        .findOne({
          _id: interviewId,
          user: req.user.id,
        })
        .lean();

    /*
    |--------------------------------------------------------------------------
    | 4. Report not found
    |--------------------------------------------------------------------------
    */

    if (!interviewReport) {
      return res.status(404).json({
        success: false,
        message:
          "Interview report not found",
      });
    }

    /*
    |--------------------------------------------------------------------------
    | 5. Success response
    |--------------------------------------------------------------------------
    */

    return res.status(200).json({
      success: true,
      message:
        "Interview report fetched successfully",
      interviewReport,
    });
  } catch (error) {
    console.error(
      "Get interview report error:",
      error?.message || error
    );

    return res.status(500).json({
      success: false,
      message:
        "Failed to fetch interview report",
    });
  }
}

/*
|--------------------------------------------------------------------------
| Get All Interview Reports
|--------------------------------------------------------------------------
*/

async function getAllInterviewReportsController(
  req,
  res,
  next
) {
  try {
    if (!req.user?.id) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    const interviewReports =
      await interviewReportModel
        .find({
          user: req.user.id,
        })
        .select(
          "-resume -selfDescription -jobDescription -__v -technicalQuestions -behavioralQuestions -skillGaps -preparationPlan"
        )
        .sort({
          createdAt: -1,
        })
        .lean();

    return res.status(200).json({
      success: true,
      message:
        "Interview reports fetched successfully",
      count: interviewReports.length,
      interviewReports,
    });
  } catch (error) {
    console.error(
      "Get all interview reports error:",
      error?.message || error
    );

    next(error);
  }
}

/*
|--------------------------------------------------------------------------
| Generate Resume PDF
|--------------------------------------------------------------------------
*/

async function generateResumeController(
  req,
  res
) {
  try {
    const { interviewId } =
      req.params;

    /*
    |--------------------------------------------------------------------------
    | 1. Validate authenticated user
    |--------------------------------------------------------------------------
    */

    if (!req.user?.id) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    /*
    |--------------------------------------------------------------------------
    | 2. Validate interview ID
    |--------------------------------------------------------------------------
    */

    if (
      !mongoose.Types.ObjectId.isValid(
        interviewId
      )
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Invalid interview report ID",
      });
    }

    /*
    |--------------------------------------------------------------------------
    | 3. Fetch report belonging to logged-in user
    |--------------------------------------------------------------------------
    |
    | Important security check:
    | A user must not be able to generate a resume
    | from another user's interview report.
    |
    */

    const interviewReport =
      await interviewReportModel.findOne({
        _id: interviewId,
        user: req.user.id,
      });

    if (!interviewReport) {
      return res.status(404).json({
        success: false,
        message:
          "Interview report not found",
      });
    }

    /*
    |--------------------------------------------------------------------------
    | 4. Extract required data
    |--------------------------------------------------------------------------
    */

    const {
      resume,
      selfDescription,
      jobDescription,
    } = interviewReport;

    /*
    |--------------------------------------------------------------------------
    | 5. Generate resume HTML using AI
    |--------------------------------------------------------------------------
    */

    const resumeResult =
      await generateResumePdf({
        resume,
        selfDescription,
        jobDescription,
      });

    /*
    |--------------------------------------------------------------------------
    | 6. Convert HTML to PDF
    |--------------------------------------------------------------------------
    */

    const pdfBuffer =
      await generatePdfFromHtml(
        resumeResult.html
      );

    /*
    |--------------------------------------------------------------------------
    | 7. Send PDF response
    |--------------------------------------------------------------------------
    */

    res.set({
      "Content-Type":
        "application/pdf",

      "Content-Disposition":
        'attachment; filename="resume.pdf"',

      "Content-Length":
        pdfBuffer.length,
    });

    return res
      .status(200)
      .send(pdfBuffer);
  } catch (error) {
    console.error(
      "Resume generation error:",
      error?.message || error
    );

    return res.status(500).json({
      success: false,
      message:
        "Failed to generate resume",
    });
  }
}

module.exports = {
  generateInterviewReportController,
  getInterviewReportByIdController,
  getAllInterviewReportsController,
  generateResumeController,
};