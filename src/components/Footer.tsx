import React, { type JSX } from 'react'

function Footer(): JSX.Element {
  return (
    <footer style={{ backgroundColor: "var(--primary-color)", color: "white", textAlign: "center", padding: "20px", width:"100%" }}>
      <div>
        <h2>Contact Us</h2>
        <p>Email: info@findjobs.com</p>
      <p>&copy; {new Date().getFullYear()} Find Jobs. All rights reserved.</p>
      </div>
    </footer>
  )
}
export default Footer