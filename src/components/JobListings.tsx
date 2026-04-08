import { useState, useEffect } from "react";
import JobListing from "./JobListing"
import { Grid, Box, CircularProgress } from "@mui/material"
import type { JSX } from "react";
import type { job } from "./JobListing";
import axiosInstance from "../api/AxiosInstance";
import axios from "axios";

interface JobListingsProps {
  isHomePage?: boolean;
}

function JobListings({ isHomePage = false }: JobListingsProps):  JSX.Element {

  const [listJobs, setListJobs] = useState<job[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchJobs = async (): Promise<void> => {
    try {
      const { data } = await axiosInstance.get<job[]>("/jobs");
      setListJobs(isHomePage ? data.slice(0, 3) : data);
      setLoading(false);
      } catch (error) {
        if(axios.isAxiosError(error)) {
          throw new Error(`Error fetching jobs: ${error.message}`);
        } else {
          throw new Error(`Unexpected error: ${error}`);
        }
      } finally {(() => {
        setLoading(false);
       })()}
   };

  useEffect(() => {
    fetchJobs();
  }, [isHomePage]);

  return (
    <Box sx={{ padding: "10px 40px 60px", backgroundColor: "var(--primary-color-light)", color: "var(--text-color)"}}>
      
      <div style={{ textAlign: "center", marginBottom: "10px"}}>
        <h1>{isHomePage ? "Recent Jobs" : "Browse Jobs"}</h1>
        <p>Explore our latest job openings and find your next career opportunity.</p>
      </div>

      <Grid container spacing={3} sx={{ marginTop: "20px" }}>
        {/* add a spinner */}
        { loading ? (
         <Box sx={{ display: "flex", justifyContent: "center", padding: "40px" }}>
          <CircularProgress sx={{ color: "var(--primary-color)" }} />
        </Box>
        ) : (
          <>
          {listJobs.map((job) => (
          <Grid  key={job.id} 
           size={{ xs: 12, sm: 12, md: 6, lg: 4 }}
           sx={{ display: "flex", justifyContent: "center" }}>
            <Box sx={{ width: { xs: "100%", sm: "100%", md: "100%" } }}>
            <JobListing job={job} />
            </Box>
          </Grid>
        ))} 
        </>
        )}
      </Grid>

    </Box>
  )
}

export default JobListings