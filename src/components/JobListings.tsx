import { useState, useEffect } from "react";
import JobListing from "./JobListing"
import { Grid, Box, CircularProgress, Typography } from "@mui/material"
import type { JSX } from "react";
import type { Job } from "../type/job.types";
import { useAuth } from "../context/AuthContext";
import { getAllJobs, getEmployerJobs} from "../api"

interface JobListingsProps {
  isHomePage?: boolean;
}

function JobListings({ isHomePage = false }: JobListingsProps):  JSX.Element {

  const { user, role, loading: authLoading } = useAuth();
  const [listJobs, setListJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState<string | null>(null);

   useEffect(() => {

    if (authLoading) return;

    if (!user) setListJobs([]);

    const fetchJobs = async (): Promise<void> => {
        setLoading(true);
        setFetchError(null);

        const result = role === "employer" && user ?
        await getEmployerJobs(user.id, isHomePage ? 3 : undefined) :
        await getAllJobs(isHomePage ? 3 : undefined)
        
        if (!result.success){
            setFetchError(result.error);
            setLoading(false);
            return;
        }

        setListJobs(result.data);
        setLoading(false);

    };
        
      fetchJobs();

    }, [isHomePage, role, user, authLoading]);

       
  return (
    <Box sx={{ padding: "10px 40px 60px", backgroundColor: "var(--primary-color-light)", color: "var(--text-color)"}}>
      
      <div style={{ textAlign: "center", marginBottom: "10px"}}>
        <h1>{isHomePage ? "Recent Jobs" : "Browse Jobs"}</h1>
        <p>{role === "employer"
          ? "Manage your job postings and view applications."
          : "Explore our latest job openings and find your next career opportunity."}</p>
      </div>

      <Grid container spacing={3} sx={{ marginTop: "20px" }}>
        {/* add a spinner */}
        { loading ? (
         <Box sx={{ display: "flex", justifyContent: "center", padding: "40px" }}>
          <CircularProgress sx={{ color: "var(--primary-color)" }} />
        </Box>
        ) :  fetchError ? (
           <Box sx={{ textAlign: "center", width: "100%", padding: "40px" }}>
            <Typography color="error">{fetchError}</Typography>
          </Box>
        ) : listJobs.length === 0 ? (
            <Box sx={{ textAlign: "center", width: "100%", padding: "40px" }}>
                <Typography>
                  {role === "employer"
                    ? "You have not posted any jobs yet."
                    : "No jobs available at the moment."}
                </Typography>
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