import { useState, type JSX } from "react";
import {
  Box,
  TextField,
  Button,
} from "@mui/material";
import ModalComponent from "../components/ModalComponent";
import FileUpload from "../components/FileUpload";

interface ApplyFormData {
  applicantName: string;
  applicantEmail: string;
  applicantPhone: string;
  coverLetter: File | null;
  resume: File | null;  
}

const initialApplyData: ApplyFormData = {
    applicantName: "",
    applicantEmail: "",
    applicantPhone: "",
    coverLetter: null,
    resume: null,
};


function ApplyForJobPage(): JSX.Element {

    const [applyData, setApplyData] = useState<ApplyFormData>(initialApplyData);
    const [fileNames, setFileNames] = useState<Record<string, string>>({
      coverLetter: "No file chosen",
      resume: "No file chosen", 
    });
    const [isModalOpen, setIsModalOpen] = useState(false);
    
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
        const { name, value } = e.target;
        setApplyData(prev => ({ ...prev, [name]: value }));
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
        const { name, files } = e.target;
        if (files && files.length > 0) {
            setApplyData(prev => ({ ...prev, [name]: files[0] }));
            setFileNames((prev) => ({ ...prev, [name]: files[0]!.name }));
        }   
    };

    const handleSubmit = (e: React.SubmitEvent<HTMLFormElement>): void => {
        e.preventDefault();
        // Handle form submission logic here 
        setApplyData(initialApplyData);
        setFileNames({
          coverLetter: "No file chosen",
          resume: "No file chosen", 
        });
        setIsModalOpen(true);
    };

    return (
        <Box sx={{ maxWidth: "600px", margin: "40px auto", padding: "0 20px" }}>
      <h1>Submit Application</h1>

      <Box component="form" onSubmit={handleSubmit} sx={{ display: "flex", flexDirection: "column", gap: "20px" }}>

        <TextField
          label="Applicant Name"
          name="applicantName"
          value={applyData.applicantName}
          onChange={handleChange}
          variant="outlined"
          fullWidth
          required
        />

        <TextField
          label="Applicant Email"
          name="applicantEmail"
          value={applyData.applicantEmail}
          onChange={handleChange}
          variant="outlined"
          multiline     
          rows={4}
          fullWidth
          required
        />

        <TextField
          label="Applicant Phone"
          name="applicantPhone"
          value={applyData.applicantPhone}
          onChange={handleChange}
          variant="outlined"
          fullWidth
          required
        />

        <FileUpload 
          name="coverLetter"
          label="Upload Cover Letter"
          accept=".pdf, .doc, .docx"
          onChange={handleFileChange}
          fileName={fileNames.coverLetter || "No file chosen"}
        />

        <FileUpload
          name="resume" 
          label="Upload Resume"
          accept=".pdf, .doc, .docx"
          onChange={handleFileChange}
          fileName={fileNames.resume || "No file chosen"}
        />

        <Button
          type="submit"
          variant="contained"
          sx={{ backgroundColor: "var(--primary-color)", color: "white", padding: "12px" }}
        >
          Submit
        </Button>
      </Box>

      <ModalComponent 
      open={isModalOpen} 
      message="Application sent successfully!" 
      onClose={() => setIsModalOpen(false)} />
    </Box>
    )
}
export default ApplyForJobPage;