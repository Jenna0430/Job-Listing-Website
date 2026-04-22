import supabase from "../SupabaseClient";
import { ok, fail, parseError, PGRST_NO_ROWS } from "../ApiResult";
import type { ApiResult } from "../ApiResult";
import type { Profile } from "../../type/job.types";


export interface UpdateProfileData {
  full_name?: string;
  avatar_url?: string;
}

// Fetch the currently authenticated user's profile
export const getMyProfile = async (): Promise<ApiResult<Profile | null>> => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return fail("Not authenticated.");
 
    const { data, error } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", user.id)
      .single();
 
    if (error?.code === PGRST_NO_ROWS) return ok(null);
    if (error) return fail(parseError(error));
    return ok(data);
 
  } catch (error) {
    return fail(parseError(error));
  }
};

// Update Profile 
export const updateMyProfile = async (
  updates: UpdateProfileData
): Promise<ApiResult<Profile>> => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return fail("Not authenticated.");
 
    const { data, error } = await supabase
      .from("profiles")
      .update(updates)
      .eq("id", user.id)
      .select()
      .single();
 
    if (error) return fail(parseError(error));
    return ok(data);
 
  } catch (error) {
    return fail(parseError(error));
  }
};