// src/components/GenericFormPage.tsx
import {Box, Button, CircularProgress, Divider, FormControl, FormHelperText,
  InputLabel, MenuItem, Select, TextField, Typography,
} from "@mui/material";
import type { SelectChangeEvent } from "@mui/material";
import type { JSX } from "react";
import { useNavigate } from "react-router-dom";
import InputComponent from "./InputComponent";
import type { FieldConfig, FormConfig } from "../types/form.types";

interface FormPageProps {
  config: FormConfig;   // The current values of every field, keyed by field name
  formValues: Record<string, string>;  // Called whenever any field changes and parent updates its own state
  onChange: (name: string, value: string) => void; // Called when the form is submitted parent runs its own backend logic
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => Promise<void>;
  loading?: boolean;
  submitError: string | null;
  successMessage: string | null;
}

function FormPage({
  config,
  formValues,
  onChange,
  onSubmit,
  loading = false,
  submitError,
  successMessage,
}: FormPageProps): JSX.Element {

  const navigate = useNavigate();

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", padding: "60px" }}>
        <CircularProgress sx={{ color: "var(--primary-color)" }} />
      </Box>
    );
  }

  // render component based on the field type
  const renderField = (field: FieldConfig): JSX.Element => {
    const value = formValues[field.name] ?? "";

    switch (field.type) {

      case "select":
        return (
          <FormControl fullWidth required={field.required} key={field.name}>
            <InputLabel>{field.label}</InputLabel>
            <Select
              value={value}
              label={field.label}
              onChange={(e: SelectChangeEvent) => onChange(field.name, e.target.value)}
            >
              {field.options?.map((opt) => (
                <MenuItem key={opt.value} value={opt.value}>
                  {opt.label}
                </MenuItem>
              ))}
            </Select>
            {field.helperText && (
              <FormHelperText>{field.helperText}</FormHelperText>
            )}
          </FormControl>
        );

      // shows a value but cannot be edited
      case "display":
        return (
          <TextField
            key={field.name}
            label={field.label}
            value={field.value ?? value}
            disabled
            fullWidth
            helperText={field.helperText}
          />
        );

      default:
        return (
          <InputComponent
            key={field.name}
            label={field.label}
            name={field.name}
            value={value}
            type={field.type ?? "text"}
            onChange={(e) => onChange(field.name, e.target.value)}
            multiline={field.type === "textarea"}
            rows={field.type === "textarea" ? (field.rows ?? 4) : undefined}
            required={field.required}
            validators={field.validators}
          />
        );
    }
  };

  return (
    <Box sx={{ maxWidth: "600px", margin: "40px auto", padding: "0 20px" }}>

      <Typography variant="h4">{config.title}</Typography>

      {config.subtitle && (
        <Typography sx={{ color: "gray", marginTop: "8px" }}>
          {config.subtitle}
        </Typography>
      )}

      <Divider sx={{ margin: "20px 0" }} />

      <Box
        component="form"
        onSubmit={onSubmit}
        sx={{ display: "flex", flexDirection: "column", gap: "20px" }}
      >
        {/* Render every field defined in the config */}
        {config.fields.map((field) => renderField(field))}

        {/* Error and success messages */}
        {submitError && (
          <Typography color="error">{submitError}</Typography>
        )}
        {successMessage && (
          <Typography color="success.main">{successMessage}</Typography>
        )}

        {/* Action buttons */}
        <Box sx={{ display: "flex", gap: "10px" }}>
          <Button
            type="submit"
            variant="contained"
            fullWidth
            sx={{ backgroundColor: "var(--primary-color)", color: "white", padding: "12px" }}
          >
            {config.submitLabel}
          </Button>

          {/* Cancel button — only shown if cancelPath is provided */}
          {config.cancelPath && (
            <Button
              type="button"
              variant="outlined"
              fullWidth
              onClick={() => navigate(config.cancelPath!)}
              sx={{ padding: "12px" }}
            >
              Cancel
            </Button>
          )}
        </Box>
      </Box>
    </Box>
  );
}

export default FormPage;