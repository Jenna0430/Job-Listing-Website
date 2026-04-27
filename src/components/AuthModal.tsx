import { Modal, Box, Fade, TextField, Button, Typography, Tabs, Tab, CircularProgress } from "@mui/material";
import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { useAuth } from "../context/AuthContext";
import type { JSX } from "react";

interface AuthModalProps {
  open: boolean;
  onClose: () => void;
}

function AuthModal({ open, onClose }: AuthModalProps): JSX.Element {
  const { signIn, signUp } = useAuth();

  const [tab, setTab]         = useState<0 | 1>(0);
  const [email, setEmail]     = useState("");
  const [fullName, setFullName] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole]       = useState<"employer" | "applicant">("applicant");
  const [emailSent, setEmailSent] = useState(false);

  const resetForm = (): void => {
    setFullName(""); setEmail(""); setPassword("");
    setEmailSent(false);
  };

  const handleTabChange = (_: React.SyntheticEvent, newValue: 0 | 1): void => {
    setTab(newValue);
    resetForm();
    mutation.reset(); // clear previous errors
  };

  // ── TanStack mutation — handles both signIn and signUp ────────────────────
  const mutation = useMutation({
    mutationFn: async () => {
      if (tab === 0) {
        return signIn(email, password);
      } else {
        return signUp(email, password, role, fullName);
      }
    },
    onSuccess: (result) => {
      if (result === "CHECK_EMAIL") {
        setEmailSent(true);
        return;
      }
      if (result) {
        // result is an error string — re-throw so onError handles it
        throw new Error(result);
      }
      // null result = success
      resetForm();
      onClose();
    },
    onError: () => {
      // error is displayed via mutation.error below
    },
  });

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>): void => {
    e.preventDefault();
    mutation.mutate();
  };

  return (
    <Modal open={open} onClose={onClose}>
      <Fade in={open}>
        <Box sx={{
          position: "absolute", top: "50%", left: "50%",
          transform: "translate(-50%, -50%)",
          backgroundColor: "white", borderRadius: "12px",
          padding: "40px", width: { xs: "90%", sm: "440px" }, outline: "none",
        }}>

          {emailSent ? (
            <Box sx={{ textAlign: "center" }}>
              <Typography variant="h5" sx={{ fontWeight: "bold", marginBottom: "16px" }}>
                Check your email 📬
              </Typography>
              <Typography variant="body1" sx={{ color: "gray", marginBottom: "24px" }}>
                We sent a verification link to <strong>{email}</strong>.
                Click the link to activate your account, then come back to sign in.
              </Typography>
              <Button
                variant="outlined"
                fullWidth
                onClick={() => { setEmailSent(false); setTab(0); resetForm(); }}
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
                  label="Email" type="email" value={email}
                  onChange={e => setEmail(e.target.value)} fullWidth required
                />
                <TextField
                  label="Password" type="password" value={password}
                  onChange={e => setPassword(e.target.value)} fullWidth required
                />

                {tab === 1 && (
                  <>
                    <TextField
                      label="Full Name" type="text" value={fullName}
                      onChange={e => setFullName(e.target.value)} fullWidth required
                    />
                    <Box sx={{ display: "flex", gap: "12px" }}>
                      {(["employer", "applicant"] as const).map(r => (
                        <Button
                          key={r} type="button"
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
                  </>
                )}

                {/* Error from mutation */}
                {mutation.error && (
                  <Typography variant="body2" color="error">
                    {mutation.error.message}
                  </Typography>
                )}

                <Button
                  type="submit"
                  variant="contained"
                  fullWidth
                  disabled={mutation.isPending}
                  sx={{ backgroundColor: "var(--primary-color)", color: "white", padding: "12px" }}
                >
                  {mutation.isPending
                    ? <CircularProgress size={20} color="inherit" />
                    : tab === 0 ? "Sign In" : "Sign Up"
                  }
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