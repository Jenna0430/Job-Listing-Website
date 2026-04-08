import {
  Box,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  FormHelperText,
  Button,
} from "@mui/material";
import { useState } from "react";
import type { JSX } from "react";
import type { SelectChangeEvent } from "@mui/material";
import axiosInstance from "../api/AxiosInstance";
import type { job } from "../components/JobListing";
import axios from "axios";
import ModalComponent from "../components/ModalComponent";
import InputComponent from "../components/InputComponent";
import { validate } from "../helper/FormValidator";
import { required, minLength, maxLength, email, phone, date } from "../helper/FormValidator";

interface JobFormData {
  title: string;
  type: string;
  location: string;
  description: string;
  salary: string;
  company:{
    name: string;
    description: string;
    contactEmail: string;
    contactPhone: string;
    yearFounded: string;
    };
}

const initialFormData: JobFormData = {
  title: "",
  type: "",
  location: "",
  description: "",
  salary: "",
  company:{
    name: "",
    description: "",
    contactEmail: "",
    contactPhone: "",
    yearFounded: "",
    },
};

function AddJobPage(): JSX.Element {
  const [formData, setFormData] = useState<JobFormData>(initialFormData);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>): void => {
    const { name, value } = e.target;

    if (name.includes(".")) {
      const parts = name.split(".");
      const parentKey = parts[0];
      const childKey = parts[1];

      if (!parentKey || !childKey) return; //if parentkey or childkey is undefined, return early to avoid errors

      setFormData((prev) => ({ //the current state before the update
        ...prev,  //makes a shallow copy of the previous state to prevent direct mutation
        [parentKey]: {
          ...(prev[parentKey as keyof JobFormData] as object), //makes a shallow copy of the nested object to maintain immutability
          [childKey]: value, //updates the specific nested property with the new value from the input field
        }
      }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSelectChange = (e: SelectChangeEvent): void => {
    setFormData((prev) => ({ ...prev, type: e.target.value }));
  };

  const handleSubmit = async (e: React.SubmitEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    try {
      await axiosInstance.post<job>("/jobs", formData);
      setFormData(initialFormData);
      setIsModalOpen(true);
      }
     catch (error) {
      if(axios.isAxiosError(error)) {
        throw new Error(`Server error: ${error.response?.data}`);
      } else {
        throw new Error(`Unexpected error: ${error}`);
      }
    }
  };

  return (
    <Box sx={{ maxWidth: "600px", margin: "40px auto", padding: "0 20px" }}>
      <h1>Add Job</h1>

      <Box component="form" onSubmit={handleSubmit} sx={{ display: "flex", flexDirection: "column", gap: "20px" }}>

      
        <FormControl fullWidth required>
          <InputLabel>Job Type</InputLabel>
          <Select value={formData.type} label="Job Type" onChange={handleSelectChange}>
            <MenuItem value="Full-Time">Full-Time</MenuItem>
            <MenuItem value="Part-Time">Part-Time</MenuItem>
            <MenuItem value="Remote">Remote</MenuItem>
            <MenuItem value="Internship">Internship</MenuItem>
          </Select>
          <FormHelperText>Select the employment type</FormHelperText>
        </FormControl>

        <InputComponent
          label="Job Title"
          name="title"
          value={formData.title}
          onChange={handleChange}
          required
          validators={[required("Job title"), minLength("Job title", 3)]}
        />

        <InputComponent
          label="Description"
          name="description"
          value={formData.description}
          onChange={handleChange}
          multiline     
          rows={4}
          required
           validators={[required("Description"), minLength("Description", 20), maxLength("Description", 500)]}
        />

        <InputComponent
          label="Location"
          name="location"
          value={formData.location}
          onChange={handleChange}
          required
           validators={[required("Location")]}
        />

        <InputComponent
          label="Salary in FCFA"
          name="salary"
          value={formData.salary}
          onChange={handleChange}
          required
          validators={[required("Salary")]}

        />

        <InputComponent
          label="Company Name"
          name="company.name"
          value={formData.company.name}
          onChange={handleChange}
          required
          validators={[required("Company Name")]}

        />

        <InputComponent
          label="Company Email"
          name="company.contactEmail"
          value={formData.company.contactEmail}
          onChange={handleChange}
          type="email"
          required
          validators={[required("Company Email"), email]}
        />


        <InputComponent
          label="Company Phone"
          name="company.contactPhone"
          value={formData.company.contactPhone}
          onChange={handleChange}
          type="tel"
          required
          validators={[required("Company Phone"), phone]}
        />

        <InputComponent
          label="Year Founded"
          name="company.yearFounded"
          value={formData.company.yearFounded}
          onChange={handleChange}
          required={false}
          validators={[date]}
        />


         <InputComponent
          label="Company Description"
          name="company.description"
          value={formData.company.description}
          onChange={handleChange}
          multiline     
          rows={4}
          required
          validators={[required("Company Description"), minLength("Company Description", 20), maxLength("Company Description", 500)]}

        />

        <Button
          type="submit"
          variant="contained"
          sx={{ backgroundColor: "var(--primary-color)", color: "white", padding: "12px" }}
        >
          Add Job
        </Button>
      </Box>

      <ModalComponent 
      open={isModalOpen} 
      message="Job added successfully!" 
      onClose={() => setIsModalOpen(false)} />
    </Box>
  );
}

export default AddJobPage;