
export type UserRole = "applicant" | "employer";

export interface Profile {
  id: string;
  role: UserRole;
  full_name: string | null;
  avatar_url: string | null;
  is_banned: boolean;
  created_at: string;
}

export type CompanyStatus = "pending" | "verified" | "rejected";

export interface Company {
  id: string;
  owner_id: string;
  name: string;
  description: string | null;
  contact_email: string | null;
  contact_phone: string | null;
  year_founded: string | null;
  status: CompanyStatus;
  rejection_reason: string | null;
  created_at: string;
}

export interface Job {
  id: string;
  company_id: string;
  posted_by: string;
  title: string;
  type: string;
  location: string;
  description: string;
  salary: string;
  is_active: boolean;
  created_at: string;
  companies: Company | null;
}

export type ApplicationStatus = "pending" | "reviewed" | "shortlisted" | "rejected";

export interface Application {
  id: string;
  job_id: string;
  applicant_id: string;
  full_name: string;
  email: string;
  phone: string | null;
  cl_url: string | null;
  cv_url: string | null;
  status: ApplicationStatus;
  applied_at: string;
  jobs: Job | null;
  profiles: Profile | null;
}