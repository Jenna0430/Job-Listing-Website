import supabase from "../SupabaseClient";
import { ok, fail, parseError, DB_ERROR_CODES } from "../ApiResult";
import type { ApiResult } from "../ApiResult";
import type { Job } from "../../type/job.types";

// The shape of data needed to create a new job
export interface CreateJobData {
  title: string;
  type: string;
  location: string;
  description: string;
  salary: string;
  posted_by: string;
  company_id: string;
}


// Create a new job
export const createJob = async (
  jobData: CreateJobData
): Promise<ApiResult<Job>> => {
  try {
    const { data, error } = await supabase
      .from("jobs")
      .insert([jobData])
      .select()
      .single();

    // Duplicate job — same title + location for same company
    if (error?.code === DB_ERROR_CODES.UNIQUE_VIOLATION) {
      return fail(
        `Your company has already posted a "${jobData.title}" job in "${jobData.location}". Edit the existing posting instead.`
      );
    }

    if (error) return fail(parseError(error));
    return ok(data);

  } catch (error) {
    return fail(parseError(error));
  }
};

// Fetch all jobs (for guest/applicant view)
export const getAllJobs = async (limit?: number): Promise<ApiResult<Job[]>> => {
  try {
    let query = supabase.from("jobs").select("*, companies(*)").eq("is_active", true).order("created_at", {ascending: false});

    if (limit) {
      query = query.limit(limit);
    }

    const { data, error } = await query;
    if (error) return fail(parseError(error));
    return ok(data ?? []);

  } catch (error) {
    return fail(parseError(error));
  }
};

// Fetch only jobs belonging to a specific employer
export const getEmployerJobs = async (
  employerId: string,
  limit?: number
): Promise<ApiResult<Job[]>> => {
  try {
    let query = supabase
      .from("jobs")
      .select("*, companies(*)")
      .eq("posted_by", employerId)
      .order("created_at", {ascending: false});

    if (limit) {
      query = query.limit(limit);
    }

    const { data, error } = await query;
    if (error) return fail(parseError(error));
    return ok(data ?? []);

  } catch (error) {
    return fail(parseError(error));
  }
};

// Fetch a single job by ID
export const getJobById = async (id: string): Promise<ApiResult<Job>> => {
  try {
    const { data, error } = await supabase
      .from("jobs")
      .select("*, companies(*)")
      .eq("id", id)
      .single();

    if (error) return fail(parseError(error));
    if (!data) return fail("Job not found.");
    return ok(data);

  } catch (error) {
    return fail(parseError(error));
  }
};

// Partial type for updating a job — all fields optional except posted_by and company_id which should never be updated
export type UpdateJobData = Partial<Omit<CreateJobData, "posted_by" | "company_id">> & {is_active?: boolean};


// Update an existing job posting
export const updateJob = async (
  id: string,
  jobData: UpdateJobData
): Promise<ApiResult<Job>> => {
  try {
    const { data, error } = await supabase
      .from("jobs")
      .update(jobData)
      .eq("id", id)
      .select()
      .single();

    if (error) return fail(parseError(error));
    return ok(data);

  } catch (error) {
    return fail(parseError(error));
  }
};

// ── Delete a job posting
export const deleteJob = async (id: string): Promise<ApiResult<null>> => {
  try {
    const { error } = await supabase
      .from("jobs")
      .delete()
      .eq("id", id);

    if (error) return fail(parseError(error));
    return ok(null);

  } catch (error) {
    return fail(parseError(error));
  }
};

// Convenience toggle for the employer dashboard active/inactive switch
export const toggleJobActive = async (
  id: string,
  isActive: boolean
): Promise<ApiResult<Job>> => {
  return updateJob(id, { is_active: isActive });
};