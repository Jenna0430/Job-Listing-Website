import { Box, Button, Typography, CircularProgress } from "@mui/material";
import { useState } from "react";
import type { JSX } from "react";
import { ModalComponent, FormPage } from "../components";
import { required, minLength, maxLength } from "../helper/FormValidator";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { useCompany, useCreateJob } from "../hooks/genaralHooks";

interface JobFormData {
  [key: string]: string;
  title: string;
  description: string;
  location: string;
  salary: string;
  type: string;
}

const emptyForm: JobFormData = {
  title: "", description: "", location: "", salary: "", type: "",
};

function AddJobPage(): JSX.Element {
  const { user }    = useAuth();
  const navigate    = useNavigate();
  const [formData, setFormData] = useState<JobFormData>(emptyForm);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // ── TanStack Query hooks ──────────────────────────────────────────────────
  const { data: company, isLoading: loadingCompany, error: companyError } = useCompany();
  const { mutate: postJob, isPending, error: submitError } = useCreateJob();

  const handleChange = (name: string, value: string): void => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    if (!user || !company) return;

    postJob(
      { ...formData, posted_by: user.id, company_id: company.id },
      {
        onSuccess: () => {
          setFormData(emptyForm);
          setIsModalOpen(true);
        },
      }
    );
  };

  // ── Loading state ─────────────────────────────────────────────────────────
  if (loadingCompany) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", padding: "60px" }}>
        <CircularProgress />
      </Box>
    );
  }

  // ── Company not verified ──────────────────────────────────────────────────
  if (company && company.status !== "verified") {
    return (
      <Box sx={{ maxWidth: "600px", margin: "40px auto", padding: "0 20px", textAlign: "center" }}>
        <Typography variant="h5" sx={{ marginBottom: "16px" }}>
          {company.status === "pending" ? "Approval Pending" : "Profile Rejected"}
        </Typography>
        <Typography sx={{ color: "gray", marginBottom: "24px" }}>
          {company.status === "pending"
            ? "Your company profile is awaiting admin approval. You will be able to post jobs once verified."
            : `Your company profile was rejected. ${company.rejection_reason ? `Reason: ${company.rejection_reason}` : ""}`}
        </Typography>
        <Button variant="outlined" onClick={() => navigate("/company-profile")}>
          View Company Profile
        </Button>
      </Box>
    );
  }

  // ── No company ────────────────────────────────────────────────────────────
  if (!company) {
    return (
      <Box sx={{ maxWidth: "600px", margin: "40px auto", padding: "0 20px", textAlign: "center" }}>
        <Typography variant="h5" sx={{ marginBottom: "16px" }}>Company Profile Required</Typography>
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
          submitLabel: isPending ? "Posting..." : "Post Job",
          cancelPath: "/jobs",
          fields: [
            {
              name: "company", label: "Company", type: "display",
              value: company.name, helperText: "From your company profile",
            },
            {
              name: "type", label: "Job Type", type: "select", required: true,
              helperText: "Select the employment type",
              options: [
                { value: "Full-Time",   label: "Full-Time"   },
                { value: "Part-Time",   label: "Part-Time"   },
                { value: "Remote",      label: "Remote"      },
                { value: "Internship",  label: "Internship"  },
              ],
            },
            { name: "title",       label: "Job Title",   required: true, validators: [required("Job title"), minLength("Job title", 3)] },
            { name: "description", label: "Description", type: "textarea", rows: 4, required: true,
              validators: [required("Description"), minLength("Description", 20), maxLength("Description", 500)] },
            { name: "location",    label: "Location",    required: true, validators: [required("Location")] },
            { name: "salary",      label: "Salary",      required: true, validators: [required("Salary")] },
          ],
        }}
        formValues={formData}
        onChange={handleChange}
        onSubmit={handleSubmit}
        submitError={submitError?.message ?? null}
        successMessage={null}
        loading={isPending}
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