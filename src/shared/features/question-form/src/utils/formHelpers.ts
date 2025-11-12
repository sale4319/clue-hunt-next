import { FormFieldProps } from "../types";

export const getInputClassName = ({
  touched,
  error,
  className,
  errorClassName,
}: Omit<FormFieldProps, "fieldName" | "defaultPlaceholder">) => {
  return touched && error ? errorClassName : className;
};

export const getPlaceholder = ({
  touched,
  error,
  defaultPlaceholder,
}: Pick<FormFieldProps, "touched" | "error" | "defaultPlaceholder">) => {
  return touched && error ? error : defaultPlaceholder;
};
