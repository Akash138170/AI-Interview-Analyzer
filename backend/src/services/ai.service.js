const { GoogleGenAI } = require("@google/genai");
const { z } = require("zod");
const puppeteer = require("puppeteer");

/*
|--------------------------------------------------------------------------
| ENV VALIDATION
|--------------------------------------------------------------------------
*/

if (!process.env.GOOGLE_GENAI_API_KEY) {
  throw new Error("GOOGLE_GENAI_API_KEY is not configured.");
}

/*
|--------------------------------------------------------------------------
| GEMINI CONFIGURATION
|--------------------------------------------------------------------------
*/

const GEMINI_MODEL =
  process.env.GEMINI_MODEL || "gemini-3-flash-preview";

/*
|--------------------------------------------------------------------------
| GEMINI CLIENT
|--------------------------------------------------------------------------
*/

const ai = new GoogleGenAI({
  apiKey: process.env.GOOGLE_GENAI_API_KEY,
});

/*
|--------------------------------------------------------------------------
| ZOD SCHEMA
|--------------------------------------------------------------------------
|
| This schema is aligned with the Mongoose InterviewReport schema.
|
*/

const interviewReportSchema = z.object({
  matchScore: z
    .number()
    .min(0)
    .max(100)
    .describe(
      "Overall candidate-job match score from 0 to 100."
    ),

  technicalQuestions: z
    .array(
      z.object({
        question: z.string().min(1),

        intention: z.string().min(1),

        answer: z.string().min(1),
      })
    )
    .describe(
      "Technical interview questions relevant to the target role. Each item must contain question, intention and answer."
    ),

  behavioralQuestions: z
    .array(
      z.object({
        question: z.string().min(1),

        intention: z.string().min(1),

        answer: z.string().min(1),
      })
    )
    .describe(
      "Behavioral interview questions relevant to the target role. Each item must contain question, intention and answer."
    ),

  skillGaps: z
    .array(
      z.object({
        skill: z.string().min(1),

        severity: z.enum([
          "low",
          "meduim",
          "high",
        ]),
      })
    )
    .describe(
      "Important skills the candidate needs to improve."
    ),

  preparationPlan: z
    .array(
      z.object({
        day: z
          .number()
          .int()
          .min(1),

        focus: z.string().min(1),

        tasks: z.array(
          z.string().min(1)
        ),
      })
    )
    .describe(
      "A practical day-by-day interview preparation plan."
    ),

  title: z
    .string()
    .min(1)
    .describe(
      "The title of the job for which the interview report is generated."
    ),
});

/*
|--------------------------------------------------------------------------
| GENERATE INTERVIEW REPORT
|--------------------------------------------------------------------------
*/

async function generateInterviewReport({
  resume,
  selfDescription,
  jobDescription,
}) {
  try {
    /*
    |--------------------------------------------------------------------------
    | 1. INPUT VALIDATION
    |--------------------------------------------------------------------------
    */

    if (
      typeof resume !== "string" ||
      !resume.trim()
    ) {
      throw new Error("Resume is required.");
    }

    if (
      typeof selfDescription !== "string" ||
      !selfDescription.trim()
    ) {
      throw new Error(
        "Self description is required."
      );
    }

    if (
      typeof jobDescription !== "string" ||
      !jobDescription.trim()
    ) {
      throw new Error(
        "Job description is required."
      );
    }

    /*
    |--------------------------------------------------------------------------
    | 2. CREATE JSON SCHEMA
    |--------------------------------------------------------------------------
    */

    const responseJsonSchema =
      z.toJSONSchema(
        interviewReportSchema
      );

    /*
    |--------------------------------------------------------------------------
    | 3. PROMPT
    |--------------------------------------------------------------------------
    */

    const prompt = `
You are an expert technical recruiter,
senior interviewer, and career coach.

Analyze the candidate against the target job description.

Generate an evidence-based interview preparation report.

========================
CANDIDATE RESUME
========================

${resume}

========================
SELF DESCRIPTION
========================

${selfDescription}

========================
JOB DESCRIPTION
========================

${jobDescription}

========================
IMPORTANT RULES
========================

1. Use ONLY information present in the resume,
self-description, and job description.

2. Never invent skills, experience, projects,
certifications, achievements, or employment history.

3. If a skill is not demonstrated in the candidate
information, consider it "not demonstrated".

4. matchScore must be between 0 and 100.

5. Required job skills are more important than
optional skills.

6. technicalQuestions MUST contain OBJECTS.

Every technicalQuestions item MUST have:

question
intention
answer

The answer field must contain practical guidance
for how the candidate should answer the question.

7. behavioralQuestions MUST contain OBJECTS.

Every behavioralQuestions item MUST have:

question
intention
answer

The answer field must contain practical answer guidance.
Use the STAR structure when appropriate.

8. skillGaps MUST contain OBJECTS.

Every skillGaps item MUST have:

skill
severity

severity must be exactly:

low
meduim
high

9. preparationPlan MUST contain OBJECTS.

Every preparationPlan item MUST have:

day
focus
tasks

10. title MUST contain the job title
for which the interview report is being generated.

11. Avoid duplicate questions.

12. Avoid duplicate skill gaps.

13. Keep the report practical and concise.

14. Do not return technicalQuestions as strings.

15. Do not return behavioralQuestions as strings.

16. Do not return skillGaps as strings.

17. Do not return preparationPlan as strings.

18. Return ONLY the JSON object matching
the provided schema.

Do not add markdown.
Do not add explanations outside the JSON object.
`;

    /*
    |--------------------------------------------------------------------------
    | 4. CALL GEMINI
    |--------------------------------------------------------------------------
    */

    const response =
      await ai.models.generateContent({
        model: GEMINI_MODEL,

        contents: prompt,

        config: {
          responseMimeType: "application/json",

          responseJsonSchema,
        },
      });

    /*
    |--------------------------------------------------------------------------
    | 5. GET RESPONSE TEXT
    |--------------------------------------------------------------------------
    */

    const rawText =
      response?.text;

    if (
      typeof rawText !== "string" ||
      !rawText.trim()
    ) {
      throw new Error(
        "Gemini returned an empty response."
      );
    }

    /*
    |--------------------------------------------------------------------------
    | 6. PARSE JSON
    |--------------------------------------------------------------------------
    */

    let parsedReport;

    try {
      parsedReport =
        JSON.parse(rawText);
    } catch (error) {
      console.error(
        "Gemini returned invalid JSON."
      );

      throw new Error(
        "Gemini returned invalid JSON."
      );
    }

    /*
    |--------------------------------------------------------------------------
    | 7. VALIDATE WITH ZOD
    |--------------------------------------------------------------------------
    */

    const validationResult =
      interviewReportSchema.safeParse(
        parsedReport
      );

    /*
    |--------------------------------------------------------------------------
    | 8. HANDLE VALIDATION ERROR
    |--------------------------------------------------------------------------
    */

    if (
      !validationResult.success
    ) {
      console.error(
        "AI response failed schema validation:",
        validationResult.error.issues
      );

      throw new Error(
        "AI response does not match expected schema."
      );
    }

    /*
    |--------------------------------------------------------------------------
    | 9. RETURN VALIDATED DATA
    |--------------------------------------------------------------------------
    */

    return validationResult.data;
  } catch (error) {
    console.error(
      "Interview report generation failed:",
      error?.message || error
    );

    throw error;
  }
}

/*
|--------------------------------------------------------------------------
| GENERATE PDF FROM HTML
|--------------------------------------------------------------------------
*/

async function generatePdfFromHtml(htmlContent) {
  if (!htmlContent?.trim()) {
    throw new Error("HTML content is required.");
  }

  let browser;

  try {
    browser = await puppeteer.launch({
      headless: true,

      executablePath:
        "/opt/render/.cache/puppeteer/chrome/linux-152.0.7977.54/chrome-linux64/chrome",

      args: [
        "--no-sandbox",
        "--disable-setuid-sandbox",
      ],
    });

    const page = await browser.newPage();

    await page.setContent(htmlContent, {
      waitUntil: "networkidle0",
    });

    await page.emulateMediaType("print");

    const pdfBuffer = await page.pdf({
      format: "A4",
      printBackground: true,
      preferCSSPageSize: true,

      margin: {
        top: "10mm",
        right: "10mm",
        bottom: "10mm",
        left: "10mm",
      },
    });

    return pdfBuffer;
  } catch (error) {
    console.error(
      "PDF generation failed:",
      error?.message || error
    );

    throw error;
  } finally {
    if (browser) {
      await browser.close();
    }
  }
}

/*
|--------------------------------------------------------------------------
| RESUME PDF SCHEMA
|--------------------------------------------------------------------------
*/

const resumePdfSchema = z.object({
  html: z
    .string()
    .min(100)
    .describe(
      "Complete, valid HTML document containing the professionally formatted resume"
    ),
});

/*
|--------------------------------------------------------------------------
| GENERATE RESUME HTML
|--------------------------------------------------------------------------
*/

async function generateResumePdf({
  resume,
  selfDescription,
  jobDescription,
}) {
  try {
    /*
    |--------------------------------------------------------------------------
    | 1. INPUT VALIDATION
    |--------------------------------------------------------------------------
    */

    if (!resume?.trim()) {
      throw new Error(
        "Resume data is required."
      );
    }

    if (!selfDescription?.trim()) {
      throw new Error(
        "Self description is required."
      );
    }

    if (!jobDescription?.trim()) {
      throw new Error(
        "Job description is required."
      );
    }

    /*
    |--------------------------------------------------------------------------
    | 2. PROMPT
    |--------------------------------------------------------------------------
    */

    const prompt = `
You are a professional resume designer and ATS resume expert.

Create a professional, ATS-friendly resume using ONLY the information provided below.

IMPORTANT RULES:

1. DO NOT INVENT ANY INFORMATION.

Do not invent:
- Skills
- Companies
- Job titles
- Education
- Certifications
- Projects
- Experience
- Achievements
- Dates
- Contact information
- Email
- Phone number
- LinkedIn
- GitHub
- Portfolio

2. You MAY:
- Improve wording
- Fix grammar
- Improve sentence structure
- Organize information professionally
- Highlight relevant information from existing candidate data
- Prioritize information relevant to the target job

3. RESUME REQUIREMENTS:

The resume must be:
- Professional
- Modern
- ATS-friendly
- Clean
- Readable
- A4 compatible
- Single-column
- Suitable for PDF printing
- Easy for recruiters to scan

4. HTML REQUIREMENTS:

Generate a COMPLETE HTML document.

The HTML MUST:
- Start with <!DOCTYPE html>
- Contain <html>
- Contain <head>
- Contain <body>
- Include embedded CSS
- Not use external CSS
- Not use external images
- Not use JavaScript
- Be compatible with Puppeteer
- Be printable on A4 paper
- Use semantic HTML

5. OUTPUT FORMAT:

Return ONLY valid JSON.

The JSON MUST have exactly one field:

{
  "html": "<complete HTML document>"
}

The value of "html" MUST contain the complete HTML document.

DO NOT return markdown.
DO NOT return explanations.
DO NOT wrap HTML in markdown code fences.

CANDIDATE RESUME:
${resume}

CANDIDATE SELF DESCRIPTION:
${selfDescription}

TARGET JOB DESCRIPTION:
${jobDescription}
`;

    /*
    |--------------------------------------------------------------------------
    | 3. CALL GEMINI
    |--------------------------------------------------------------------------
    */

    const response =
      await ai.models.generateContent({
        model: GEMINI_MODEL,

        contents: prompt,

        config: {
          responseMimeType:
            "application/json",
        },
      });

    /*
    |--------------------------------------------------------------------------
    | 4. GET AI RESPONSE
    |--------------------------------------------------------------------------
    */

    const rawText =
      response?.text?.trim();

    if (!rawText) {
      throw new Error(
        "AI returned an empty response."
      );
    }

    /*
    |--------------------------------------------------------------------------
    | 5. PARSE JSON
    |--------------------------------------------------------------------------
    */

    let parsedResponse;

    try {
      parsedResponse =
        JSON.parse(rawText);
    } catch (error) {
      console.error(
        "AI returned invalid JSON."
      );

      throw new Error(
        "AI returned invalid JSON."
      );
    }

    /*
    |--------------------------------------------------------------------------
    | 6. VALIDATE RESPONSE
    |--------------------------------------------------------------------------
    */

    const validatedResponse =
      resumePdfSchema.safeParse(
        parsedResponse
      );

    if (
      !validatedResponse.success
    ) {
      console.error(
        "Resume schema validation failed:",
        validatedResponse.error.issues
      );

      throw new Error(
        "AI returned an invalid resume format."
      );
    }

    /*
    |--------------------------------------------------------------------------
    | 7. HTML VALIDATION
    |--------------------------------------------------------------------------
    */

    const {
      html,
    } = validatedResponse.data;

    const normalizedHtml =
      html.trim();

    if (
      !/^<!DOCTYPE html>/i.test(
        normalizedHtml
      )
    ) {
      throw new Error(
        "Generated resume HTML must start with <!DOCTYPE html>."
      );
    }

    if (
      !/<html[\s>]/i.test(
        normalizedHtml
      )
    ) {
      throw new Error(
        "Generated resume HTML is missing <html>."
      );
    }

    if (
      !/<head[\s>]/i.test(
        normalizedHtml
      )
    ) {
      throw new Error(
        "Generated resume HTML is missing <head>."
      );
    }

    if (
      !/<body[\s>]/i.test(
        normalizedHtml
      )
    ) {
      throw new Error(
        "Generated resume HTML is missing <body>."
      );
    }

    return {
      html: normalizedHtml,
    };
  } catch (error) {
    console.error(
      "Resume generation failed:",
      error?.message || error
    );

    throw error;
  }
}

/*
|--------------------------------------------------------------------------
| MODULE EXPORTS
|--------------------------------------------------------------------------
*/

module.exports = {
  generateInterviewReport,
  generateResumePdf,
  generatePdfFromHtml,
};