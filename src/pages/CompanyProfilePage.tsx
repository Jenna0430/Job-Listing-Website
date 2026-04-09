import { Box, Button, Typography } from "@mui/material";
import { useState, useEffect } from "react";
import type { JSX } from "react";
import supabase from "../api/SupabaseClient";
import { useAuth } from "../context/AuthContext";
import { FormPage, ModalComponent } from "../components";
import { required, minLength, maxLength, email, phone, date } from "../helper/FormValidator";
import type { Company } from "../types/job.types";
import { Link } from "react-router-dom";


function CompanyProfilePage(): JSX.Element {
  const { user } = useAuth();
  const [company, setCompany] = useState<Company | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [formData, setFormData] = useState<Record<string, string>>({
    name: "",
    description: "",
    contact_email: "",
    contact_phone: "",
    year_founded: "",
  });

  // Check if employer already has a company profile
  useEffect(() => {
    const fetchCompany = async (): Promise<void> => {
      if (!user) return;

      const { data } = await supabase
        .from("companies")
        .select("*")
        .eq("owner_id", user.id)
        .single();

      if (data) {
        // Pre-fill form with existing data
        setCompany(data);
        setFormData({
          name: data.name,
          description: data.description ?? "",
          contact_email: data.contact_email ?? "",
          contact_phone: data.contact_phone ?? "",
          year_founded: data.year_founded ?? "",
        });
      }

      setLoading(false);
    };

    fetchCompany();
  }, [user]);

  const handleChange = (name: string, value: string): void => {
     setFormData((prev) => ({ ...prev, [name]: value }));
  }

  const handleSubmit = async (
    e: React.FormEvent<HTMLFormElement>
  ): Promise<void> => {
    e.preventDefault();
    setSubmitError(null);
    setSuccessMessage(null);

    if (!user) return;

    if (company) {
      // Company exists — update it
      const { error } = await supabase
        .from("companies")
        .update(formData)
        .eq("owner_id", user.id);

      if (error) { setSubmitError(error.message); return; }
      setSuccessMessage("Company profile updated successfully!");

    } else {
      // No company yet — create it
      const { error } = await supabase
        .from("companies")
        .insert([{ ...formData, owner_id: user.id }]);

      if (error) { setSubmitError(error.message); return; }
      setIsModalOpen(true);
      setSuccessMessage("Company profile created successfully!");
    }
  };

  if (loading) return <Typography>Loading...</Typography>;

  return company ?   
        <Box sx={{ maxWidth: "600px", height: "100%", margin: "8% auto", padding: "0 20px" }}>
           <h1>Company Profile</h1>
            <Box >
                <p>Company Name: {company.name}</p>
                <p>Company Description: {company.description}</p>
                <p>Contact Email: {company.contact_email}</p>
                <p>Contact Phone: {company.contact_phone}</p>
                <p>Year Founded: {company.year_founded}</p>
            </Box>
                <Link to="/edit-company-profile">
                <Button
                    type="submit"
                    variant="contained"
                    sx={{ backgroundColor: "var(--primary-color)", color: "white", padding: "12px" }}
                    >Edit Profile
                    </Button>
                </Link>
            </Box>
   : 
   <>
   <FormPage
        config = {{
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
            validators: [required("Company Description"), minLength("Company Description", 20), maxLength("Company Description", 500)],
            }
            ]
        }}
        formValues={formData}
        onSubmit={handleSubmit}
        submitError={submitError}
        successMessage={null}
        onChange={handleChange}
      />
        <ModalComponent
        open={isModalOpen}
        message="profile created successfully!"
        onClose={() => setIsModalOpen(false)}
      />
    </>     
   
}
  

export default CompanyProfilePage;