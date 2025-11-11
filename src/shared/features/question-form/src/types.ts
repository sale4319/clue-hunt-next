export type FormValues = {
  answerOne: string;
  answerTwo: string;
};

export type FormErrors = {
  answerOne?: string;
  answerTwo?: string;
};

export type TouchedFields = {
  answerOne?: boolean;
  answerTwo?: boolean;
};

export type QuestionFormProps = {
  questionIconSize?: "small" | "medium" | "large";
  handleUnlock?: () => void;
  firstQuestion?: string;
  firstHint?: string;
  firstPlaceholder?: string;
  secondQuestion?: string;
  secondHint?: string;
  secondPlaceholder?: string;
  successMessage?: string;
  theme?: string;
};
