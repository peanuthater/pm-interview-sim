export type RoundType = "HR" | "Behavioral" | "Case";

export type QuestionStatus = "pending" | "pass" | "low_pass" | "fail";

export interface Question {
  id: string;
  round: RoundType;
  text: string;
  status: QuestionStatus;
  userAnswer?: string;
  feedback?: string;
  score?: number;
  attempts: number;
}

export interface Round {
  type: RoundType;
  label: string;
  questionCount: number;
  unlocked: boolean;
  completed: boolean;
}

export interface MistakeEntry {
  questionId: string;
  questionText: string;
  round: RoundType;
  userAnswer: string;
  feedback: string;
  score: number;
  status: "low_pass" | "fail";
}

export interface SessionState {
  resumeText: string;
  jdText: string;
  rounds: Round[];
  questions: Question[];
  mistakeNotebook: MistakeEntry[];
  currentRound: RoundType | null;
  currentQuestionId: string | null;
  screen:
    | "setup"
    | "loading"
    | "round_hub"
    | "question"
    | "result";
  allRoundsComplete: boolean;
}
