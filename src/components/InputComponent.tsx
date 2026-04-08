import { TextField } from "@mui/material";
import React, { useState } from "react";
import type { JSX } from "react";
import { validate, type FormValidator } from "../helper/FormValidator";

interface InputComponentProps {
  label: string;
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  multiline?: boolean;
  rows?: number;
  required?: boolean;
  type?: string;
  validators?: FormValidator[];  
}


function InputComponent({ label, name, value, onChange, multiline, rows, required, type, validators }: InputComponentProps): JSX.Element {

    const [error, setError] = useState<string | null>(null);

    const handleBlur = (): void => {
        if (!validators) return;
        const result = validate(value, validators);
        setError(result);
    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>): void => {
        onChange(e);
        if (error && validators) {
            const result = validate(e.target.value, validators);
            setError(result);
        }
    }

  return (
    <TextField
          label={label}
          name={name}
          value={value}
          onChange={handleChange}
          onBlur={handleBlur}
          variant="outlined"
          fullWidth
          multiline={multiline}
          rows={rows}
          required={required}
          type={type}
          error={!!error}
          helperText={error ?? ""}
        />
  );
}
export default InputComponent;