import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true,
});

export const generateInterviewReport = async ({
  jobDescription,
  selfDescription,
  resumeFile,
}) => {
  if (!jobDescription?.trim()) {
    throw new Error("Job description is required");
  }

  if (!selfDescription?.trim()) {
    throw new Error("Self description is required");
  }

  if (!resumeFile) {
    throw new Error("Resume file is required");
  }

  const formData = new FormData();

  formData.append("jobDescription", jobDescription.trim());
  formData.append("selfDescription", selfDescription.trim());
  formData.append("resume", resumeFile);

  const response = await api.post("/api/interview", formData);

  return response.data;
};

export const generateInterviewReportById = async (interviewId) => {
  if (!interviewId) {
    throw new Error("Interview ID is required");
  }

  const response = await api.get(
    `/api/interview/report/${interviewId}`,
  );

  return response.data;
};

export const getAllInterviewReports = async () => {
  const response = await api.get("/api/interview/");

  return response.data;
};

export const generateResumePdf = async ({ interviewId }) => {
  if (!interviewId) {
    throw new Error("Interview ID is required");
  }

  const response = await api.post(
    `/api/interview/resume/pdf/${interviewId}`,
    null,
    {
      responseType: "blob",
    },
  );

  return response.data;
};