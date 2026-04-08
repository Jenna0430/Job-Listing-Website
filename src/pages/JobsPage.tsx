import type { JSX } from "react"
import JobListings from "../components/JobListings"

function JobsPage(): JSX.Element {
  return (
   <section>
    <JobListings isHomePage={false} />
   </section>
  )
}   
export default JobsPage