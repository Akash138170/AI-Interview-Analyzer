import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import { useInterview } from "../hooks/useInterview";

import {
  ArrowLeft,
  BriefcaseBusiness,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  FileText,
  Download,
  Lightbulb,
  ListChecks,
  MessageSquareText,
  Target,
  TrendingUp,
  UserRound,
} from "lucide-react";

function Interview() {
  const { interviewId } = useParams();
  const navigate = useNavigate();

  const {
    loading,
    report,
     resumeLoading,
    getReportById,
    getResumePdf,
  } = useInterview();

  const [activeSection, setActiveSection] = useState("overview");
  const [openTechnical, setOpenTechnical] = useState(null);
  const [openBehavioral, setOpenBehavioral] = useState(null);

  useEffect(() => {
    if (!interviewId) return;

    getReportById(interviewId);
  }, [interviewId]);

  const handleBack = () => {
    navigate(-1);
  };

  const handleDownloadResume = async () => {
  if (!interviewId) return;

  await getResumePdf(interviewId);
};

  const sections = [
    {
      id: "overview",
      label: "Overview",
      icon: Target,
    },
    {
      id: "technical",
      label: "Technical",
      icon: BriefcaseBusiness,
    },
    {
      id: "behavioral",
      label: "Behavioral",
      icon: MessageSquareText,
    },
    {
      id: "skills",
      label: "Skill Gaps",
      icon: TrendingUp,
    },
    {
      id: "preparation",
      label: "Preparation",
      icon: ListChecks,
    },
  ];

  const getSeverityStyle = (severity) => {
    switch (severity) {
      case "high":
        return {
          badge: "bg-red-50 text-red-700 border-red-200",
          dot: "bg-red-500",
        };

      case "medium":
      case "meduim":
        return {
          badge: "bg-amber-50 text-amber-700 border-amber-200",
          dot: "bg-amber-500",
        };

      case "low":
        return {
          badge: "bg-emerald-50 text-emerald-700 border-emerald-200",
          dot: "bg-emerald-500",
        };

      default:
        return {
          badge: "bg-slate-50 text-slate-700 border-slate-200",
          dot: "bg-slate-500",
        };
    }
  };

  const renderQuestionCard = (
    item,
    index,
    isOpen,
    setOpen,
    type = "technical"
  ) => {
    return (
      <div
        className={`group overflow-hidden rounded-2xl border bg-white transition-all duration-300 ${
          isOpen
            ? "border-slate-300 shadow-lg shadow-slate-200/50"
            : "border-slate-200 hover:border-slate-300 hover:shadow-md"
        }`}
      >
        <button
          type="button"
          onClick={() => setOpen(isOpen ? null : index)}
          className="flex w-full items-center justify-between gap-5 p-5 text-left"
        >
          <div className="flex min-w-0 items-start gap-4">
            <div
              className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${
                type === "technical"
                  ? "bg-blue-50 text-blue-600"
                  : "bg-violet-50 text-violet-600"
              }`}
            >
              {type === "technical" ? (
                <BriefcaseBusiness size={19} />
              ) : (
                <MessageSquareText size={19} />
              )}
            </div>

            <div>
              <span className="mb-1 block text-xs font-semibold uppercase tracking-wider text-slate-400">
                Question {index + 1}
              </span>

              <h3 className="font-semibold leading-6 text-slate-900">
                {item.question}
              </h3>
            </div>
          </div>

          <div className="shrink-0 text-slate-400">
            {isOpen ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
          </div>
        </button>

        {isOpen && (
          <div className="border-t border-slate-100 bg-slate-50/70 p-5">
            <div className="grid gap-5 md:grid-cols-2">
              <div className="rounded-xl border border-slate-200 bg-white p-4">
                <div className="mb-2 flex items-center gap-2">
                  <Lightbulb size={17} className="text-amber-500" />

                  <h4 className="text-sm font-bold text-slate-800">
                    Interviewer's Intention
                  </h4>
                </div>

                <p className="text-sm leading-6 text-slate-600">
                  {item.intention}
                </p>
              </div>

              <div className="rounded-xl border border-slate-200 bg-white p-4">
                <div className="mb-2 flex items-center gap-2">
                  <CheckCircle2 size={17} className="text-emerald-500" />

                  <h4 className="text-sm font-bold text-slate-800">
                    How to Answer
                  </h4>
                </div>

                <p className="text-sm leading-6 text-slate-600">
                  {item.answer}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  };

  // Loading State
  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#f8fafc]">
        <div className="text-center">
          <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-slate-200 border-t-slate-900" />

          <p className="mt-4 text-sm font-medium text-slate-600">
            Loading interview report...
          </p>
        </div>
      </div>
    );
  }

  // Empty State
  if (!report) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#f8fafc] px-4">
        <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-slate-100 text-slate-500">
            <FileText size={22} />
          </div>

          <h2 className="mt-4 text-xl font-bold text-slate-900">
            Interview report not found
          </h2>

          <p className="mt-2 text-sm leading-6 text-slate-500">
            The requested interview report could not be loaded.
          </p>

          <button
            type="button"
            onClick={handleBack}
            className="mt-5 rounded-xl bg-slate-900 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-800"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-900">
      {/* Top Header */}
      <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/90 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={handleBack}
              className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 text-slate-600 transition hover:bg-slate-50"
            >
              <ArrowLeft size={18} />
            </button>

            <div>
              <h1 className="text-sm font-bold text-slate-900 sm:text-base">
                Interview Report
              </h1>

              <p className="hidden text-xs text-slate-500 sm:block">
                AI-powered interview preparation
              </p>
            </div>
          </div>

         <div className="flex items-center gap-2">
<button
  type="button"
  onClick={handleDownloadResume}
  disabled={resumeLoading}
  className="inline-flex items-center gap-2 rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
>
  {resumeLoading ? (
    <>
      <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
      <span>Generating...</span>
    </>
  ) : (
    <>
      <Download size={17} />
      <span>Download Resume</span>
    </>
  )}
</button>

  <div className="hidden items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1.5 sm:flex">
    <span className="h-2 w-2 rounded-full bg-emerald-500" />

    <span className="text-xs font-semibold text-emerald-700">
      Report Ready
    </span>
  </div>
</div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
        {/* Hero */}
        <section className="mb-6 overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
          <div className="relative p-6 sm:p-8">
            <div className="absolute right-0 top-0 h-40 w-40 rounded-full bg-blue-100/50 blur-3xl" />

            <div className="relative flex flex-col justify-between gap-7 lg:flex-row lg:items-center">
              <div className="max-w-3xl">
                <div className="mb-4 flex items-center gap-2">
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-900 text-white">
                    <FileText size={18} />
                  </div>

                  <span className="text-sm font-semibold text-slate-500">
                    Interview Analysis
                  </span>
                </div>

                <h2 className="text-2xl font-bold tracking-tight text-slate-950 sm:text-3xl">
                  Your interview readiness report
                </h2>

                <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
                  Review your job match, technical questions, behavioral
                  questions, skill gaps and preparation plan.
                </p>
              </div>

              {/* Match Score */}
              <div className="flex shrink-0 items-center gap-4 rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <div className="relative flex h-20 w-20 items-center justify-center">
                  <svg
                    className="h-20 w-20 -rotate-90"
                    viewBox="0 0 100 100"
                  >
                    <circle
                      cx="50"
                      cy="50"
                      r="42"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="8"
                      className="text-slate-200"
                    />

                    <circle
                      cx="50"
                      cy="50"
                      r="42"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="8"
                      strokeLinecap="round"
                      strokeDasharray={`${
                        (42 * 2 * Math.PI * report.matchScore) / 100
                      } ${42 * 2 * Math.PI}`}
                      className="text-blue-600"
                    />
                  </svg>

                  <span className="absolute text-lg font-bold text-slate-900">
                    {report.matchScore}%
                  </span>
                </div>

                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                    Match Score
                  </p>

                  <p className="mt-1 text-sm font-bold text-slate-800">
                    Strong Match
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Navigation */}
        <div className="mb-6 overflow-x-auto">
          <nav className="flex min-w-max gap-2 rounded-2xl border border-slate-200 bg-white p-2 shadow-sm">
            {sections.map((section) => {
              const Icon = section.icon;
              const active = activeSection === section.id;

              return (
                <button
                  key={section.id}
                  type="button"
                  onClick={() => setActiveSection(section.id)}
                  className={`flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold transition-all ${
                    active
                      ? "bg-slate-900 text-white shadow-sm"
                      : "text-slate-500 hover:bg-slate-50 hover:text-slate-900"
                  }`}
                >
                  <Icon size={17} />
                  {section.label}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Content */}
        {activeSection === "overview" && (
          <div className="grid gap-6 lg:grid-cols-2">
            {/* Job Description */}
            <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <div className="mb-5 flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                  <BriefcaseBusiness size={19} />
                </div>

                <div>
                  <h3 className="font-bold text-slate-900">
                    Job Description
                  </h3>
                </div>
              </div>

              <p className="text-sm leading-7 text-slate-600">
                {report.jobDescription}
              </p>
            </section>

            {/* Resume */}
            <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <div className="mb-5 flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-50 text-violet-600">
                  <FileText size={19} />
                </div>

                <div>
                  <h3 className="font-bold text-slate-900">Resume</h3>
                </div>
              </div>

              <p className="text-sm leading-7 text-slate-600">
                {report.resume}
              </p>
            </section>

            {/* Self Description */}
            <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm lg:col-span-2">
              <div className="mb-5 flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
                  <UserRound size={19} />
                </div>

                <div>
                  <h3 className="font-bold text-slate-900">
                    Self Description
                  </h3>
                </div>
              </div>

              <p className="max-w-4xl text-sm leading-7 text-slate-600">
                {report.selfDescription}
              </p>
            </section>
          </div>
        )}

        {/* Technical */}
        {activeSection === "technical" && (
          <section>
            <div className="mb-5">
              <p className="text-xs font-bold uppercase tracking-wider text-blue-600">
                Technical Questions
              </p>

              <h2 className="mt-1 text-2xl font-bold text-slate-950">
                Prepare for technical rounds
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                Click a question to understand the interviewer's intention and
                how you should approach the answer.
              </p>
            </div>

            <div className="space-y-4">
              {report.technicalQuestions?.map((item, index) =>
                renderQuestionCard(
                  item,
                  index,
                  openTechnical === index,
                  setOpenTechnical,
                  "technical"
                )
              )}
            </div>
          </section>
        )}

        {/* Behavioral */}
        {activeSection === "behavioral" && (
          <section>
            <div className="mb-5">
              <p className="text-xs font-bold uppercase tracking-wider text-violet-600">
                Behavioral Questions
              </p>

              <h2 className="mt-1 text-2xl font-bold text-slate-950">
                Prepare your behavioral answers
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                Understand what the interviewer is trying to evaluate.
              </p>
            </div>

            <div className="space-y-4">
              {report.behavioralQuestions?.map((item, index) =>
                renderQuestionCard(
                  item,
                  index,
                  openBehavioral === index,
                  setOpenBehavioral,
                  "behavioral"
                )
              )}
            </div>
          </section>
        )}

        {/* Skills */}
        {activeSection === "skills" && (
          <section>
            <div className="mb-5">
              <p className="text-xs font-bold uppercase tracking-wider text-amber-600">
                Skill Gaps
              </p>

              <h2 className="mt-1 text-2xl font-bold text-slate-950">
                Areas that need attention
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                Focus your preparation based on the severity of each skill gap.
              </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {report.skillGaps?.map((item, index) => {
                const severity = getSeverityStyle(item.severity);

                return (
                  <div
                    key={`${item.skill}-${index}`}
                    className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
                  >
                    <div className="mb-5 flex items-start justify-between gap-3">
                      <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-slate-100 text-slate-700">
                        <TrendingUp size={19} />
                      </div>

                      <span
                        className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-bold capitalize ${severity.badge}`}
                      >
                        <span
                          className={`h-1.5 w-1.5 rounded-full ${severity.dot}`}
                        />

                        {item.severity === "meduim"
                          ? "Medium"
                          : item.severity}
                      </span>
                    </div>

                    <h3 className="text-lg font-bold text-slate-900">
                      {item.skill}
                    </h3>

                    <p className="mt-2 text-sm leading-6 text-slate-500">
                      Focus on improving this skill before your interview.
                    </p>
                  </div>
                );
              })}
            </div>
          </section>
        )}

        {/* Preparation */}
        {activeSection === "preparation" && (
          <section>
            <div className="mb-6">
              <p className="text-xs font-bold uppercase tracking-wider text-emerald-600">
                Preparation Plan
              </p>

              <h2 className="mt-1 text-2xl font-bold text-slate-950">
                Your interview preparation roadmap
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                Follow the plan day by day to improve your interview readiness.
              </p>
            </div>

            <div className="relative space-y-5">
              <div className="absolute bottom-8 left-5 top-8 hidden w-px bg-slate-200 sm:block" />

              {report.preparationPlan?.map((item, index) => (
                <div
                  key={`${item.day}-${index}`}
                  className="relative flex gap-4 sm:gap-5"
                >
                  <div className="relative z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded-full border-4 border-[#f8fafc] bg-slate-900 text-xs font-bold text-white shadow-sm">
                    {item.day}
                  </div>

                  <div className="flex-1 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:shadow-md">
                    <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-start">
                      <div>
                        <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
                          Day {item.day}
                        </p>

                        <h3 className="mt-1 text-lg font-bold text-slate-900">
                          {item.focus}
                        </h3>
                      </div>

                      <span className="w-fit rounded-full bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-700">
                        Preparation
                      </span>
                    </div>

                    <div className="mt-5 space-y-3">
                      {item.tasks?.map((task, taskIndex) => (
                        <div
                          key={`${item.day}-${taskIndex}`}
                          className="flex items-start gap-3"
                        >
                          <CheckCircle2
                            size={18}
                            className="mt-0.5 shrink-0 text-emerald-500"
                          />

                          <p className="text-sm leading-6 text-slate-600">
                            {task}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}
      </main>
    </div>
  );
}

export default Interview;