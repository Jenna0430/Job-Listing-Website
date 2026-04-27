import { useState } from "react";
import { validate } from "../helper/FormValidator";
import type { FormValidator } from "../helper/FormValidator";

type ValidationRules<T> = Partial<Record<keyof T, FormValidator[]>>;
type FormErrors<T>      = Partial<Record<keyof T, string | null>>;

function useFormValidator<T extends Record<string, string>>(rules: ValidationRules<T>) {
  const [errors, setErrors] = useState<FormErrors<T>>({});

  // Validates a single field and updates errors state
  const validateField = (fieldName: keyof T, value: string): void => {
    const fieldRules = rules[fieldName];
    if (!fieldRules) return;
    const error = validate(value, fieldRules);
    setErrors(prev => ({ ...prev, [fieldName]: error }));
  };

  // Validates all fields — used on form submit
  // Calls validate() directly instead of validateField() to get the return value
  const validateAll = (formData: T): boolean => {
    let isValid = true;
    const newErrors: FormErrors<T> = {};

    for (const fieldName in rules) {
      const fieldRules = rules[fieldName as keyof T];
      if (!fieldRules) continue;

      const error = validate(formData[fieldName] ?? "", fieldRules); // ← direct call, not validateField
      newErrors[fieldName as keyof T] = error;
      if (error) isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  return { errors, validateField, validateAll }; // ← validateField, not validateSingleField
}

export default useFormValidator;