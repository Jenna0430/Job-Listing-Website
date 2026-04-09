import { useState, type JSX } from "react";
import { useParams, useLoaderData, Link, useNavigate } from "react-router-dom";
import { Box, Button, Card, CardContent } from "@mui/material";
import { useAuth } from "../context/AuthContext";
import supabase from "../api/SupabaseClient";
import type { Job } from "../types/job.types";


export const jobLoader = async ({ params }: 
    { params?: { id: string }; }): Promise<Job> => {
    const { data, error } = await supabase.from("jobs").select("*, companies(*)").eq("id", params?.id).single();

    if (error || !data) {
      throw new Error(error?.message || "Job not found");
    }

    return data;  
    } 

  function JobPage(): JSX.Element {


    const job = useLoaderData() as Job;
    const { user, role, openAuthModal } = useAuth();
    const navigate = useNavigate();
    const isOwner = user?.id === job.posted_by;

    console.log("Full job data:", job);
    console.log("Companies data:", job.companies);

    const handleApplyClick = (): void => {
      if (!user) {
        openAuthModal();
        return;
      }
      navigate("/apply");
    };

    const handleDelete = async (): Promise<void> => {
      const confirmDelete = window.confirm("Are you sure you want to delete this job?");
      if (!confirmDelete) return;

      const { error } = await supabase.from("jobs").delete().eq("id", job.id);
      if (error) {
        console.error("Error deleting job:", error);
        return;
      }
      navigate("/jobs");
    }



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
              <p>{job.companies.name}</p>
              <p>Founded: {job.companies.year_founded}</p>
              <p>{job.companies.description}</p>
              <p>Contact Email: </p>
              <p style={{ backgroundColor: "var(--primary-color-light)", padding: "10px" }}>{job.companies.contact_email}</p>
              <p>Contact Phone: </p>
              <p style={{ backgroundColor: "var(--primary-color-light)", padding: "10px" }}>{job.companies.contact_phone}</p>
              {role === "employer" ? "" : (
              <Link to="/apply">
                <Button 
                onClick={handleApplyClick}
                variant="contained"
                style={{ backgroundColor: "var(--primary-color)", color: "white", border: "none", padding: "10px 20px", marginTop: "10px" }}>
                  Apply
                </Button>
              </Link>
              )}

              {isOwner && (
                 <Box sx={{ display: "flex", gap: "10px", marginTop: "20px" }}>
                  <Button
                    variant="contained"
                    component={Link}
                    to={`/edit-job/${job.id}`}
                    sx={{ backgroundColor: "var(--primary-color)", color: "white" }}
                  >
                    Edit Job
                  </Button>

                  <Button
                    variant="outlined"
                    onClick={handleDelete}
                    sx={{ borderColor: "red", color: "red" }}
                  >
                    Delete Job
                  </Button>
            </Box>
              )}
            </CardContent>
          </Card>
        
        </div>
       
        </div>
    );
  }

export default JobPage