import supabase from "../SupabaseClient";
import { ok, fail, parseError, PGRST_NO_ROWS, DB_ERROR_CODES } from "../ApiResult";
import type { ApiResult } from "../ApiResult";
import type { Application, ApplicationStatus } from "../../type/job.types";

export interface CreateApplicationData {
  job_id: string;
  full_name: string;
  email: string;
  phone?: string;
  cl_url?: string;
  cv_url?: string;
}

// create an application
export const createApplication = async (
  formData: CreateApplicationData,
  applicantId: string
): Promise<ApiResult<Application>> => {
  try {
    const { data, error } = await supabase
      .from("applications")
      .insert([{ ...formData, applicant_id: applicantId }])
      .select("*, jobs(*, companies(*)), profiles(*)")
      .single();
 
    if (error?.code === DB_ERROR_CODES.UNIQUE_VIOLATION) {
      return fail("You have already applied for this job.");
    }
 
    if (error) return fail(parseError(error));
    return ok(data);
 
  } catch (error) {
    return fail(parseError(error));
  }
};

// Applicant views their own application history
export const getMyApplications = async (
  applicantId: string,
  limit?: number
): Promise<ApiResult<Application[]>> => {
  try {
    let query = supabase
      .from("applications")
      .select("*, jobs(*, companies(*))")
      .eq("applicant_id", applicantId)
      .order("applied_at", { ascending: false });
 
    if (limit) query = query.limit(limit);
 
    const { data, error } = await query;
    if (error) return fail(parseError(error));
    return ok(data ?? []);
 
  } catch (error) {
    return fail(parseError(error));
  }
};

// Employer views all applicants for a specific job
export const getApplicationsByJob = async (
  jobId: string,
  limit?: number
): Promise<ApiResult<Application[]>> => {
  try {
    let query = supabase
      .from("applications")
      .select("*, profiles(*)")
      .eq("job_id", jobId)
      .order("applied_at", { ascending: false });
 
    if (limit) query = query.limit(limit);
 
    const { data, error } = await query;
    if (error) return fail(parseError(error));
    return ok(data ?? []);
 
  } catch (error) {
    return fail(parseError(error));
  }
};

// Single application — used when opening a full applicant profile
export const getApplicationById = async (
  id: string
): Promise<ApiResult<Application | null>> => {
  try {
    const { data, error } = await supabase
      .from("applications")
      .select("*, jobs(*, companies(*)), profiles(*)")
      .eq("id", id)
      .single();
 
    if (error?.code === PGRST_NO_ROWS) return ok(null);
    if (error) return fail(parseError(error));
    return ok(data);
 
  } catch (error) {
    return fail(parseError(error));
  }
};

// Employer updates the status of an application (reviewed, shortlisted, rejected)
export const updateApplicationStatus = async (
  id: string,
  status: ApplicationStatus
): Promise<ApiResult<Application>> => {
  try {
    const { data, error } = await supabase
      .from("applications")
      .update({ status })
      .eq("id", id)
      .select("*, jobs(*, companies(*)), profiles(*)")
      .single();
 
    if (error) return fail(parseError(error));
    return ok(data);
 
  } catch (error) {
    return fail(parseError(error));
  }
};

// Applicant withdraws their application: Delete
export const withdrawApplication = async (
  id: string
): Promise<ApiResult<null>> => {
  try {
    const { error } = await supabase
      .from("applications")
      .delete()
      .eq("id", id);
 
    if (error) return fail(parseError(error));
    return ok(null);
 
  } catch (error) {
    return fail(parseError(error));
  }
};
