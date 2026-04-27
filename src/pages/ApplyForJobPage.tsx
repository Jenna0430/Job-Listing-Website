import { useState, type JSX } from "react";
import { Box, TextField, Button, Typography, CircularProgress } from "@mui/material";
import { useParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import ModalComponent from "../components/ModalComponent";
import FileUpload from "../components/FileUpload";
import { useSubmitApplication } from "../hooks/genaralHooks";

interface ApplyFormData {
  full_name:    string;
  email:        string;
  phone:        string;
  coverLetter:  File | null;
  resume:       File | null;
}

const initialData: ApplyFormData = {
  full_name:   "",
  email:       "",
  phone:       "",
  coverLetter: null,
  resume:      null,
};

function ApplyForJobPage(): JSX.Element {
  const { id: jobId }   = useParams<{ id: string }>();
  const { user }        = useAuth();
  const [formData, setFormData]     = useState<ApplyFormData>(initialData);
  const [fileNames, setFileNames]   = useState({ coverLetter: "No file chosen", resume: "No file chosen" });
  const [isModalOpen, setIsModalOpen] = useState(false);

  // ── TanStack mutation ─────────────────────────────────────────────────────
  const { mutate: submitApplication, isPending, error } = useSubmitApplication();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const { name, files } = e.target;
    if (files && files.length > 0) {
      setFormData(prev => ({ ...prev, [name]: files[0] }));
      setFileNames(prev => ({ ...prev, [name]: files[0]!.name }));
    }
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>): void => {
    e.preventDefault();
    if (!jobId || !user) return;

    submitApplication(
      {
        formData: {
          job_id:    jobId,
          full_name: formData.full_name,
          email:     formData.email,
          phone:     formData.phone,
        },
        cvFile:          formData.resume,
        coverLetterFile: formData.coverLetter,
      },
      {
        onSuccess: () => {
          setFormData(initialData);
          setFileNames({ coverLetter: "No file chosen", resume: "No file chosen" });
          setIsModalOpen(true);
        },
      }
    );
  };

  return (
    <Box sx={{ maxWidth: "600px", margin: "40px auto", padding: "0 20px" }}>
      <Typography variant="h4" mb={3}>Submit Application</Typography>

      <Box component="form" onSubmit={handleSubmit} sx={{ display: "flex", flexDirection: "column", gap: "20px" }}>
        <TextField
          label="Full Name"
          name="full_name"
          value={formData.full_name}
          onChange={handleChange}
          fullWidth
          required
        />

        <TextField
          label="Email"
          name="email"
          type="email"
          value={formData.email}
          onChange={handleChange}
          fullWidth
          required
        />

        <TextField
          label="Phone"
          name="phone"
          value={formData.phone}
          onChange={handleChange}
          fullWidth
          required
        />

        <FileUpload
          name="coverLetter"
          label="Upload Cover Letter"
          accept=".pdf,.doc,.docx"
          onChange={handleFileChange}
          fileName={fileNames.coverLetter}
        />

        <FileUpload
          name="resume"
          label="Upload Resume"
          accept=".pdf,.doc,.docx"
          onChange={handleFileChange}
          fileName={fileNames.resume}
        />

        {/* Error message */}
        {error && (
          <Typography color="error" variant="body2">{error.message}</Typography>
        )}

        <Button
          type="submit"
          variant="contained"
          disabled={isPending}
          sx={{ backgroundColor: "var(--primary-color)", color: "white", padding: "12px" }}
        >
          {isPending
            ? <><CircularProgress size={18} color="inherit" sx={{ mr: 1 }} /> Submitting...</>
            : "Submit Application"
          }
        </Button>
      </Box>

      <ModalComponent
        open={isModalOpen}
        message="Application submitted successfully!"
        onClose={() => setIsModalOpen(false)}
      />
    </Box>
  );
}

export default ApplyForJobPage;