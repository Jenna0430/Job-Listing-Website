import {
  Box,
  Button,
  Typography,
} from "@mui/material";
import { useEffect, useState } from "react";
import type { JSX } from "react";
import type { SelectChangeEvent } from "@mui/material";
import {ModalComponent, FormPage } from "../components";
import { required, minLength, maxLength, email, phone, date } from "../helper/FormValidator";
import { useAuth } from "../context/AuthContext";
import supabase from "../api/SupabaseClient";
import { useNavigate } from "react-router-dom";
import type { Company } from "../type/job.types";


function AddJobPage(): JSX.Element {

  const [formData, setFormData] = useState<Record<string, string>>({
  title: "",
  description: "",
  location: "",
  salary: "",
  type: "",
  });

  const { user } = useAuth();
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [company, setCompany] = useState<Company | null>(null);
  const [loadingCompany, setLoadingCompany] = useState(false);

  //fetch the company profile

  useEffect(() => {
    const fetchCompany = async (): Promise<void> => {
      if (!user) return;

      const { data } = await supabase
        .from("companies")
        .select("*")
        .eq("owner_id", user.id)
        .single();

      setCompany(data ?? null);
      setLoadingCompany(false);
    };

    fetchCompany();
  }, [user]);

   const handleChange = (name: string, value: string): void => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (e: SelectChangeEvent): void => {
    setFormData((prev) => ({ ...prev, type: e.target.value }));
  };

  const handleSubmit = async (e: React.SubmitEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    setSubmitError(null);

    if (!user || !company)  return;

    const { error } = await supabase.from("jobs").insert([{
      ...formData,
      posted_by: user.id,
      company_id: company.id, //associate the job with the company profile using the company ID as a foreign key
    }]);
    
     if (error?.code === "23505") {
      // 23505 is PostgreSQL's error code for unique constraint violation
      setSubmitError(
        `You have already posted a "${formData.title}" job in "${formData.location}". 
         Please edit the existing posting instead.`
      );
      return;
    }

    if (error) {
      setSubmitError(error.message);
      return;
    }

    setFormData({
      title: "",
      description: "",
      location: "",
      salary: "",
      type: "",
    });
    setIsModalOpen(true);
  };

  if(!loadingCompany && !company) {
     return (
      <Box sx={{ maxWidth: "600px", margin: "40px auto", padding: "0 20px", textAlign: "center" }}>
        <Typography variant="h5" sx={{ marginBottom: "16px" }}>
          Company Profile Required
        </Typography>
        <Typography sx={{ color: "gray", marginBottom: "24px" }}>
          You need to create a company profile before you can post jobs.
        </Typography>
        <Button
          variant="contained"
          onClick={() => navigate("/company-profile")}
          sx={{ backgroundColor: "var(--primary-color)", color: "white" }}
        >
          Create Company Profile
        </Button>
      </Box>
    );
  }

  return (
   <>
      <FormPage
        config={{
          title: "Add Job",
          subtitle: "Fill in the details for your new job posting.",
          submitLabel: "Post Job",
          cancelPath: "/jobs",
          fields: [
            {
              // Display field — shows company name but cannot be edited
              name: "company",
              label: "Company",
              type: "display",
              value: loadingCompany ? "Loading..." : (company?.name ?? "No company profile found"),
              helperText: "From your company profile",
            },
            {
              name: "type",
              label: "Job Type",
              type: "select",
              required: true,
              helperText: "Select the employment type",
              options: [
                { value: "Full-Time", label: "Full-Time" },
                { value: "Part-Time", label: "Part-Time" },
                { value: "Remote", label: "Remote" },
                { value: "Internship", label: "Internship" },
              ],
            },
            {
              name: "title",
              label: "Job Title",
              required: true,
              validators: [required("Job title"), minLength("Job title", 3)],
            },
            {
              name: "description",
              label: "Description",
              type: "textarea",
              rows: 4,
              required: true,
              validators: [required("Description"), minLength("Description", 20), maxLength("Description", 500)],
            },
            {
              name: "location",
              label: "Location",
              required: true,
              validators: [required("Location")],
            },
            {
              name: "salary",
              label: "Salary in FCFA",
              required: true,
              validators: [required("Salary")],
            },
            
          ],
        }}
        formValues={formData}
        onChange={handleChange}
        onSubmit={handleSubmit}
        submitError={submitError}
        successMessage={null}
      />

      <ModalComponent
        open={isModalOpen}
        message="Job posted successfully!"
        onClose={() => setIsModalOpen(false)}
      />
    </>
  );
}

export default AddJobPage;