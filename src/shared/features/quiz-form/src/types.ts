export type Question = {
  question: string;
  answers: string[];
  correctAnswerIndex: number;
};

export type QuestionProps = {
  question: Question;
  setAnswerStatus: (isCorrect: boolean) => void;
  savedAnswerIndex?: number | null; // Previously saved answer index
  onAnswerSelected: (answerIndex: number) => void; // Callback to save answer immediately
};

export type QuizProps = {
  sessionId: string;
  quizName: "start" | "one" | "two" | "three" | "four" | "five" | "six";
  questions?: Question[];
  handleUnlock?: () => void;
  theme?: string;
};

export type QuizCompleteScreenProps = {
  theme: string;
  correctAnswerCount: number;
  totalQuestions: number;
  isPerfectScore: boolean;
  onUnlock?: () => void;
  onRestart: () => void;
};

export type QuizInProgressScreenProps = {
  theme: string;
  questionIndex: number;
  totalQuestions: number;
  question: Question;
  answerStatus: boolean | null;
  savedAnswerIndex: number | undefined;
  isLastQuestion: boolean;
  onAnswerSelected: (answerIndex: number) => void;
  onNext: () => void;
  setAnswerStatus: (status: boolean | null) => void;
};

export type QuizStartScreenProps = {
  theme: string;
  onStart: () => void;
};

export type QuizName =
  | "start"
  | "one"
  | "two"
  | "three"
  | "four"
  | "five"
  | "six";

export type ProgressBarProps = {
  currentQuestionIndex: number;
  totalQuestionsCount: number;
};
