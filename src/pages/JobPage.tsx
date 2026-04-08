import type { JSX } from "react";
import { useParams, useLoaderData, Link } from "react-router-dom";
import type { job } from "../components/JobListing";
import { Button, Card, CardContent } from "@mui/material";
import axiosInstance from "../api/AxiosInstance";
import axios from "axios";

interface JobPageProps extends job {
  company: {
    name: string;
    description: string;
    contactEmail: string;
    contactPhone: string;
    yearFounded: string;
  };
}


export const jobLoader = async ({ params }: 
    { params?: { id: string }; }): Promise<job> => {
    try {
    const { data } = await axiosInstance.get<job>(`/jobs/${params?.id}`);
    return data;  
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error(`Axios error fetching job data: ${error.message}`);
      } else {  
        throw new Error("Error fetching job data");
      }
    } 
  };


  function JobPage(): JSX.Element {
    const job = useLoaderData() as JobPageProps;

    return (
      <div style={{ padding: "40px", backgroundColor: "var(--primary-color-light)", color: "var(--text-color)"}}>
        <Link to="/jobs">← Back to Jobs</Link>

        <div style={{ display: "flex", justifyContent: "space-between"}}>
            <div style={{ flex: 1, marginRight: "20px", width: "100%" }}>
              <Card sx={{ marginTop: "20px", boxShadow: "1px 1px 5px var(--primary-color)" }}>
              <CardContent>
                <p>{job.type}</p>
                <h1 style={{ paddingLeft: "20px"}}>{job.title}</h1>
                <p style={{ color: "var(--secondary-color)", paddingLeft:"20px"}}>{job.location}</p>
              </CardContent>
            </Card>

            <Card sx={{ marginTop: "20px", boxShadow: "1px 1px 5px var(--primary-color)" }}>
              <CardContent>
                <h3>Job Description</h3>
                <p>{job.description}</p>
                <p>Salary: {job.salary}/Year</p>
              </CardContent>
            </Card>
          </div>

          <Card sx={{ marginTop: "20px", width: "350px", boxShadow: "1px 1px 5px var(--primary-color)" }}>
            <CardContent>
              <h3>Company Info</h3>
              <p>{job.company.name}</p>
              <p>Founded: {job.company.yearFounded}</p>
              <p>{job.company.description}</p>
              <p>Contact Email: </p>
              <p style={{ backgroundColor: "var(--primary-color-light)", padding: "10px" }}>{job.company.contactEmail}</p>
              <p>Contact Phone: </p>
              <p style={{ backgroundColor: "var(--primary-color-light)", padding: "10px" }}>{job.company.contactPhone}</p>
              <Link to="/apply">
                <Button style={{ backgroundColor: "var(--primary-color)", color: "white", border: "none", padding: "10px 20px", marginTop: "10px" }}>
                  Apply
                </Button>
              </Link>
            </CardContent>
          </Card>
        
        </div>
        
       
        </div>
    );
  }

export default JobPage