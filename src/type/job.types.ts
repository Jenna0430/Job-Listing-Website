
export interface Company {
  id: string;
  owner_id: string;
  name: string;
  description: string;
  contact_email: string;
  contact_phone: string;
  year_founded: string;
  created_at: string;
}

export interface Job {
  id: string;
  title: string;
  type: string;
  location: string;
  description: string;
  salary: string;
  posted_by: string;
  company_id: string;
  created_at: string;
  companies: Company | null;
}