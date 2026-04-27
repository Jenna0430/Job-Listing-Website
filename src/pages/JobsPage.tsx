import { useState, type JSX } from "react";
import {
  Box, TextField, MenuItem, Select, FormControl,
  InputLabel, InputAdornment, Typography, CircularProgress
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import JobListings from "../components/JobListings";
import { useDebounce,  useJobListings } from "../hooks/genaralHooks";


const JOB_TYPES = ["Full-Time", "Part-Time", "Remote", "Internship"];

function JobsPage(): JSX.Element {
  const [search,   setSearch]   = useState("");
  const [type,     setType]     = useState("");
  const [location, setLocation] = useState("");

  // Debounce search and location — waits 400ms after user stops typing
  // before sending a request. Type is a select so no debounce needed.
  const debouncedSearch   = useDebounce(search,   400);
  const debouncedLocation = useDebounce(location, 400);

  const filters = {
    search:   debouncedSearch   || undefined,
    type:     type              || undefined,
    location: debouncedLocation || undefined,
  };

  const { data: jobs = [], isLoading, isFetching } = useJobListings(false, filters);

  return (
    <section>
      {/* Filter bar */}
      <Box sx={{
        display: "flex", gap: 2, flexWrap: "wrap",
        padding: "24px 20px", bgcolor: "background.paper",
        borderBottom: "1px solid", borderColor: "divider",
      }}>
        {/* Search */}
        <TextField
          placeholder="Search jobs..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          size="small"
          sx={{ flex: 2, minWidth: 200 }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon fontSize="small" />
              </InputAdornment>
            ),
          }}
        />

        {/* Location */}
        <TextField
          placeholder="Location..."
          value={location}
          onChange={e => setLocation(e.target.value)}
          size="small"
          sx={{ flex: 1, minWidth: 150 }}
        />

        {/* Job type */}
        <FormControl size="small" sx={{ minWidth: 150 }}>
          <InputLabel>Job Type</InputLabel>
          <Select
            value={type}
            label="Job Type"
            onChange={e => setType(e.target.value)}
          >
            <MenuItem value="">All Types</MenuItem>
            {JOB_TYPES.map(t => (
              <MenuItem key={t} value={t}>{t}</MenuItem>
            ))}
          </Select>
        </FormControl>

        {/* Subtle fetching indicator — shows when refetching in background */}
        {isFetching && !isLoading && (
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <CircularProgress size={18} />
          </Box>
        )}
      </Box>

      {/* Results count */}
      {!isLoading && (
        <Typography variant="body2" color="text.secondary" sx={{ px: "20px", pt: 2 }}>
          {jobs.length} {jobs.length === 1 ? "job" : "jobs"} found
        </Typography>
      )}

      {/* Job list — pass jobs and loading down */}
      <JobListings
        isHomePage={false}
        jobs={jobs}
        loading={isLoading}
      />
    </section>
  );
}

export default JobsPage;