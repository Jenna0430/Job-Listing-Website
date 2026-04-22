import supabase from "../SupabaseClient";
import { ok, fail, parseError } from "../ApiResult";
import type { ApiResult } from "../ApiResult";
import type { Company } from "../../type/job.types";

export interface CompanyFormData {
  name: string;
  description: string;
  contact_email: string;
  contact_phone: string;
  year_founded: string;
}

// Create a new company profile
export const createCompany = async (
  formData: CompanyFormData,
  ownerId: string
): Promise<ApiResult<Company>> => {
  try {
    const { data, error } = await supabase
      .from("companies")
      .insert([{ ...formData, owner_id: ownerId }])
      .select()
      .single();

    if (error) return fail(parseError(error));
    return ok(data);

  } catch (error) {
    return fail(parseError(error));
  }
};

// Fetch a company profile by owner ID
export const getCompanyByOwner = async (
  ownerId: string
): Promise<ApiResult<Company | null>> => {
  try {
    const { data, error } = await supabase
      .from("companies")
      .select("*")
      .eq("owner_id", ownerId)
      .maybeSingle();

    // PGRST116 means "no rows found" 
    if (error?.code === "PGRST_NO_ROWS") return ok(null);
    if (error) return fail(parseError(error));
    return ok(data);

  } catch (error) {
    return fail(parseError(error));
  }
};


// Update an existing company profile
export const updateCompany = async (
  formData: CompanyFormData,
  ownerId: string
): Promise<ApiResult<Company>> => {
  try {
    const { data, error } = await supabase
      .from("companies")
      .update(formData)
      .eq("owner_id", ownerId)
      .select()
      .single();

    if (error) return fail(parseError(error));
    return ok(data);

  } catch (error) {
    return fail(parseError(error));
  }
};