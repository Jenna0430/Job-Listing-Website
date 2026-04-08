import { Button, Box, Typography } from "@mui/material";
import UploadFileIcon from "@mui/icons-material/UploadFile";
import { useState } from "react";
import type { JSX } from "react";
import type { ChangeEvent } from "react";


interface FileUploadProps {
  name: string;
  label: string;
  accept?: string; 
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  fileName: string;
}

function FileUpload({name, label, accept, onChange, fileName}: FileUploadProps): JSX.Element {

  return (
    <Box sx={{ display: "flex", alignItems: "center", gap: "12px" }}>
      
      <Button
        component="label" 
        variant="outlined"
        startIcon={<UploadFileIcon />}
        sx={{ borderColor: "var(--primary-color)", color: "var(--primary-color)" }}
      >
        {label}
        <input
          type="file"
          name={name}
          hidden             
          onChange={onChange}
          accept={accept} 
        />
      </Button>

      <Typography variant="body2" sx={{ color: "gray" }}>
        {fileName}
      </Typography>

    </Box>
  );
}

export default FileUpload;