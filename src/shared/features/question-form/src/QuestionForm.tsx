"use client";

import {
  ChangeEvent,
  FormEvent,
  useCallback,
  useEffect,
  useState,
} from "react";
import { QuestionIconToolTip, SubmitButton } from "clue-hunt-ui";

import { QuestionFormMessages } from "@app/messages-contract";

import { useFormValidation } from "./hooks/useFormValidation";
import { FormValues, QuestionFormProps } from "./types";
import { getInputClassName, getPlaceholder } from "./utils/formHelpers";

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
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const {
    formValues,
    formErrors,
    touched,
    hasErrors,
    updateField,
    markTouched,
    validateField,
    validateAllFields,
  } = useFormValidation();

  const handleChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      const { name, value } = e.target;
      updateField(name as keyof FormValues, value);
    },
    [updateField]
  );

  const handleOnBlur = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      const { name } = e.target;
      markTouched(name as keyof FormValues);
      validateField();
    },
    [markTouched, validateField]
  );

  const handleSubmit = useCallback(
    (e: FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      const errors = validateAllFields();

      if (Object.keys(errors).length === 0) {
        setIsSubmitting(true);
      }
    },
    [validateAllFields]
  );

  useEffect(() => {
    if (!hasErrors && isSubmitting) {
      console.log("Form submitted with values:", formValues);
      setIsSuccess(true);
      handleUnlock?.();
    }
  }, [formErrors, isSubmitting, hasErrors, formValues, handleUnlock]);

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
              placeholder={getPlaceholder({
                touched: touched.answerOne || false,
                error: formErrors.answerOne,
                defaultPlaceholder: firstPlaceholder,
              })}
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
              className={getInputClassName({
                touched: touched.answerOne || false,
                error: formErrors.answerOne,
                className: styles.input,
                errorClassName: styles.error,
              })}
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
              placeholder={getPlaceholder({
                touched: touched.answerTwo || false,
                error: formErrors.answerTwo,
                defaultPlaceholder: secondPlaceholder,
              })}
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
              className={getInputClassName({
                touched: touched.answerTwo || false,
                error: formErrors.answerTwo,
                className: styles.input,
                errorClassName: styles.error,
              })}
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
