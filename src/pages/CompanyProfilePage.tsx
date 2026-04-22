import { Box, Button, Chip, Typography, Divider } from "@mui/material";
import { useState, useEffect } from "react";
import type { JSX } from "react";
import { useAuth } from "../context/AuthContext";
import { FormPage, ModalComponent } from "../components";
import { required, minLength, maxLength, email, phone, date } from "../helper/FormValidator";
import type { Company } from "../type/job.types";
import { Link } from "react-router-dom";
import { getCompanyByOwner, createCompany, updateCompany } from "../api";

interface CompanyFormData {
  [key: string]: string;
  name: string;
  description: string;
  contact_email: string;
  contact_phone: string;
  year_founded: string;
}

// Maps company status to a MUI Chip color
const statusChip = (status: Company["status"]): JSX.Element => {
  const map = {
    pending:  { label: "Pending Approval", color: "error" },
    verified: { label: "Verified",         color: "success" },
    rejected: { label: "Rejected",         color: "error"   },
  } as const;

  const { label, color } = map[status] ?? map.pending;
  return <Chip label={label} color={color} size="small" />;
};

function CompanyProfilePage(): JSX.Element {
  const { user } = useAuth();
  const [company, setCompany] = useState<Company | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [fetchError, setFetchError] = useState<string | null>(null);

  const [formData, setFormData] = useState<CompanyFormData>({
    name: "",
    description: "",
    contact_email: "",
    contact_phone: "",
    year_founded: "",
  });

  useEffect(() => {
    const fetchCompany = async (): Promise<void> => {
      if (!user) {
        setLoading(false);
        return;
      }

      const result = await getCompanyByOwner(user.id);

      if (result.success) {
        const company = result.data;
        if (company) {
          setCompany(company);
          setFormData({
            name:          company.name,
            description:   company.description   ?? "",
            contact_email: company.contact_email ?? "",
            contact_phone: company.contact_phone ?? "",
            year_founded:  company.year_founded  ?? "",
          });
        }
      } else {
        setFetchError(result.error);
      }

      setLoading(false); 
    };

    fetchCompany();
  }, [user]);

  const handleChange = (name: string, value: string): void => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (
    e: React.FormEvent<HTMLFormElement>
  ): Promise<void> => {
    e.preventDefault();
    setSubmitError(null);
    setSuccessMessage(null);

    if (!user) return;

    if (company) {
      const result = await updateCompany(formData, user.id);
      if (!result.success) { setSubmitError(result.error); return; }
      setSuccessMessage("Company profile updated successfully!");
    } else {
      const result = await createCompany(formData, user.id);
      if (!result.success) { setSubmitError(result.error); return; }
      setIsModalOpen(true);
      setSuccessMessage("Company profile created successfully!");
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", padding: "60px" }}>
        <Typography>Loading...</Typography>
      </Box>
    );
  }

  if (fetchError) {
    return (
      <Box sx={{ maxWidth: "600px", margin: "40px auto", padding: "0 20px" }}>
        <Typography color="error">{fetchError}</Typography>
      </Box>
    );
  }

  // Company exists show profile 
  if (company) {
    const isPending  = company.status === "pending";
    const isRejected = company.status === "rejected";

    return (
      <Box sx={{ maxWidth: "600px", margin: "40px auto", padding: "0 20px" }}>

        {/* Header row */}
        <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 1 }}>
          <Typography variant="h4">Company Profile</Typography>
          {statusChip(company.status)}
        </Box>

        <Divider sx={{ mb: 3 }} />

        {/* Pending notice */}
        {isPending && (
          <Box
            sx={{
              mb: 3,
              p: 2,
              borderRadius: 2,
              bgcolor: "var(--secondary-color-light)",
              border: "1px solid",
              borderColor: "var(--secondary-color)",
            }}
          >
            <Typography variant="body2" color="var(--secondary-color)" fontWeight={600}>
              Your company is pending admin approval.
            </Typography>
            <Typography variant="body2" color="var(--secondary-color)" mt={0.5}>
              You will be able to post jobs once your profile has been verified.
            </Typography>
          </Box>
        )}

        {/* Rejected notice */}
        {isRejected && (
          <Box
            sx={{
              mb: 3,
              p: 2,
              borderRadius: 2,
              bgcolor: "error.light",
              border: "1px solid",
              borderColor: "error.main",
            }}
          >
            <Typography variant="body2" color="error.dark" fontWeight={600}>
              Your company profile was rejected.
            </Typography>
            {company.rejection_reason && (
              <Typography variant="body2" color="error.dark" mt={0.5}>
                Reason: {company.rejection_reason}
              </Typography>
            )}
            <Typography variant="body2" color="error.dark" mt={0.5}>
              Please update your profile and contact support if you need help.
            </Typography>
          </Box>
        )}

        {/* Company details */}
        <Box sx={{ display: "flex", flexDirection: "column", gap: 1, mb: 3 }}>
          <Typography><strong>Name:</strong> {company.name}</Typography>
          <Typography><strong>Description:</strong> {company.description}</Typography>
          <Typography><strong>Contact Email:</strong> {company.contact_email}</Typography>
          <Typography><strong>Contact Phone:</strong> {company.contact_phone}</Typography>
          <Typography><strong>Year Founded:</strong> {company.year_founded}</Typography>
        </Box>

        {/* Action buttons */}
        <Box sx={{ display: "flex", gap: 2 }}>
          <Link to="/edit-company-profile">
            <Button
              variant="outlined"
              sx={{ padding: "12px", backgroundColor: "var(--primary-color)", color: "white" }}
            >
              Edit Profile
            </Button>
          </Link>         
        </Box>

      </Box>
    );
  }

  // No company yet show create form
  return (
    <>
      <FormPage
        config={{
          title: "Create Company Profile",
          subtitle: "You need a company profile before you can post jobs.",
          submitLabel: "Create Profile",
          fields: [
            {
              name: "name",
              label: "Company Name",
              type: "text",
              required: true,
              validators: [required("Company Name")],
            },
            {
              name: "contact_email",
              label: "Contact Email",
              type: "email",
              required: true,
              validators: [required("Contact Email"), email],
            },
            {
              name: "contact_phone",
              label: "Contact Phone",
              type: "tel",
              required: true,
              validators: [required("Contact Phone"), phone],
            },
            {
              name: "year_founded",
              label: "Year Founded",
              type: "text",
              validators: [date],
            },
            {
              name: "description",
              label: "Company Description",
              type: "textarea",
              rows: 4,
              required: true,
              validators: [
                required("Company Description"),
                minLength("Company Description", 20),
                maxLength("Company Description", 500),
              ],
            },
          ],
        }}
        formValues={formData}
        onSubmit={handleSubmit}
        submitError={submitError}
        successMessage={successMessage}
        onChange={handleChange}
      />
      <ModalComponent
        open={isModalOpen}
        message="Profile created successfully! Your company is now pending admin approval."
        onClose={() => setIsModalOpen(false)}
      />
    </>
  );
}

export default CompanyProfilePage;