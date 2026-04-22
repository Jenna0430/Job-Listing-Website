import { Box, Button, Typography,} from "@mui/material";
import { useEffect, useState } from "react";
import type { JSX } from "react";
import type { SelectChangeEvent } from "@mui/material";
import {ModalComponent, FormPage } from "../components";
import { required, minLength, maxLength, email, phone, date } from "../helper/FormValidator";
import { useAuth } from "../context/AuthContext";
import supabase from "../api/SupabaseClient";
import { useNavigate } from "react-router-dom";
import type { Company } from "../type/job.types";
import { createJob, DB_ERROR_CODES, getCompanyByOwner,  } from "../api";


function AddJobPage(): JSX.Element {


  interface JobFormData {
    [key: string]: string;
    title: string,
    description: string,
    location: string,
    salary: string,
    type: string
  }

  const [formData, setFormData] = useState<JobFormData>({
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
  const [fetchError, setFetchError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  //fetch the company profile
  useEffect(() => {
    const fetchCompany = async (): Promise<void> => {
      if (!user) {
        setLoadingCompany(false);
        return;
      }

      const result = await getCompanyByOwner(user.id);

      if(result.success) {
        const company = result.data;
        if(company){
           setCompany(company ?? null);
           setLoadingCompany(false);
        }
      }
      else {
        setFetchError(result.error);
      }
      setLoadingCompany(false);  
    };
    fetchCompany();
  }, [user]);

   const handleChange = (name: string, value: string): void => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };


  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    setSubmitError(null);

    if (!user || !company)  return;

    const result = await createJob({
      ...formData,
      posted_by:  user.id,
      company_id: company.id,
    });

    if(!result.success) {
      setSubmitError(result.error); return;
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


  if (!loadingCompany && company && company.status !== "verified") {
  return (
    <Box sx={{ maxWidth: "600px", margin: "40px auto", padding: "0 20px", textAlign: "center" }}>
      <Typography variant="h5" sx={{ marginBottom: "16px" }}>
        {company.status === "pending" ? "Approval Pending" : "Profile Rejected"}
      </Typography>
      <Typography sx={{ color: "gray", marginBottom: "24px" }}>
        {company.status === "pending"
          ? "Your company profile is awaiting admin approval. You will be able to post jobs once verified."
          : `Your company profile was rejected. ${company.rejection_reason ? `Reason: ${company.rejection_reason}` : ""}`
        }
      </Typography>
      <Button
        variant="outlined"
        onClick={() => navigate("/company-profile")}
        sx={{ backgroundColor: "var(--primary-color)"}}
      >
        View Company Profile
      </Button>
    </Box>
  );
}

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
              label: "Salary",
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