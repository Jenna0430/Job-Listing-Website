import type { JSX } from "react"
import Hero from "../components/Hero"
import HomeCards from "../components/HomeCards"
import JobListings from "../components/JobListings"


function HomePage(): JSX.Element {
  return (
    <>
      <Hero />
      <HomeCards />
      <JobListings isHomePage={true} />
    </>
  )
}   
export default HomePage