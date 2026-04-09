import type { FormValidator } from "../helper/FormValidator";

// Every possible field type across all your forms
export type FieldType =
  | "text"
  | "email"
  | "tel"
  | "password"
  | "textarea"
  | "select"
  | "file"
  | "display"; // read-only field like the company name in AddJobPage

export interface FieldConfig {
  name: string;          
  label: string;         
  type?: FieldType;      
  required?: boolean;
  validators?: FormValidator[];
  rows?: number;         
  options?: {            
    value: string;
    label: string;
  }[];
  helperText?: string;  
  disabled?: boolean;   
  value?: string;     
}

// The full config passed to GenericFormPage
export interface FormConfig {
  title: string;
  subtitle?: string;
  submitLabel: string;
  fields: FieldConfig[];
  cancelPath?: string;    
}