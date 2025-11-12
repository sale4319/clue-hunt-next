import { useCallback, useMemo, useState } from "react";

import { QuestionFormMessages } from "@app/messages-contract";

import { FormErrors, FormValues, TouchedFields } from "../types";

export const useFormValidation = () => {
  const [formValues, setFormValues] = useState<FormValues>({
    answerOne: "",
    answerTwo: "",
  });
  const [formErrors, setFormErrors] = useState<FormErrors>({});
  const [touched, setTouched] = useState<TouchedFields>({});

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

  const hasErrors = useMemo(
    () => Object.keys(formErrors).length > 0,
    [formErrors]
  );

  const updateField = useCallback((name: keyof FormValues, value: string) => {
    setFormValues((prev) => ({ ...prev, [name]: value }));
    setTouched((prev) => ({ ...prev, [name]: true }));
  }, []);

  const markTouched = useCallback((name: keyof FormValues) => {
    setTouched((prev) => ({ ...prev, [name]: true }));
  }, []);

  const validateField = useCallback(() => {
    setFormErrors(validate(formValues));
  }, [formValues, validate]);

  const validateAllFields = useCallback(() => {
    const errors = validate(formValues);
    setFormErrors(errors);
    setTouched({ answerOne: true, answerTwo: true });
    return errors;
  }, [formValues, validate]);

  return {
    formValues,
    formErrors,
    touched,
    hasErrors,
    updateField,
    markTouched,
    validateField,
    validateAllFields,
  };
};
