import { useAuth } from "../context/AuthContext";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getCompanyByOwner, createCompany, updateCompany, createJob, createApplication, getAllJobs, getEmployerJobs } from "../api";
import type { CompanyFormData } from "../api/services/CompanyService";
import type { CreateJobData } from "../api/services/JobService";
import type { CreateApplicationData } from "../api/services/ApplicationService";
import supabase from "../api/SupabaseClient";
import { useState, useEffect } from "react";
import type { JobFilters } from "../api";


export const useJobListings = (isHomePage?: boolean, filters?: JobFilters) => {
  const { user, role, loading: authLoading } = useAuth();

  const limit = isHomePage ? 3 : undefined;

  return useQuery({
    // key changes when role, user or limit changes: triggers a new fetch
    queryKey: ["jobs", { role, userId: user?.id, limit, filters }],

    queryFn: async () => {
      const result = role === "employer" && user
        ? await getEmployerJobs(user.id, limit)
        : await getAllJobs(filters, limit);

      // TanStack expects a throw on failure, not a return
      if (!result.success) throw new Error(result.error);
      return result.data;
    },

    // don't fetch until auth is resolved
    enabled: !authLoading,

    // keep previous data visible while refetching
    placeholderData: (prev) => prev,
  });
};

export const useCompany = () => {
  const { user } = useAuth();
 
  return useQuery({
    queryKey: ["company", user?.id],
    queryFn:  async () => {
      const result = await getCompanyByOwner(user!.id);
      if (!result.success) throw new Error(result.error);
      return result.data; // Company | null
    },
    enabled: !!user,
  });
};
 
export const useCreateCompany = () => {
  const queryClient = useQueryClient();
  const { user }    = useAuth();
 
  return useMutation({
    mutationFn: (formData: CompanyFormData) =>
      createCompany(formData, user!.id).then(r => {
        if (!r.success) throw new Error(r.error);
        return r.data;
      }),
    onSuccess: () => {
      // Invalidate so company data refetches everywhere
      queryClient.invalidateQueries({ queryKey: ["company", user?.id] });
    },
  });
};
 
export const useUpdateCompany = () => {
  const queryClient = useQueryClient();
  const { user }    = useAuth();
 
  return useMutation({
    mutationFn: (formData: CompanyFormData) =>
      updateCompany(formData, user!.id).then(r => {
        if (!r.success) throw new Error(r.error);
        return r.data;
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["company", user?.id] });
    },
  });
};
 

 
export const useCreateJob = () => {
  const queryClient = useQueryClient();
  const { user }    = useAuth();
 
  return useMutation({
    mutationFn: (jobData: CreateJobData) =>
      createJob(jobData).then(r => {
        if (!r.success) throw new Error(r.error);
        return r.data;
      }),
    onSuccess: () => {
      // Invalidate job lists so they refetch after a new job is posted
      queryClient.invalidateQueries({ queryKey: ["jobs"] });
    },
  });
};
 
export const useSubmitApplication = () => {
  const queryClient = useQueryClient();
  const { user }    = useAuth();
 
  return useMutation({
    mutationFn: async ({
      formData,
      cvFile,
      coverLetterFile,
    }: {
      formData:        CreateApplicationData;
      cvFile:          File | null;
      coverLetterFile: File | null;
    }) => {
      let cv_url:           string | undefined;
      let cover_letter_url: string | undefined;
 
      // Upload CV to Supabase Storage if provided
      if (cvFile && user) {
        const path = `${user.id}/${Date.now()}_${cvFile.name}`;
        const { error } = await supabase.storage
          .from("cvs")
          .upload(path, cvFile);
        if (error) throw new Error(`CV upload failed: ${error.message}`);
        const { data: urlData } = supabase.storage.from("cvs").getPublicUrl(path);
        cv_url = urlData.publicUrl;
      }
 
      // Upload cover letter if provided
      if (coverLetterFile && user) {
        const path = `${user.id}/${Date.now()}_${coverLetterFile.name}`;
        const { error } = await supabase.storage
          .from("cvs")
          .upload(path, coverLetterFile);
        if (error) throw new Error(`Cover letter upload failed: ${error.message}`);
        const { data: urlData } = supabase.storage.from("cvs").getPublicUrl(path);
        cover_letter_url = urlData.publicUrl;
      }
 
      const result = await createApplication(
        { ...formData, cv_url, cl_url: cover_letter_url },
        user!.id
      );
      if (!result.success) throw new Error(result.error);
      return result.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["applications"] });
    },
  });
};

  export const useDebounce = <T>(value: T, delay: number = 400): T => {
  const [debounced, setDebounced] = useState<T>(value);

  useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(timer); // clears timer if value changes before delay
  }, [value, delay]);

  return debounced;
};