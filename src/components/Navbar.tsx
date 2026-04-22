import logo from '../assets/logo.png';
import { AppBar, Box, Toolbar, Button } from '@mui/material';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import type { JSX } from 'react';



function Navbar(): JSX.Element {
  const { user, role, signOut, openAuthModal, fullName } = useAuth();

  const activeStyle = ({ isActive }: { isActive: boolean }): string =>
    isActive ? 'nav-link active' : 'nav-link';

  return (
    <>
      <Box sx={{ flexGrow: 1 }}>
        <AppBar position="static" sx={{ backgroundColor: "var(--primary-color)" }}>
          <Toolbar sx={{ display: 'flex', justifyContent: 'space-between' }}>

            {/* Logo */}
            <div className='nav-div' style={{ display: "flex", alignItems: "center" }}>
              <img src={logo} alt="Logo" style={{ height: "40px", marginRight: "10px" }} />
              <span>FindJobs</span>
            </div>

            {/* Nav Links */}
            <div className='nav-div'>
              <NavLink to="/" className={activeStyle}>Home</NavLink>
              <NavLink to="/jobs" className={activeStyle}>Jobs</NavLink>

              {/* only clickable for employers */}
              {role == "employer" && (
                <>
                  <NavLink to="/add-job" className={activeStyle}>Add Job</NavLink>
                  <NavLink to="/company-profile" className={activeStyle}>
                    Company Profile
                </NavLink>
                </> 
                ) } 
            </div>

              {/* Auth Buttons and User Info */}
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              {user ? (
                <>
                  <span style={{
                    color: "white",
                    fontSize: "0.8rem",
                    backgroundColor: "var(--primary-color)",
                    padding: "4px 10px",
                    borderRadius: "20px"
                  }}>
                    {role === "employer" ? "Employer" : "Applicant"} - {fullName ?? user.email}
                  </span>

                  <NavLink to="/">
                  <Button
                    onClick={signOut}
                    variant="outlined"
                    size="small"
                    sx={{ color: "white", borderColor: "white", textTransform: "none" }}
                  >
                    Sign Out
                  </Button>
                  </NavLink>
                </>
              ) : (
                <Button
                  onClick={openAuthModal}
                  variant="outlined"
                  size="small"
                  sx={{ color: "white", borderColor: "white", textTransform: "none" }}
                >
                  Sign In / Register
                </Button>
              )}
            </div>

          </Toolbar>
        </AppBar>
      </Box>
    </>
  );
}

export default Navbar;