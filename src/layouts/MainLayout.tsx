import { Outlet } from "react-router-dom"
import { Navbar, Footer, AuthModal } from "../components"
import type { JSX } from "react"
import { useAuth } from "../context/AuthContext";

const MainLayout = (): JSX.Element => {
  const { authModalOpen, closeAuthModal } = useAuth();
  return (
    <>
      <Navbar />
      <Outlet />
      <Footer />
      <AuthModal open={authModalOpen} onClose={closeAuthModal} />
    </>
  )
}

export default MainLayout
