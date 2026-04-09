import { Route, createBrowserRouter, createRoutesFromElements, RouterProvider } from "react-router-dom"
import { HomePage,JobsPage, JobPage, AddJobPage, jobLoader, ApplyForJobPage, CompanyProfilePage } from "./pages"
import MainLayout from "./layouts/MainLayout"
import type { JSX } from "react"



const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<MainLayout />}>
      <Route index element={<HomePage />} />
      <Route path="jobs" element={<JobsPage />} />
      <Route path="jobs/:id" element={<JobPage />} loader={jobLoader} />
      <Route path="add-job" element={<AddJobPage />} />
      <Route path="apply" element={<ApplyForJobPage />} />
      <Route path="company-profile" element={<CompanyProfilePage />} />
    </Route>
  )
)

function App(): JSX.Element {
  return <RouterProvider router={router}/>
}

export default App
