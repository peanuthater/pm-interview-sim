"use client";

import { useState, useCallback } from "react";
import { Question, Round, MistakeEntry, SessionState, RoundType } from "@/lib/types";

// ─── Constants ────────────────────────────────────────────────────────────────

const ROUND_CONFIG: Round[] = [
  { type: "HR", label: "HR Screening", questionCount: 5, unlocked: true, completed: false },
  { type: "Behavioral", label: "Behavioral", questionCount: 8, unlocked: false, completed: false },
  { type: "Case", label: "Case Study", questionCount: 3, unlocked: false, completed: false },
];

const ROUND_DESCRIPTIONS: Record<RoundType, string> = {
  HR: "5 questions · Motivation, culture fit, background",
  Behavioral: "8 questions · STAR-method scenarios",
  Case: "3 questions · Product design & analytics cases",
};

const ROUND_ICONS: Record<RoundType, string> = {
  HR: "👤",
  Behavioral: "🎯",
  Case: "📊",
};

// ─── Score Ring ───────────────────────────────────────────────────────────────

function ScoreRing({ score }: { score: number }) {
  const radius = 50;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;
  const color = score >= 76 ? "#16a34a" : score >= 60 ? "#d97706" : "#dc2626";

  return (
    <svg width="120" height="120" viewBox="0 0 120 120">
      <circle cx="60" cy="60" r={radius} fill="none" stroke="#e2e8f0" strokeWidth="10" />
      <circle
        cx="60" cy="60" r={radius}
        fill="none" stroke={color} strokeWidth="10"
        strokeDasharray={circumference}
        strokeDashoffset={offset}
        strokeLinecap="round"
        transform="rotate(-90 60 60)"
        style={{ transition: "stroke-dashoffset 1s ease-out" }}
      />
      <text x="60" y="55" textAnchor="middle" fontSize="22" fontWeight="700" fill={color}>{score}</text>
      <text x="60" y="72" textAnchor="middle" fontSize="11" fill="#64748b">/100</text>
    </svg>
  );
}

// ─── Setup Screen ─────────────────────────────────────────────────────────────

function SetupScreen({ onStart }: { onStart: (name: string, role: string, company: string) => void }) {
  const [name, setName] = useState("");
  const [role, setRole] = useState("");
  const [company, setCompany] = useState("");

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-slate-50">
      <div className="w-full max-w-md">
        <div className="text-center mb-10">
          <div className="text-5xl mb-4">🎯</div>
          <h1 className="text-3xl font-bold text-slate-900 mb-2">PM Interview Simulator</h1>
          <p className="text-slate-500 text-sm">AI-powered interview practice with real-time scoring</p>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-8 space-y-5">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">Your Name</label>
            <input
              className="w-full border border-slate-200 rounded-lg px-4 py-2.5 text-slate-900 text-sm focus:outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-100 transition"
              placeholder="e.g. Alex Chen"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">Target Role</label>
            <input
              className="w-full border border-slate-200 rounded-lg px-4 py-2.5 text-slate-900 text-sm focus:outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-100 transition"
              placeholder="e.g. Senior Product Manager"
              value={role}
              onChange={(e) => setRole(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">Target Company</label>
            <input
              className="w-full border border-slate-200 rounded-lg px-4 py-2.5 text-slate-900 text-sm focus:outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-100 transition"
              placeholder="e.g. Stripe"
              value={company}
              onChange={(e) => setCompany(e.target.value)}
            />
          </div>

          <button
            disabled={!name.trim() || !role.trim() || !company.trim()}
            onClick={() => onStart(name.trim(), role.trim(), company.trim())}
            className="w-full bg-amber-600 hover:bg-amber-700 disabled:bg-slate-200 disabled:text-slate-400 text-white font-semibold py-3 rounded-lg transition text-sm mt-2"
          >
            Start Interview
          </button>
        </div>

        <div className="mt-6 grid grid-cols-3 gap-3 text-center">
          {ROUND_CONFIG.map((r) => (
            <div key={r.type} className="bg-white rounded-xl border border-slate-200 p-3">
              <div className="text-2xl mb-1">{ROUND_ICONS[r.type]}</div>
              <div className="text-xs font-semibold text-slate-700">{r.label}</div>
              <div className="text-xs text-slate-400">{r.questionCount}Q</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── Loading Screen ───────────────────────────────────────────────────────────

function LoadingScreen({ name, role, company }: { name: string; role: string; company: string }) {
  const [step, setStep] = useState(0);
  const steps = [
    "Searching for latest PM interview trends…",
    `Researching ${company}'s hiring criteria…`,
    "Generating HR screening questions…",
    "Crafting behavioral scenarios…",
    "Building case study challenges…",
    "Finalizing your interview…",
  ];

  // Advance steps visually (actual generation happens in parent)
  if (typeof window !== "undefined") {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    // We use a simple interval here to simulate progress
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-slate-50">
      <div className="text-center max-w-sm">
        <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-amber-100 flex items-center justify-center">
          <div className="w-8 h-8 border-4 border-amber-600 border-t-transparent rounded-full animate-spin" />
        </div>
        <h2 className="text-xl font-bold text-slate-900 mb-1">Preparing your interview</h2>
        <p className="text-slate-500 text-sm mb-8">{name} · {role} at {company}</p>
        <div className="space-y-2 text-left">
          {steps.map((s, i) => (
            <div
              key={i}
              className={`flex items-center gap-3 text-sm px-3 py-2 rounded-lg transition-all duration-500 ${
                i === 0 ? "text-amber-700 bg-amber-50 font-medium" : "text-slate-400"
              }`}
            >
              <span className="text-base">{i === 0 ? "⟳" : "○"}</span>
              {s}
            </div>
          ))}
        </div>
        <p className="text-xs text-slate-400 mt-6">Using web search to tailor questions for you…</p>
      </div>
    </div>
  );
}

// ─── Round Hub ────────────────────────────────────────────────────────────────

function RoundHub({
  state,
  onSelectRound,
  onViewResults,
  onOpenNotebook,
}: {
  state: SessionState;
  onSelectRound: (round: RoundType) => void;
  onViewResults: () => void;
  onOpenNotebook: () => void;
}) {
  const totalQ = state.questions.length;
  const passedQ = state.questions.filter((q) => q.status === "pass" || q.status === "low_pass").length;
  const notebookCount = state.mistakeNotebook.length;

  return (
    <div className="min-h-screen p-6 max-w-2xl mx-auto bg-slate-50">
      <div className="flex items-center justify-between mb-8 pt-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Interview Dashboard</h1>
          <p className="text-slate-500 text-sm mt-0.5">
            {state.candidateName} · {state.targetRole} at {state.targetCompany}
          </p>
        </div>
        <button
          onClick={onOpenNotebook}
          className="relative flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-amber-700 bg-white border border-slate-200 hover:border-amber-300 px-4 py-2 rounded-lg transition"
        >
          📓 Notebook
          {notebookCount > 0 && (
            <span className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-amber-600 text-white text-xs rounded-full flex items-center justify-center font-bold">
              {notebookCount}
            </span>
          )}
        </button>
      </div>

      {/* Progress */}
      <div className="bg-white rounded-xl border border-slate-200 p-5 mb-6 shadow-sm">
        <div className="flex justify-between text-sm text-slate-600 mb-2">
          <span>Overall Progress</span>
          <span className="font-semibold">{passedQ}/{totalQ} cleared</span>
        </div>
        <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
          <div
            className="h-full bg-amber-500 rounded-full transition-all duration-500"
            style={{ width: totalQ > 0 ? `${(passedQ / totalQ) * 100}%` : "0%" }}
          />
        </div>
        <div className="flex gap-4 mt-3 text-xs text-slate-500">
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-green-500 inline-block" />
            Pass ({state.questions.filter((q) => q.status === "pass").length})
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-amber-500 inline-block" />
            Low Pass ({state.questions.filter((q) => q.status === "low_pass").length})
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-red-400 inline-block" />
            Fail ({state.questions.filter((q) => q.status === "fail").length})
          </span>
        </div>
      </div>

      {/* Round cards */}
      <div className="space-y-3 mb-6">
        {state.rounds.map((round) => {
          const roundQs = state.questions.filter((q) => q.round === round.type);
          const roundPassed = roundQs.filter((q) => q.status === "pass" || q.status === "low_pass").length;
          const roundFailed = roundQs.filter((q) => q.status === "fail").length;
          const roundPending = roundQs.filter((q) => q.status === "pending").length;
          const isActive = !round.completed && round.unlocked;

          return (
            <div
              key={round.type}
              onClick={() => isActive && onSelectRound(round.type)}
              className={`bg-white rounded-xl border p-5 flex items-center gap-4 transition-all ${
                isActive
                  ? "border-amber-300 shadow-sm cursor-pointer hover:shadow-md hover:-translate-y-0.5"
                  : round.completed
                  ? "border-green-200 bg-green-50"
                  : "border-slate-200 opacity-60 cursor-not-allowed"
              }`}
            >
              <div className="text-3xl">{ROUND_ICONS[round.type]}</div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-0.5 flex-wrap">
                  <span className="font-semibold text-slate-900">{round.label}</span>
                  {round.completed && (
                    <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full font-medium">Cleared</span>
                  )}
                  {!round.unlocked && (
                    <span className="text-xs bg-slate-100 text-slate-500 px-2 py-0.5 rounded-full">🔒 Locked</span>
                  )}
                  {isActive && (
                    <span className="text-xs bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full font-medium">Active</span>
                  )}
                </div>
                <div className="text-xs text-slate-500">{ROUND_DESCRIPTIONS[round.type]}</div>
                {round.unlocked && roundQs.length > 0 && (
                  <div className="flex gap-3 mt-2 text-xs">
                    {roundPassed > 0 && <span className="text-green-600">✓ {roundPassed} passed</span>}
                    {roundFailed > 0 && <span className="text-red-500">✗ {roundFailed} failed</span>}
                    {roundPending > 0 && <span className="text-slate-400">{roundPending} pending</span>}
                  </div>
                )}
              </div>
              {isActive && <div className="text-amber-600 text-lg">→</div>}
            </div>
          );
        })}
      </div>

      {state.allRoundsComplete && (
        <button
          onClick={onViewResults}
          className="w-full bg-amber-600 hover:bg-amber-700 text-white font-semibold py-3 rounded-xl transition text-sm"
        >
          🏆 View Final Results
        </button>
      )}
    </div>
  );
}

// ─── Question Screen ──────────────────────────────────────────────────────────

interface ScoredResult {
  score: number;
  status: string;
  verdict: string;
  strengths: string[];
  improvements: string[];
  model_answer_snippet: string;
  feedback: string;
}

function QuestionScreen({
  question,
  roundLabel,
  questionIndex,
  totalInRound,
  state,
  onScoreSubmitted,
  onBack,
}: {
  question: Question;
  roundLabel: string;
  questionIndex: number;
  totalInRound: number;
  state: SessionState;
  onScoreSubmitted: (answer: string, scored: ScoredResult) => void;
  onBack: () => void;
}) {
  const [answer, setAnswer] = useState(question.userAnswer || "");
  const [isScoring, setIsScoring] = useState(false);
  const [scored, setScored] = useState<ScoredResult | null>(null);

  const handleSubmit = async () => {
    if (!answer.trim() || isScoring) return;
    setIsScoring(true);
    try {
      const res = await fetch("/api/score", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          questionText: question.text,
          userAnswer: answer.trim(),
          round: question.round,
          candidateName: state.candidateName,
          targetRole: state.targetRole,
        }),
      });
      const data: ScoredResult = await res.json();
      setScored(data);
      onScoreSubmitted(answer.trim(), data);
    } catch {
      alert("Scoring failed. Please try again.");
    } finally {
      setIsScoring(false);
    }
  };

  const scoreColor = scored
    ? scored.score >= 76 ? "text-green-600" : scored.score >= 60 ? "text-amber-600" : "text-red-600"
    : "";
  const scoreBg = scored
    ? scored.score >= 76 ? "bg-green-50 border-green-200" : scored.score >= 60 ? "bg-amber-50 border-amber-200" : "bg-red-50 border-red-200"
    : "";

  return (
    <div className="min-h-screen p-6 max-w-2xl mx-auto bg-slate-50">
      {/* Nav */}
      <div className="flex items-center gap-3 mb-6 pt-4">
        <button
          onClick={onBack}
          className="text-slate-400 hover:text-slate-700 transition text-sm flex items-center gap-1"
        >
          ← Back
        </button>
        <div className="flex-1" />
        <span className="text-xs text-slate-500 bg-white border border-slate-200 px-3 py-1 rounded-full">
          {roundLabel} · Q{questionIndex + 1}/{totalInRound}
        </span>
        {question.attempts > 0 && (
          <span className="text-xs text-amber-600 bg-amber-50 border border-amber-200 px-3 py-1 rounded-full">
            Retry #{question.attempts}
          </span>
        )}
      </div>

      {/* Question */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 mb-4">
        <div className="flex items-start gap-3">
          <span className="text-xl mt-0.5">{ROUND_ICONS[question.round]}</span>
          <p className="text-slate-900 text-base leading-relaxed font-medium">{question.text}</p>
        </div>
      </div>

      {/* Answer input */}
      {!scored && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 mb-4">
          <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-3">
            Your Answer
          </label>
          <textarea
            className="w-full min-h-[160px] border border-slate-200 rounded-xl p-4 text-sm text-slate-900 resize-y focus:outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-100 transition"
            placeholder="Type your answer here. Be specific — use STAR for behavioral, user → data → solution for cases…"
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
          />
          <div className="flex items-center justify-between mt-3">
            <span className="text-xs text-slate-400">
              {answer.trim().split(/\s+/).filter(Boolean).length} words
            </span>
            <button
              disabled={!answer.trim() || isScoring}
              onClick={handleSubmit}
              className="bg-amber-600 hover:bg-amber-700 disabled:bg-slate-200 disabled:text-slate-400 text-white font-semibold px-6 py-2 rounded-lg transition text-sm flex items-center gap-2"
            >
              {isScoring ? (
                <>
                  <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Scoring…
                </>
              ) : "Submit Answer"}
            </button>
          </div>
        </div>
      )}

      {/* Score result */}
      {scored && (
        <div className={`rounded-2xl border shadow-sm p-6 mb-4 ${scoreBg}`}>
          <div className="flex items-center gap-5 mb-5">
            <ScoreRing score={scored.score} />
            <div>
              <div className={`text-2xl font-bold ${scoreColor}`}>{scored.verdict}</div>
              <div className="text-sm text-slate-600 mt-1">
                {scored.score >= 76
                  ? "Excellent — move forward!"
                  : scored.score >= 60
                  ? "Low Pass — review feedback"
                  : "Below threshold — retry recommended"}
              </div>
            </div>
          </div>

          <div className="space-y-4 text-sm">
            <div>
              <div className="font-semibold text-slate-700 mb-1.5">💬 Feedback</div>
              <p className="text-slate-600 leading-relaxed">{scored.feedback}</p>
            </div>

            {scored.strengths.length > 0 && (
              <div>
                <div className="font-semibold text-green-700 mb-1.5">✓ Strengths</div>
                <ul className="space-y-1">
                  {scored.strengths.map((s, i) => (
                    <li key={i} className="text-slate-600 flex items-start gap-2">
                      <span className="text-green-500 mt-0.5">•</span>{s}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {scored.improvements.length > 0 && (
              <div>
                <div className="font-semibold text-red-600 mb-1.5">↑ Areas to Improve</div>
                <ul className="space-y-1">
                  {scored.improvements.map((s, i) => (
                    <li key={i} className="text-slate-600 flex items-start gap-2">
                      <span className="text-red-400 mt-0.5">•</span>{s}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {scored.model_answer_snippet && (
              <div className="bg-white/70 rounded-xl p-4 border border-slate-200">
                <div className="font-semibold text-slate-700 mb-1.5">💡 Strong Answer Would Include</div>
                <p className="text-slate-600 leading-relaxed italic">{scored.model_answer_snippet}</p>
              </div>
            )}
          </div>

          <div className="flex gap-3 mt-5">
            <button
              onClick={onBack}
              className="flex-1 border border-slate-300 hover:border-slate-400 text-slate-700 font-medium py-2.5 rounded-lg transition text-sm"
            >
              ← Dashboard
            </button>
            {scored.score < 60 && (
              <button
                onClick={() => { setScored(null); setAnswer(""); }}
                className="flex-1 bg-amber-600 hover:bg-amber-700 text-white font-semibold py-2.5 rounded-lg transition text-sm"
              >
                ↺ Retry
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Mistake Notebook Panel ───────────────────────────────────────────────────

function MistakeNotebook({
  entries,
  isOpen,
  onClose,
}: {
  entries: MistakeEntry[];
  isOpen: boolean;
  onClose: () => void;
}) {
  return (
    <>
      {isOpen && (
        <div className="fixed inset-0 bg-black/20 z-40" onClick={onClose} />
      )}
      <div
        className={`fixed top-0 right-0 h-full w-full max-w-sm bg-white shadow-2xl z-50 flex flex-col transition-transform duration-300 ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between p-5 border-b border-slate-200">
          <div>
            <h2 className="font-bold text-slate-900">📓 Mistake Notebook</h2>
            <p className="text-xs text-slate-500 mt-0.5">Failed &amp; low-pass questions this session</p>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-700 text-lg transition">✕</button>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {entries.length === 0 ? (
            <div className="text-center text-slate-400 py-12 text-sm">
              <div className="text-4xl mb-3">✨</div>
              No mistakes yet — keep it up!
            </div>
          ) : (
            entries.map((entry, i) => (
              <div
                key={i}
                className={`rounded-xl border p-4 text-sm ${
                  entry.status === "fail"
                    ? "border-red-200 bg-red-50"
                    : "border-amber-200 bg-amber-50"
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
                    entry.status === "fail"
                      ? "bg-red-100 text-red-700"
                      : "bg-amber-100 text-amber-700"
                  }`}>
                    {entry.status === "fail" ? "Fail" : "Low Pass"} · {entry.score}/100
                  </span>
                  <span className="text-xs text-slate-400">{entry.round}</span>
                </div>
                <p className="text-slate-800 font-medium mb-2 leading-snug">{entry.questionText}</p>
                <p className="text-slate-600 text-xs leading-relaxed">{entry.feedback}</p>
              </div>
            ))
          )}
        </div>
      </div>
    </>
  );
}

// ─── Result Screen ────────────────────────────────────────────────────────────

function ResultScreen({ state, onRestart }: { state: SessionState; onRestart: () => void }) {
  const totalQ = state.questions.length;
  const passed = state.questions.filter((q) => q.status === "pass").length;
  const lowPass = state.questions.filter((q) => q.status === "low_pass").length;
  const failed = state.questions.filter((q) => q.status === "fail").length;
  const scoredQs = state.questions.filter((q) => q.score !== undefined);
  const avgScore = scoredQs.length > 0
    ? Math.round(scoredQs.reduce((sum, q) => sum + (q.score || 0), 0) / scoredQs.length)
    : 0;

  const overallVerdict =
    avgScore >= 76 ? "Strong Hire" : avgScore >= 60 ? "Hire with Reservations" : "Not Ready Yet";
  const verdictColor =
    avgScore >= 76 ? "text-green-600" : avgScore >= 60 ? "text-amber-600" : "text-red-600";

  return (
    <div className="min-h-screen p-6 max-w-2xl mx-auto bg-slate-50">
      <div className="pt-8 text-center mb-8">
        <div className="text-5xl mb-3">🏆</div>
        <h1 className="text-3xl font-bold text-slate-900 mb-1">Interview Complete</h1>
        <p className="text-slate-500 text-sm">{state.candidateName} · {state.targetRole} at {state.targetCompany}</p>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 text-center mb-5">
        <div className="flex justify-center mb-3">
          <ScoreRing score={avgScore} />
        </div>
        <div className={`text-2xl font-bold ${verdictColor} mb-1`}>{overallVerdict}</div>
        <div className="text-sm text-slate-500">Average score across {totalQ} questions</div>
      </div>

      <div className="grid grid-cols-3 gap-3 mb-5">
        <div className="bg-green-50 border border-green-200 rounded-xl p-4 text-center">
          <div className="text-2xl font-bold text-green-600">{passed}</div>
          <div className="text-xs text-green-700 mt-0.5">Pass</div>
        </div>
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-center">
          <div className="text-2xl font-bold text-amber-600">{lowPass}</div>
          <div className="text-xs text-amber-700 mt-0.5">Low Pass</div>
        </div>
        <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-center">
          <div className="text-2xl font-bold text-red-500">{failed}</div>
          <div className="text-xs text-red-600 mt-0.5">Fail</div>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 mb-5">
        <h3 className="font-semibold text-slate-900 mb-4 text-sm">Round Breakdown</h3>
        <div className="space-y-4">
          {state.rounds.map((round) => {
            const qs = state.questions.filter((q) => q.round === round.type && q.score !== undefined);
            const avg = qs.length > 0
              ? Math.round(qs.reduce((s, q) => s + (q.score || 0), 0) / qs.length)
              : 0;
            return (
              <div key={round.type}>
                <div className="flex justify-between text-sm mb-1.5">
                  <span className="flex items-center gap-2">
                    {ROUND_ICONS[round.type]}
                    <span className="font-medium">{round.label}</span>
                  </span>
                  <span className={`font-bold ${avg >= 76 ? "text-green-600" : avg >= 60 ? "text-amber-600" : "text-red-500"}`}>
                    {avg}/100
                  </span>
                </div>
                <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full ${avg >= 76 ? "bg-green-500" : avg >= 60 ? "bg-amber-500" : "bg-red-400"}`}
                    style={{ width: `${avg}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {state.mistakeNotebook.length > 0 && (
        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-5 mb-5">
          <h3 className="font-semibold text-amber-800 mb-3 text-sm">
            📓 Areas to Review ({state.mistakeNotebook.length})
          </h3>
          <div className="space-y-2">
            {state.mistakeNotebook.slice(0, 3).map((entry, i) => (
              <div key={i} className="text-xs text-amber-700 leading-relaxed">
                <span className="font-medium">{entry.round}:</span>{" "}
                {entry.questionText.length > 80 ? entry.questionText.slice(0, 80) + "…" : entry.questionText}
              </div>
            ))}
            {state.mistakeNotebook.length > 3 && (
              <div className="text-xs text-amber-500">+{state.mistakeNotebook.length - 3} more in notebook</div>
            )}
          </div>
        </div>
      )}

      <button
        onClick={onRestart}
        className="w-full bg-amber-600 hover:bg-amber-700 text-white font-semibold py-3 rounded-xl transition text-sm"
      >
        Start New Interview
      </button>
    </div>
  );
}

// ─── Main App ─────────────────────────────────────────────────────────────────

function initState(): SessionState {
  return {
    candidateName: "",
    targetRole: "",
    targetCompany: "",
    rounds: ROUND_CONFIG.map((r) => ({ ...r })),
    questions: [],
    mistakeNotebook: [],
    currentRound: null,
    currentQuestionId: null,
    screen: "setup",
    allRoundsComplete: false,
  };
}

export default function App() {
  const [state, setState] = useState<SessionState>(initState);
  const [notebookOpen, setNotebookOpen] = useState(false);
  const [activeQuestionId, setActiveQuestionId] = useState<string | null>(null);

  // Generate all questions on session start
  const handleStart = useCallback(async (name: string, role: string, company: string) => {
    setState((s) => ({
      ...s,
      candidateName: name,
      targetRole: role,
      targetCompany: company,
      screen: "loading",
    }));

    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ candidateName: name, targetRole: role, targetCompany: company }),
      });

      if (!res.ok) throw new Error("Generation failed");
      const data = await res.json();

      setState((s) => ({ ...s, questions: data.questions, screen: "round_hub" }));
    } catch {
      alert("Failed to generate questions. Check your ANTHROPIC_API_KEY and try again.");
      setState((s) => ({ ...s, screen: "setup" }));
    }
  }, []);

  // Select a round → navigate to first pending/failed question
  const handleSelectRound = useCallback((round: RoundType) => {
    setState((s) => {
      const nextQ = s.questions.find(
        (q) => q.round === round && (q.status === "pending" || q.status === "fail")
      );
      if (!nextQ) return s;
      setActiveQuestionId(nextQ.id);
      return { ...s, currentRound: round, currentQuestionId: nextQ.id, screen: "question" };
    });
  }, []);

  // Called when QuestionScreen has fetched scoring and user clicked submit
  const handleScoreSubmitted = useCallback(
    (answer: string, scored: ScoredResult) => {
      if (!activeQuestionId) return;

      setState((s) => {
        const question = s.questions.find((q) => q.id === activeQuestionId);
        if (!question) return s;

        const updatedQuestions = s.questions.map((q) =>
          q.id !== activeQuestionId
            ? q
            : {
                ...q,
                userAnswer: answer,
                score: scored.score,
                status: scored.status as Question["status"],
                feedback: scored.feedback,
                attempts: q.attempts + 1,
              }
        );

        // Update notebook
        let updatedNotebook = s.mistakeNotebook.filter((e) => e.questionId !== activeQuestionId);
        if (scored.status === "fail" || scored.status === "low_pass") {
          updatedNotebook.push({
            questionId: activeQuestionId,
            questionText: question.text,
            round: question.round,
            userAnswer: answer,
            feedback: scored.feedback,
            score: scored.score,
            status: scored.status as "fail" | "low_pass",
          });
        }

        // Check round completion
        const updatedRounds = s.rounds.map((round) => {
          if (round.type !== question.round) return round;
          const roundQs = updatedQuestions.filter((q) => q.round === round.type);
          const allCleared = roundQs.every((q) => q.status === "pass" || q.status === "low_pass");
          return { ...round, completed: allCleared };
        });

        // Unlock next round
        const roundOrder: RoundType[] = ["HR", "Behavioral", "Case"];
        const updatedRoundsWithUnlock = updatedRounds.map((round, idx) => {
          if (idx === 0) return round;
          return { ...round, unlocked: round.unlocked || updatedRounds[idx - 1].completed };
        });

        const allRoundsComplete = updatedRoundsWithUnlock.every((r) => r.completed);

        return {
          ...s,
          questions: updatedQuestions,
          mistakeNotebook: updatedNotebook,
          rounds: updatedRoundsWithUnlock,
          allRoundsComplete,
        };
      });
    },
    [activeQuestionId]
  );

  const handleBack = useCallback(() => {
    setState((s) => ({ ...s, screen: "round_hub" }));
    setActiveQuestionId(null);
  }, []);

  const handleRestart = useCallback(() => {
    setState(initState());
    setNotebookOpen(false);
    setActiveQuestionId(null);
  }, []);

  const activeQuestion = state.questions.find((q) => q.id === activeQuestionId) ?? null;
  const roundQs = activeQuestion
    ? state.questions.filter((q) => q.round === activeQuestion.round)
    : [];
  const questionIndex = activeQuestion
    ? roundQs.findIndex((q) => q.id === activeQuestion.id)
    : 0;

  return (
    <>
      {state.screen === "setup" && <SetupScreen onStart={handleStart} />}

      {state.screen === "loading" && (
        <LoadingScreen
          name={state.candidateName}
          role={state.targetRole}
          company={state.targetCompany}
        />
      )}

      {state.screen === "round_hub" && (
        <RoundHub
          state={state}
          onSelectRound={handleSelectRound}
          onViewResults={() => setState((s) => ({ ...s, screen: "result" }))}
          onOpenNotebook={() => setNotebookOpen(true)}
        />
      )}

      {state.screen === "question" && activeQuestion && (
        <QuestionScreen
          question={activeQuestion}
          roundLabel={
            state.rounds.find((r) => r.type === activeQuestion.round)?.label ?? activeQuestion.round
          }
          questionIndex={questionIndex}
          totalInRound={roundQs.length}
          state={state}
          onScoreSubmitted={handleScoreSubmitted}
          onBack={handleBack}
        />
      )}

      {state.screen === "result" && (
        <ResultScreen state={state} onRestart={handleRestart} />
      )}

      <MistakeNotebook
        entries={state.mistakeNotebook}
        isOpen={notebookOpen}
        onClose={() => setNotebookOpen(false)}
      />
    </>
  );
}
