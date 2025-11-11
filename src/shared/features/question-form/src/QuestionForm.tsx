"use client";

import {
  ChangeEvent,
  FormEvent,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import { QuestionIconToolTip, SubmitButton } from "clue-hunt-ui";

import { QuestionFormMessages } from "@app/messages-contract";

import {
  FormErrors,
  FormValues,
  QuestionFormProps,
  TouchedFields,
} from "./types";

import styles from "./QuestionForm.module.css";

export const QuestionForm = ({
  questionIconSize = "medium",
  handleUnlock,
  firstQuestion = "What is your first question?",
  firstHint = "What is your first hint?",
  firstPlaceholder = "What is your first placeholder?",
  secondQuestion = "What is your second question?",
  secondHint = "What is your second hint?",
  secondPlaceholder = "What is your second placeholder?",
  successMessage = "What is your success message?",
  theme = "dark",
}: QuestionFormProps) => {
  const [formValues, setFormValues] = useState<FormValues>({
    answerOne: "",
    answerTwo: "",
  });
  const [formErrors, setFormErrors] = useState<FormErrors>({});
  const [touched, setTouched] = useState<TouchedFields>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const validate = useCallback((values: FormValues): FormErrors => {
    const errors: FormErrors = {};
    const a1 = process.env.NEXT_PUBLIC_ANSWER_ONE;
    const a2 = process.env.NEXT_PUBLIC_ANSWER_TWO;
    const regex1 = new RegExp(`^$|^${a1}|^([FG]?\\d{5}|\\d{5}[AB])$`);
    const regex2 = new RegExp(`^$|^${a2}|^([FG]?\\d{5}|\\d{5}[AB])$`);

    if (!values.answerOne) {
      errors.answerOne = QuestionFormMessages.REQUIRED;
    } else if (values.answerOne.length < 4) {
      errors.answerOne = QuestionFormMessages.SHORT;
    } else if (!regex1.test(values.answerOne)) {
      errors.answerOne = QuestionFormMessages.FIRST_Q_WRONG;
    }

    if (!values.answerTwo) {
      errors.answerTwo = QuestionFormMessages.REQUIRED;
    } else if (values.answerTwo.length < 4) {
      errors.answerTwo = QuestionFormMessages.SHORT;
    } else if (!regex2.test(values.answerTwo)) {
      errors.answerTwo = QuestionFormMessages.SECOND_Q_WRONG;
    }

    return errors;
  }, []);

  const handleChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormValues((prev) => ({ ...prev, [name]: value }));
    setTouched((prev) => ({ ...prev, [name]: true }));
  }, []);

  const handleOnBlur = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      const { name } = e.target;
      setTouched((prev) => ({ ...prev, [name]: true }));
      setFormErrors((prev) => ({ ...prev, ...validate(formValues) }));
    },
    [formValues, validate]
  );

  const handleSubmit = useCallback(
    (e: FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      const errors = validate(formValues);
      setFormErrors(errors);
      setTouched({ answerOne: true, answerTwo: true });

      if (Object.keys(errors).length === 0) {
        setIsSubmitting(true);
      }
    },
    [formValues, validate]
  );

  const hasErrors = useMemo(
    () => Object.keys(formErrors).length > 0,
    [formErrors]
  );

  useEffect(() => {
    if (!hasErrors && isSubmitting) {
      console.log("Form submitted with values:", formValues);
      setIsSuccess(true);
      handleUnlock?.();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formErrors, isSubmitting, hasErrors]);

  const getInputClassName = (fieldName: keyof FormValues) => {
    return touched[fieldName] && formErrors[fieldName]
      ? styles.error
      : styles.input;
  };

  const getPlaceholder = (
    fieldName: keyof FormValues,
    defaultPlaceholder: string
  ) => {
    return touched[fieldName] && formErrors[fieldName]
      ? formErrors[fieldName]
      : defaultPlaceholder;
  };

  const themeClassName = [styles.label, styles[theme]].join(" ");

  return (
    <>
      {isSuccess && (
        <span className={styles.successMessage}>{successMessage}</span>
      )}
      <div className={[styles.card, styles[theme]].join(" ")}>
        <form
          className={styles.form}
          onSubmit={handleSubmit}
          noValidate
          autoComplete="off"
        >
          <div className={styles.inputGroup}>
            <label className={themeClassName} htmlFor="answerOne">
              {firstQuestion}
              <QuestionIconToolTip
                size={questionIconSize}
                content={firstHint}
              />
            </label>
            <input
              placeholder={getPlaceholder("answerOne", firstPlaceholder)}
              type="text"
              name="answerOne"
              id="answerOne"
              value={formValues.answerOne}
              onBlur={handleOnBlur}
              onChange={handleChange}
              autoComplete="off"
              autoCorrect="off"
              autoCapitalize="off"
              spellCheck="false"
              data-form-type="other"
              className={getInputClassName("answerOne")}
            />
          </div>

          <div className={styles.inputGroup}>
            <label className={themeClassName} htmlFor="answerTwo">
              {secondQuestion}
              <QuestionIconToolTip
                size={questionIconSize}
                content={secondHint}
              />
            </label>
            <input
              placeholder={getPlaceholder("answerTwo", secondPlaceholder)}
              type="password"
              name="answerTwo"
              id="answerTwo"
              value={formValues.answerTwo}
              onBlur={handleOnBlur}
              onChange={handleChange}
              autoComplete="new-password"
              autoCorrect="off"
              autoCapitalize="off"
              spellCheck="false"
              data-form-type="other"
              className={getInputClassName("answerTwo")}
            />
          </div>
          <SubmitButton
            submit
            size={"medium"}
            label={QuestionFormMessages.SUBMIT_BUTTON}
          />
        </form>
      </div>
    </>
  );
};
