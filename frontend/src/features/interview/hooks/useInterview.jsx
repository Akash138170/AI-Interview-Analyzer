import { useContext } from "react";

import {
  generateInterviewReport,
  generateInterviewReportById,
  getAllInterviewReports,
  generateResumePdf,
} from "../services/interview.api";

import { interviewContext } from "../services/interview.context";

export const useInterview = () => {
  const context = useContext(interviewContext);

  if (!context) {
    throw new Error(
      "useInterview must be used within an InterviewProvider",
    );
  }

  const {
    loading,
    setLoading,
    report,
    setReport,
    reports,
    setReports,
    resumeLoading,
    setResumeLoading,
  } = context;

  const createInterviewReport = async (data) => {
    try {
      setLoading(true);

      const response = await generateInterviewReport(data);

      setReport(response.interviewReport);

      return response;
    } catch (error) {
      console.error(
        "Failed to generate interview report:",
        error,
      );

      throw error;
    } finally {
      setLoading(false);
    }
  };

  const getReportById = async (interviewId) => {
    try {
      setLoading(true);

      const response = await generateInterviewReportById(
        interviewId,
      );

      setReport(response.interviewReport);

      return response;
    } catch (error) {
      console.error(
        "Failed to fetch interview report:",
        error,
      );

      setReport(null);

      throw error;
    } finally {
      setLoading(false);
    }
  };

  const getReports = async () => {
    try {
      setLoading(true);

      const response = await getAllInterviewReports();

      setReports(response.interviewReports);

      return response;
    } catch (error) {
      console.error(
        "Failed to fetch interview reports:",
        error,
      );

      setReports([]);

      throw error;
    } finally {
      setLoading(false);
    }
  };

  const getResumePdf = async (interviewId) => {
    setResumeLoading(true);

    let url = null;

    try {
      const response = await generateResumePdf({
        interviewId,
      });

      url = window.URL.createObjectURL(response);

      const link = document.createElement("a");

      link.href = url;
      link.download = `resume_${interviewId}.pdf`;

      document.body.appendChild(link);
      link.click();
      link.remove();

      return response;
    } catch (error) {
      console.error(
        "Resume PDF download failed:",
        error?.response?.data?.message ||
          error?.message ||
          "Unknown error",
      );

      throw error;
    } finally {
      if (url) {
        window.URL.revokeObjectURL(url);
      }

      setResumeLoading(false);
    }
  };

  return {
    loading,
    resumeLoading,
    report,
    reports,

    createInterviewReport,
    getReportById,
    getReports,
    getResumePdf,
  };
};