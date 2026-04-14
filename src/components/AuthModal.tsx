import { Modal, Box, Fade, TextField, Button, Typography, Tabs, Tab } from "@mui/material";
import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import type { JSX } from "react";

interface AuthModalProps {
  open: boolean;
  onClose: () => void;
}

function AuthModal({ open, onClose }: AuthModalProps): JSX.Element {
  const { signIn, signUp } = useAuth();

  const [tab, setTab] = useState<0 | 1>(0); // 0 = Sign In, 1 = Sign Up
  const [email, setEmail] = useState("");
  const [fullName, setFullName] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<"employer" | "applicant">("applicant");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);

  const resetForm = (): void => {
    setFullName("");
    setEmail("");
    setPassword("");
    setError(null);
    setLoading(false);
    setEmailSent(false);
  };

  const handleTabChange = (_: React.SyntheticEvent, newValue: 0 | 1): void => {
    setTab(newValue);
    resetForm();
  };

  const handleSubmit = async (e: React.SubmitEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const result = tab === 0
      ? await signIn(email, password)
      : await signUp(email, password, role, fullName);

    if(result === "A confirmation email has been sent. Please check your inbox.") { 
      setLoading(false);
      setEmailSent(true);
      return;
    }
    if (result) {
      setError(result);
      setLoading(false);
    } else {
      resetForm();
      onClose(); // close modal on success
    }
  };

  return (
    <Modal open={open} onClose={onClose}>
      <Fade in={open}>
        <Box sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          backgroundColor: "white",
          borderRadius: "12px",
          padding: "40px",
          width: { xs: "90%", sm: "440px" },
          outline: "none",
        }}>
          {emailSent ?  
          (
            //confirmation message after sign up
          <Box sx={{ textAlign: "center" }}>
            <Typography variant="h5" sx={{ fontWeight: "bold", marginBottom: "16px" }}>
              Check your email 📬
            </Typography>
            <Typography variant="body1" sx={{ color: "gray", marginBottom: "24px" }}>
              We sent a verification link to <strong>{email}</strong>.
              Click the link in that email to activate your account, then come back to sign in.
            </Typography>
            <Button
              variant="outlined"
              fullWidth
              onClick={() => {
                setEmailSent(false);
                setTab(0);    // switch to Sign In tab
                resetForm();  // clear the form
              }}
              sx={{ borderColor: "var(--primary-color)", color: "var(--primary-color)" }}
            >
              Back to Sign In
            </Button>
          </Box>
        ) : (
          <>
          <Typography variant="h5" sx={{ fontWeight: "bold", marginBottom: "8px" }}>
            Welcome to FindJobs
          </Typography>

        
          <Tabs value={tab} onChange={handleTabChange} sx={{ marginBottom: "24px" }}>
            <Tab label="Sign In" />
            <Tab label="Sign Up" />
          </Tabs>

          <Box component="form" onSubmit={handleSubmit} sx={{ display: "flex", flexDirection: "column", gap: "16px" }}>

            <TextField
              label="Full Name"
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              fullWidth
              required
            />
            <TextField
              label="Email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              fullWidth
              required
            />

            <TextField
              label="Password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              fullWidth
              required
            />

            {tab === 1 && (
              <Box sx={{ display: "flex", gap: "12px" }}>
                {(["employer", "applicant"] as const).map((r) => (
                  <Button
                    key={r}
                    type="button"
                    variant={role === r ? "contained" : "outlined"}
                    onClick={() => setRole(r)}
                    fullWidth
                    sx={{
                      backgroundColor: role === r ? "var(--primary-color)" : "transparent",
                      color: role === r ? "white" : "var(--primary-color)",
                      borderColor: "var(--primary-color)",
                      textTransform: "capitalize",
                    }}
                  >
                    {r === "applicant" ? "Applicant" : "Employer"}
                  </Button>
                ))}
              </Box>
            )}

            {/* Error message */}
            {error && (
              <Typography variant="body2" sx={{ color: "red" }}>
                {error}
              </Typography>
            )}

            <Button
              type="submit"
              variant="contained"
              fullWidth
              disabled={loading}
              sx={{ backgroundColor: "var(--primary-color)", color: "white", padding: "12px" }}
            >
              {loading ? "Please wait..." : tab === 0 ? "Sign In" : "Sign Up"}
            </Button>
          </Box>
          </>
        )}
        </Box>
      </Fade>
    </Modal>
  );
}

export default AuthModal;