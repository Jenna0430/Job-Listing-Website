import { Box, Button, Chip, Typography, Divider, CircularProgress } from "@mui/material";
import { useState, useEffect } from "react";
import type { JSX } from "react";
import { FormPage, ModalComponent } from "../components";
import { required, minLength, maxLength, email, phone, date } from "../helper/FormValidator";
import { Link } from "react-router-dom";
import { useCompany, useCreateCompany, useUpdateCompany } from "../hooks/genaralHooks";
import type { Company } from "../type/job.types";

interface CompanyFormData {
  [key: string]: string;
  name: string;
  description: string;
  contact_email: string;
  contact_phone: string;
  year_founded: string;
}

const statusChip = (status: Company["status"]): JSX.Element => {
  const map = {
    pending:  { label: "Pending Approval", color: "warning" },
    verified: { label: "Verified",         color: "success" },
    rejected: { label: "Rejected",         color: "error"   },
  } as const;
  const { label, color } = map[status] ?? map.pending;
  return <Chip label={label} color={color} size="small" />;
};

const emptyForm: CompanyFormData = {
  name: "", description: "", contact_email: "", contact_phone: "", year_founded: "",
};

function CompanyProfilePage(): JSX.Element {
  const [isModalOpen, setIsModalOpen]       = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [formData, setFormData]             = useState<CompanyFormData>(emptyForm);

  const { data: company, isLoading, error: fetchError } = useCompany();
  const { mutate: create, isPending: creating, error: createError } = useCreateCompany();
  const { mutate: update, isPending: updating, error: updateError } = useUpdateCompany();

  const submitError  = (createError ?? updateError)?.message ?? null;
  const isSubmitting = creating || updating;

  // Pre-fill form when company data loads
  useEffect(() => {
    if (company) {
      setFormData({
        name:          company.name,
        description:   company.description   ?? "",
        contact_email: company.contact_email ?? "",
        contact_phone: company.contact_phone ?? "",
        year_founded:  company.year_founded  ?? "",
      });
    }
  }, [company]);

  const handleChange = (name: string, value: string): void => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    setSuccessMessage(null);

    if (company) {
      update(formData, {
        onSuccess: () => setSuccessMessage("Company profile updated successfully!"),
      });
    } else {
      create(formData, {
        onSuccess: () => {
          setFormData(emptyForm);
          setIsModalOpen(true);
        },
      });
    }
  };

  if (isLoading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", padding: "60px" }}>
        <CircularProgress />
      </Box>
    );
  }

  if (fetchError) {
    return (
      <Box sx={{ maxWidth: "600px", margin: "40px auto", padding: "0 20px" }}>
        <Typography color="error">{fetchError.message}</Typography>
      </Box>
    );
  }

  // ── Company exists — show profile ─────────────────────────────────────────
  if (company) {
    const isPending  = company.status === "pending";
    const isRejected = company.status === "rejected";

    return (
      <Box sx={{ maxWidth: "600px", margin: "40px auto", padding: "0 20px" }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 1 }}>
          <Typography variant="h4">Company Profile</Typography>
          {statusChip(company.status)}
        </Box>

        <Divider sx={{ mb: 3 }} />

        {isPending && (
          <Box sx={{ mb: 3, p: 2, borderRadius: 2, bgcolor: "warning.light", border: "1px solid", borderColor: "warning.main" }}>
            <Typography variant="body2" color="warning.dark" fontWeight={600}>
              Your company is pending admin approval.
            </Typography>
            <Typography variant="body2" color="warning.dark" mt={0.5}>
              You will be able to post jobs once your profile has been verified.
            </Typography>
          </Box>
        )}

        {isRejected && (
          <Box sx={{ mb: 3, p: 2, borderRadius: 2, bgcolor: "error.light", border: "1px solid", borderColor: "error.main" }}>
            <Typography variant="body2" color="error.dark" fontWeight={600}>
              Your company profile was rejected.
            </Typography>
            {company.rejection_reason && (
              <Typography variant="body2" color="error.dark" mt={0.5}>
                Reason: {company.rejection_reason}
              </Typography>
            )}
          </Box>
        )}

        <Box sx={{ display: "flex", flexDirection: "column", gap: 1, mb: 3 }}>
          <Typography><strong>Name:</strong> {company.name}</Typography>
          <Typography><strong>Description:</strong> {company.description}</Typography>
          <Typography><strong>Contact Email:</strong> {company.contact_email}</Typography>
          <Typography><strong>Contact Phone:</strong> {company.contact_phone}</Typography>
          <Typography><strong>Year Founded:</strong> {company.year_founded}</Typography>
        </Box>

        <Link to="/edit-company-profile">
          <Button variant="contained" sx={{ padding: "12px", backgroundColor: "var(--primary-color)", color: "white" }}>
            Edit Profile
          </Button>
        </Link>
      </Box>
    );
  }

  // ── No company — show create form ─────────────────────────────────────────
  return (
    <>
      <FormPage
        config={{
          title: "Create Company Profile",
          subtitle: "You need a company profile before you can post jobs.",
          submitLabel: isSubmitting ? "Saving..." : "Create Profile",
          fields: [
            { name: "name",          label: "Company Name",        type: "text",     required: true, validators: [required("Company Name")] },
            { name: "contact_email", label: "Contact Email",       type: "email",    required: true, validators: [required("Contact Email"), email] },
            { name: "contact_phone", label: "Contact Phone",       type: "tel",      required: true, validators: [required("Contact Phone"), phone] },
            { name: "year_founded",  label: "Year Founded",        type: "text",     validators: [date] },
            { name: "description",   label: "Company Description", type: "textarea", rows: 4, required: true,
              validators: [required("Company Description"), minLength("Company Description", 20), maxLength("Company Description", 500)] },
          ],
        }}
        formValues={formData}
        onSubmit={handleSubmit}
        submitError={submitError}
        successMessage={successMessage}
        onChange={handleChange}
        loading={isSubmitting}
      />
      <ModalComponent
        open={isModalOpen}
        message="Profile created! Your company is now pending admin approval."
        onClose={() => setIsModalOpen(false)}
      />
    </>
  );
}

export default CompanyProfilePage;