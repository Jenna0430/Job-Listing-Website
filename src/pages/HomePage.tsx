import type { JSX } from "react"
import Hero from "../components/Hero"
import HomeCards from "../components/HomeCards"
import JobListings from "../components/JobListings"
import { useAuth } from "../context/AuthContext"


function HomePage(): JSX.Element {

  const { role } = useAuth();

  return (
    <>
    {role == "applicant" ?
    (
      <Hero title="Discover new jobs with us" subtitle="Tell us about your experience and skills." />
    ):  role == "employer" ? (
      <Hero title="Post new jobs with us" subtitle="Tell us about your available job posts" />
    ) : (
      <Hero title="Welocme to FindJobs website" subtitle="This platform provide job seekers and employers a way to find and post jobs" />
    )
    }
      <HomeCards />
      <JobListings isHomePage={true} />
    </>
  )
}   
export default HomePage