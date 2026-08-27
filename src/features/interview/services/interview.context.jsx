import {
  createContext,
  useCallback,
  useEffect,
  useState,
} from "react";

import {
  generateInterviewReport,
  getAllInterviewReports,
} from "../services/interview.api";

export const interviewContext = createContext(null);

export const InterviewProvider = ({ children }) => {
  const [loading, setLoading] = useState(false);
  const [reportsLoading, setReportsLoading] = useState(false);

  const [report, setReport] = useState(null);
  const [reports, setReports] = useState([]);
  const [resumeLoading, setResumeLoading] = useState(false);

  // ---------------------------------------------
  // Fetch all reports
  // ---------------------------------------------

  const fetchReports = useCallback(async () => {
    try {
      setReportsLoading(true);

      const data = await getAllInterviewReports();

      setReports(data?.interviewReports ?? []);
    } catch (error) {
      console.error(
        "Failed to fetch interview reports:",
        error,
      );

      setReports([]);
    } finally {
      setReportsLoading(false);
    }
  }, []);

  // ---------------------------------------------
  // Create interview report
  // ---------------------------------------------

  const createInterviewReport = async (formData) => {
    try {
      setLoading(true);

      const data = await generateInterviewReport(formData);

      const newReport = data?.interviewReport;

      if (newReport) {
        setReport(newReport);

        setReports((prev) => [
          newReport,
          ...prev,
        ]);
      }

      return data;
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

  // ---------------------------------------------
  // Fetch reports on provider mount
  // ---------------------------------------------

  useEffect(() => {
    fetchReports();
  }, [fetchReports]);

  return (
    <interviewContext.Provider
      value={{
        // Loading
        loading,
        reportsLoading,
        resumeLoading,

        // Data
        report,
        reports,

        // Setters
        setLoading,
        setReport,
        setReports,
        setResumeLoading,

        // Actions
        createInterviewReport,
        fetchReports,
      }}
    >
      {children}
    </interviewContext.Provider>
  );
};