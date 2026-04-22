import { Outlet } from "react-router-dom"
import { Navbar, Footer, AuthModal } from "../components"
import type { JSX } from "react"
import { useAuth } from "../context/AuthContext";
import {Box } from "@mui/material";

const MainLayout = (): JSX.Element => {
  const { authModalOpen, closeAuthModal } = useAuth();
  return (
    <Box sx={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
      <Navbar />
      <Box component="main" sx={{ flex: 1 }}>
        <Outlet /> 
      </Box>
      <Footer />
      <AuthModal open={authModalOpen} onClose={closeAuthModal} />
    </Box>
  )
}

export default MainLayout
