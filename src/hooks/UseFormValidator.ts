import { useState } from "react";
import { validate } from "../helper/FormValidator";
import type { FormValidator } from "../helper/FormValidator";


type ValidationRules<T> = Partial<Record<keyof T, FormValidator[]>>;

type FormErrors<T> = Partial<Record<keyof T, string | null>>;
function useFormValidator<T extends Record<string, string>>(rules: ValidationRules<T>) {
    const [errors, setErrors] = useState<FormErrors<T>>({});

    const validateField = (fieldName: keyof T, value: string): void => {
        const fieldRules = rules[fieldName];
        if (!fieldRules) return;    
        const error = validate(value, fieldRules);
        setErrors((prev) => ({ ...prev, [fieldName]: error }));
    };

    const validateAll = (formData: T): boolean => {
        let isValid = true;
        const newErrors: FormErrors<T> = {};
        for (const fieldName in rules) {
            const fieldRules = rules[fieldName as keyof T];
            if (!fieldRules) continue;
            const error = validateField(formData[fieldName] ?? "", fieldRules);
            newErrors[fieldName as keyof T] = error;
            if (error) isValid = false;
        }
        setErrors(newErrors);
        return isValid;
    };

    return { errors, validateField: validateSingleField, validateAll };
}

export default useFormValidator;