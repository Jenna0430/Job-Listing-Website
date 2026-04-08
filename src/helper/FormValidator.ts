
export type FormValidator = (value: string) => string | null;

export const required = (fieldName: string): FormValidator => 
    (value) => value.trim() === "" ? `${fieldName} is required` : null;

export const minLength = (fieldName: string, min: number): FormValidator =>
    (value) => value.length < min ? `${fieldName} must be at least ${min} characters` : null;

export const maxLength = (fieldName: string, max: number): FormValidator =>
    (value) => value.length > max ? `${fieldName} must be at most ${max} characters` : null;

export const email: FormValidator = (value) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return !emailRegex.test(value) ? "Invalid email address" : null;
};

export const phone: FormValidator = (value) => {
    const phoneRegex = /^\+?[1-9]\d{1,14}$/; 
    return !phoneRegex.test(value) ? "Invalid phone number" : null;
};

export const date: FormValidator = (value) => {
    const dateRegex = /^\d{4}$/;    
    return !dateRegex.test(value) ? "Invalid date format (YYYY)" : null;
};

export const validate = (value: string, validators: FormValidator[]): string | null => {
    for (const validator of validators) {
        const error = validator(value);
        if (error) {
            return error;
        }
    }
    return null;
};