import { CardActions, CardContent } from "@mui/material"
import Button from "@mui/material/Button"
import Card from "@mui/material/Card"
import type { JSX } from "react"
import { Link } from "react-router-dom"
import { useAuth } from "../context/AuthContext"

function HomeCards(): JSX.Element { 
    const {user, role, openAuthModal} = useAuth();
    return (
        <section>
         <div style={{ display: "flex", justifyContent: "center", gap: "20px", padding: "40px" }}>

            <Card sx={{ maxWidth: '60%', boxShadow: "1px 1px 5px var(--primary-color)" }} >
                <CardContent>
                <h2>For Developers</h2>
                <p>Find the perfect job that matches your skills and interests.</p>

                <CardActions>
                    <Link to="/jobs">
                        <Button sx={{ backgroundColor: "var(--primary-color)", color: "white" }} variant="contained">
                            Browse Jobs
                        </Button>
                    </Link>
                </CardActions>
                </CardContent>
            </Card>

            <Card sx={{ maxWidth: '60%', boxShadow: "1px 1px 5px var(--primary-color)" }} >
                <CardContent>
                <h2>For Employers</h2>
                <p>List your job openings and reach thousands of qualified candidates.</p>

                <CardActions>
                    {role === "employer" ? (
                        <Link to="/add-job">
                        <Button
                            sx={{ backgroundColor: "var(--primary-color)", color: "white" }}
                            variant="contained"
                        >
                            Add Job
                        </Button>
                        </Link>
                        ) : role === "applicant" ? (
                        <Button 
                            variant="contained"
                            disabled
                            title={user ? "Only employers can post jobs" : "Sign in as an employer to post jobs"}
                            sx={{ backgroundColor: "var(--primary-color)", color: "white", cursor: "not-allowed" }}>
                            Add Jobs
                        </Button>
                    ): (
                         <Button
                            variant="contained"
                            onClick={openAuthModal}
                            sx={{ backgroundColor: "var(--primary-color)", color: "white" }}
                            >
                            Add Job
                            </Button>
                       ) }
                </CardActions>
                </CardContent>
            </Card>

            </div>
        </section>
       
    )
}  
export default HomeCards