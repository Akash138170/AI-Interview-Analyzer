import React, { useRef, useState } from "react";
import { useInterview } from "../hooks/useInterview";
import { logOut } from "../../auth/services/auth.api"
import { useNavigate } from "react-router";

function Home() {
  const fileInputRef = useRef(null);
  const navigate = useNavigate();

  const {
    loading,
    createInterviewReport,
    reports = [],
  } = useInterview();

  const [formData, setFormData] = useState({
    jobDescription: "",
    selfDescription: "",
    resumeFile: null,
  });

  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState("");

  // --------------------------------------------------
  // Constants
  // --------------------------------------------------

  const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

  // --------------------------------------------------
  // Form Change
  // --------------------------------------------------

  const handleChange = (e) => {
    const { name, value } = e.target;

    setError("");

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // --------------------------------------------------
  // Resume Validation
  // --------------------------------------------------

  const validateResume = (file) => {
    if (!file) {
      return "Please upload your resume.";
    }

    const isPdf =
      file.type === "application/pdf" ||
      file.name.toLowerCase().endsWith(".pdf");

    if (!isPdf) {
      return "Only PDF resumes are supported.";
    }

    if (file.size > MAX_FILE_SIZE) {
      return "Resume size must be less than 5MB.";
    }

    return "";
  };

  // --------------------------------------------------
  // Resume Change
  // --------------------------------------------------

  const handleResumeChange = (file) => {
    if (!file) return;

    const validationError = validateResume(file);

    if (validationError) {
      setError(validationError);

      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }

      return;
    }

    setError("");

    setFormData((prev) => ({
      ...prev,
      resumeFile: file,
    }));
  };

  // --------------------------------------------------
  // File Input
  // --------------------------------------------------

  const handleFileInput = (e) => {
    const file = e.target.files?.[0];

    handleResumeChange(file);
  };

  // --------------------------------------------------
  // Drag & Drop
  // --------------------------------------------------

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();

    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();

    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();

    setIsDragging(false);

    const file = e.dataTransfer.files?.[0];

    handleResumeChange(file);
  };

  // --------------------------------------------------
  // Remove Resume
  // --------------------------------------------------

  const handleRemoveResume = (e) => {
    e.stopPropagation();

    setFormData((prev) => ({
      ...prev,
      resumeFile: null,
    }));

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }

    setError("");
  };

  // --------------------------------------------------
  // Form Validation
  // --------------------------------------------------

  const validateForm = () => {
    if (!formData.jobDescription.trim()) {
      return "Please enter the job description.";
    }

    if (formData.jobDescription.trim().length < 20) {
      return "Job description should contain at least 20 characters.";
    }

    if (!formData.selfDescription.trim()) {
      return "Please describe yourself.";
    }

    if (formData.selfDescription.trim().length < 20) {
      return "Self description should contain at least 20 characters.";
    }

    const resumeError = validateResume(formData.resumeFile);

    if (resumeError) {
      return resumeError;
    }

    return "";
  };

  // --------------------------------------------------
  // Submit
  // --------------------------------------------------

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (loading) return;

    setError("");

    const validationError = validateForm();

    if (validationError) {
      setError(validationError);
      return;
    }

    try {
      const data = await createInterviewReport(formData);

      const interviewId = data?.interviewReport?._id;

      if (!interviewId) {
        throw new Error(
          "Interview report was generated but interview ID was not returned."
        );
      }

      navigate(`/interview/${interviewId}`);
    } catch (error) {
      console.error(
        "Interview report generation failed:",
        error
      );

      setError(
        error?.response?.data?.message ||
          error?.message ||
          "Failed to generate interview report. Please try again."
      );
    }
  };

  // --------------------------------------------------
  // Format Date
  // --------------------------------------------------

  const formatDate = (date) => {
    if (!date) return "Date unavailable";

    const parsedDate = new Date(date);

    if (Number.isNaN(parsedDate.getTime())) {
      return "Date unavailable";
    }

    return parsedDate.toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };


  const handleLogout = async () => {
  if (loading) return;

  try {
    await logOut();

    navigate("/login");
  } catch (error) {
    console.error("Logout failed:", error);
    setError("Failed to logout. Please try again.");
  }
};

  // --------------------------------------------------
  // Render
  // --------------------------------------------------

  return (
    <main className="min-h-screen bg-[#09090b] text-white">
      {/* Background */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute left-1/2 top-[-180px] h-[400px] w-[700px] -translate-x-1/2 rounded-full bg-pink-600/10 blur-[120px]" />

        <div className="absolute bottom-[-200px] left-[-150px] h-[400px] w-[400px] rounded-full bg-purple-600/5 blur-[120px]" />
      </div>

      <div className="relative mx-auto flex min-h-screen w-full max-w-7xl flex-col px-5 py-8 sm:px-8 lg:px-12">

        {/* Header */}
        <header className="mb-10 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-pink-500 to-rose-600 shadow-lg shadow-pink-500/20">
              <svg
                className="h-5 w-5"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M12 3v18" />
                <path d="M3 12h18" />
              </svg>
            </div>

            <div>
              <h1 className="text-lg font-bold tracking-tight">
                Interview
                <span className="text-pink-500">AI</span>
              </h1>

              <p className="text-xs text-zinc-500">
                AI-powered interview preparation
              </p>
            </div>
          </div>

            {/* Logout */}
  <button
    type="button"
    onClick={handleLogout}
    disabled={loading}
    className="inline-flex items-center gap-2 rounded-xl border border-white/[0.08] bg-white/[0.03] px-4 py-2.5 text-sm font-medium text-zinc-300 transition-all hover:border-red-500/30 hover:bg-red-500/10 hover:text-red-400 disabled:cursor-not-allowed disabled:opacity-50"
  >
    <svg
      className="h-4 w-4"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
      <path d="m16 17 5-5-5-5" />
      <path d="M21 12H9" />
    </svg>

    Logout
  </button>
        </header>

        {/* Main */}
        <section className="flex-1">
          <div className="mx-auto w-full max-w-6xl">

            {/* Heading */}
            <div className="mb-8 max-w-2xl">
              <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-pink-500/20 bg-pink-500/5 px-3 py-1.5 text-xs font-medium text-pink-400">
                <span className="h-1.5 w-1.5 rounded-full bg-pink-500" />
                AI Interview Analyzer
              </div>

              <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
                Prepare smarter for your{" "}
                <span className="bg-gradient-to-r from-pink-400 to-rose-500 bg-clip-text text-transparent">
                  next interview.
                </span>
              </h2>

              <p className="mt-3 text-sm leading-6 text-zinc-500 sm:text-base">
                Upload your resume and provide the job details to
                generate a personalized interview report.
              </p>
            </div>

            {/* Form Card */}
            <form
              onSubmit={handleSubmit}
              noValidate
              className="rounded-3xl border border-white/[0.08] bg-white/[0.025] p-4 shadow-2xl shadow-black/20 backdrop-blur-xl sm:p-6 lg:p-7"
            >
              <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">

                {/* LEFT */}
                <div className="flex flex-col">
                  <label
                    htmlFor="jobDescription"
                    className="mb-2.5 text-sm font-semibold text-zinc-200"
                  >
                    Job Description
                  </label>

                  <div className="relative flex flex-1">
                    <textarea
                      id="jobDescription"
                      name="jobDescription"
                      value={formData.jobDescription}
                      onChange={handleChange}
                      placeholder="Paste the job description here..."
                      disabled={loading}
                      className="min-h-[360px] w-full resize-none rounded-2xl border border-white/[0.08] bg-[#111318] px-4 py-4 text-sm leading-6 text-zinc-200 outline-none transition-all placeholder:text-zinc-600 hover:border-white/[0.12] focus:border-pink-500/50 focus:bg-[#13151b] focus:ring-4 focus:ring-pink-500/5 disabled:cursor-not-allowed disabled:opacity-60"
                    />

                    <div className="pointer-events-none absolute bottom-3 right-3 rounded-md bg-white/[0.03] px-2 py-1 text-[10px] text-zinc-600">
                      Job requirements
                    </div>
                  </div>
                </div>

                {/* RIGHT */}
                <div className="flex flex-col gap-6">

                  {/* Resume */}
                  <div>
                    <div className="mb-2.5 flex items-center justify-between">
                      <label
                        htmlFor="resume"
                        className="text-sm font-semibold text-zinc-200"
                      >
                        Resume
                      </label>

                      <span className="text-[11px] text-zinc-600">
                        PDF · Max 5MB
                      </span>
                    </div>

                    <input
                      ref={fileInputRef}
                      id="resume"
                      type="file"
                      accept=".pdf,application/pdf"
                      onChange={handleFileInput}
                      disabled={loading}
                      className="hidden"
                    />

                    <div
                      role="button"
                      tabIndex={loading ? -1 : 0}
                      onClick={() =>
                        !loading &&
                        fileInputRef.current?.click()
                      }
                      onKeyDown={(e) => {
                        if (
                          !loading &&
                          (e.key === "Enter" || e.key === " ")
                        ) {
                          e.preventDefault();
                          fileInputRef.current?.click();
                        }
                      }}
                      onDragOver={handleDragOver}
                      onDragLeave={handleDragLeave}
                      onDrop={handleDrop}
                      className={`group rounded-2xl border border-dashed p-5 transition-all ${
                        loading
                          ? "cursor-not-allowed border-white/[0.06] opacity-60"
                          : isDragging
                            ? "border-pink-500 bg-pink-500/10"
                            : "cursor-pointer border-white/[0.12] bg-[#111318] hover:border-pink-500/40 hover:bg-[#13151b]"
                      }`}
                    >
                      {formData.resumeFile ? (
                        <div className="flex items-center gap-4">

                          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-pink-500/10 text-pink-500">
                            <svg
                              className="h-6 w-6"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="1.8"
                            >
                              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                              <path d="M14 2v6h6" />
                              <path d="M8 13h8" />
                              <path d="M8 17h5" />
                            </svg>
                          </div>

                          <div className="min-w-0 flex-1">
                            <p className="truncate text-sm font-medium text-zinc-200">
                              {formData.resumeFile.name}
                            </p>

                            <p className="mt-1 text-xs text-zinc-500">
                              {(
                                formData.resumeFile.size /
                                1024 /
                                1024
                              ).toFixed(2)}{" "}
                              MB
                            </p>
                          </div>

                          <button
                            type="button"
                            onClick={handleRemoveResume}
                            disabled={loading}
                            aria-label="Remove resume"
                            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-white/[0.04] text-zinc-500 transition-colors hover:bg-red-500/10 hover:text-red-400"
                          >
                            <svg
                              className="h-4 w-4"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                            >
                              <path d="M18 6 6 18" />
                              <path d="m6 6 12 12" />
                            </svg>
                          </button>
                        </div>
                      ) : (
                        <div className="flex items-center gap-4">

                          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-white/[0.05] text-zinc-400 transition-colors group-hover:bg-pink-500/10 group-hover:text-pink-400">
                            <svg
                              className="h-6 w-6"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="1.8"
                            >
                              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                              <path d="m17 8-5-5-5 5" />
                              <path d="M12 3v12" />
                            </svg>
                          </div>

                          <div>
                            <p className="text-sm font-medium text-zinc-300">
                              Upload your resume
                            </p>

                            <p className="mt-1 text-xs text-zinc-600">
                              Click to browse or drag & drop
                            </p>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Self Description */}
                  <div className="flex flex-1 flex-col">
                    <label
                      htmlFor="selfDescription"
                      className="mb-2.5 text-sm font-semibold text-zinc-200"
                    >
                      Self Description
                    </label>

                    <textarea
                      id="selfDescription"
                      name="selfDescription"
                      value={formData.selfDescription}
                      onChange={handleChange}
                      placeholder="Describe yourself in a few sentences..."
                      disabled={loading}
                      className="min-h-[220px] w-full flex-1 resize-none rounded-2xl border border-white/[0.08] bg-[#111318] px-4 py-4 text-sm leading-6 text-zinc-200 outline-none transition-all placeholder:text-zinc-600 hover:border-white/[0.12] focus:border-pink-500/50 focus:bg-[#13151b] focus:ring-4 focus:ring-pink-500/5 disabled:cursor-not-allowed disabled:opacity-60"
                    />
                  </div>
                </div>
              </div>

              {/* Error */}
              {error && (
                <div
                  role="alert"
                  className="mt-6 flex items-start gap-3 rounded-xl border border-red-500/20 bg-red-500/5 px-4 py-3"
                >
                  <svg
                    className="mt-0.5 h-4 w-4 shrink-0 text-red-400"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <circle cx="12" cy="12" r="9" />
                    <path d="M12 8v4" />
                    <path d="M12 16h.01" />
                  </svg>

                  <p className="text-xs leading-5 text-red-400">
                    {error}
                  </p>
                </div>
              )}

              {/* Bottom */}
              <div className="mt-6 flex flex-col gap-4 border-t border-white/[0.06] pt-6 sm:flex-row sm:items-center sm:justify-between">

                <p className="text-xs leading-5 text-zinc-600">
                  Your information is used to generate your
                  personalized interview report.
                </p>

                <button
                  type="submit"
                  disabled={loading}
                  className="group inline-flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-pink-600 to-rose-600 px-6 py-3.5 text-sm font-semibold text-white shadow-lg shadow-pink-600/20 transition-all duration-200 hover:-translate-y-0.5 hover:from-pink-500 hover:to-rose-500 hover:shadow-xl hover:shadow-pink-600/25 active:translate-y-0 disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:translate-y-0 sm:w-auto"
                >
                  {loading ? (
                    <>
                      <svg
                        className="h-4 w-4 animate-spin"
                        viewBox="0 0 24 24"
                        fill="none"
                      >
                        <circle
                          cx="12"
                          cy="12"
                          r="9"
                          stroke="currentColor"
                          strokeWidth="2"
                          className="opacity-25"
                        />

                        <path
                          d="M21 12a9 9 0 0 0-9-9"
                          stroke="currentColor"
                          strokeWidth="2"
                        />
                      </svg>

                      Generating...
                    </>
                  ) : (
                    <>
                      Generate Interview Report

                      <svg
                        className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                      >
                        <path d="M5 12h14" />
                        <path d="m13 6 6 6-6 6" />
                      </svg>
                    </>
                  )}
                </button>
              </div>
            </form>

            {/* --------------------------------------------- */}
            {/* Recent Reports */}
            {/* --------------------------------------------- */}

            <section className="mt-12">

              <div className="mb-5 flex items-end justify-between gap-4">
                <div>
                  <h3 className="text-lg font-semibold text-zinc-100">
                    Recent Reports
                  </h3>

                  <p className="mt-1 text-xs text-zinc-500">
                    Review your previously generated interview reports.
                  </p>
                </div>

                {reports.length > 0 && (
                  <span className="shrink-0 rounded-full border border-white/[0.08] bg-white/[0.03] px-3 py-1 text-xs text-zinc-500">
                    {reports.length}{" "}
                    {reports.length === 1 ? "report" : "reports"}
                  </span>
                )}
              </div>

              {reports.length > 0 ? (
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
                  {reports.map((report) => (
                    <button
                      key={report._id}
                      type="button"
                      onClick={() =>
                        navigate(`/interview/${report._id}`)
                      }
                      className="group rounded-2xl border border-white/[0.08] bg-white/[0.025] p-4 text-left transition-all duration-200 hover:-translate-y-0.5 hover:border-pink-500/30 hover:bg-white/[0.04]"
                    >
                      <div className="flex items-start justify-between gap-4">

                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-pink-500/10 text-pink-400">
                          <svg
                            className="h-5 w-5"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="1.8"
                          >
                            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                            <path d="M14 2v6h6" />
                            <path d="M8 13h8" />
                            <path d="M8 17h5" />
                          </svg>
                        </div>

                        <svg
                          className="h-4 w-4 text-zinc-600 transition-all group-hover:translate-x-0.5 group-hover:text-pink-400"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                        >
                          <path d="M5 12h14" />
                          <path d="m13 6 6 6-6 6" />
                        </svg>
                      </div>

                   <div className="mt-4 min-w-0">
  <h4 className="truncate text-sm font-semibold text-zinc-200">
    {report.title || "Interview Report"}
  </h4>

  <p className="mt-1 text-xs text-zinc-500">
    {formatDate(report.createdAt)}
  </p>
</div>
                    </button>
                  ))}
                </div>
              ) : (
                <div className="rounded-2xl border border-dashed border-white/[0.08] bg-white/[0.02] px-6 py-10 text-center">

                  <div className="mx-auto flex h-11 w-11 items-center justify-center rounded-xl bg-white/[0.04] text-zinc-600">
                    <svg
                      className="h-5 w-5"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.8"
                    >
                      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                      <path d="M14 2v6h6" />
                    </svg>
                  </div>

                  <h4 className="mt-4 text-sm font-medium text-zinc-300">
                    No interview reports yet
                  </h4>

                  <p className="mt-1 text-xs text-zinc-600">
                    Generate your first interview report to see it here.
                  </p>
                </div>
              )}
            </section>
          </div>
        </section>

        {/* Footer */}
        <footer className="pt-12 text-center">
          <p className="text-xs text-zinc-700">
            Built for better interview preparation
          </p>
        </footer>
      </div>
    </main>
  );
}

export default Home;