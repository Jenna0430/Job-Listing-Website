import { Card, CardContent, Button, Box } from "@mui/material"
import { useState } from "react"
import { Link } from "react-router-dom";
import type { JSX } from "react";
import { useAuth } from "../context/AuthContext";
import type { Job } from "../type/job.types";


interface JobListingProps {
    job: Job;
}


function JobListing({ job }: JobListingProps): JSX.Element {

  const {  role } = useAuth();
  const [showFullDesc, setShowFullDesc] = useState(false);


  let description: string = job.description;
  if (!showFullDesc && description.length > 90) {
    description = description.substring(0, 90) + "...";
  }

  return (
    <Card  sx={{ width:"100%", boxShadow: "1px 1px 5px var(--primary-color)" }}>
      <CardContent>
        <p>{job.type}</p>
        <h2>{job.title}</h2>
        <p>{description}</p>
        <button style={{ border: "none", color: "var(--secondary-color)", backgroundColor: "white" }} onClick={() => setShowFullDesc((prev) => !prev)}>
          {showFullDesc ? "Show Less" : "Show More"}
        </button>
        <h3>Salary: {job.salary}/Year</h3>
        <p>{job.location}</p>

          {job.companies?.name && (
            <p style={{ color: "gray", fontSize: "0.85rem" }}>
              {job.companies.name}
            </p>
          )}

        <Link to={`/jobs/${job.id}`} style={{ textDecoration: "none" }}>
        <Button
          sx={{ backgroundColor: "var(--primary-color)", color: "white" }}
          variant="contained"
        >{role === "employer" ? "View Details" : "Apply Now"}</Button>
        </Link>
      </CardContent>
    </Card>
  )
}

export default JobListing