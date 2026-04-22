import { createContext, useContext, useEffect, useState } from "react";
import supabase from "../api/SupabaseClient";
import type { User, Session } from "@supabase/supabase-js";
import type { JSX } from "react";


interface AuthContextType {
  user: User | null;
  session: Session | null;
  role: "employer" | "applicant" | null;
  fullName: string | null;
  loading: boolean;
  authModalOpen: boolean;
  openAuthModal: () => void;
  closeAuthModal: () => void;
  signUp: (email: string, password: string, role: "employer" | "applicant", fullName: string) => Promise<string | null>;
  signIn: (email: string, password: string) => Promise<string | null>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }): JSX.Element {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [role, setRole] = useState<"employer" | "applicant" | null>(null);
  const [fullName, setFullName] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [authModalOpen, setAuthModalOpen] = useState(false);

  const openAuthModal = (): void => setAuthModalOpen(true);
  const closeAuthModal = (): void => setAuthModalOpen(false);

  // Extract role from user metadata
  const extractRole = (user: User | null): "employer" | "applicant" | null => {
    const r = user?.user_metadata?.role;
    if (r === "admin") return null;
    return(r as "employer" | "applicant") ?? null;
  };

  const extractFullName = (user: User | null): string | null => {
    return user?.user_metadata?.full_name ?? null;
  };

  useEffect(() => {
    // check for an existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      setRole(extractRole(session?.user ?? null));
      setFullName(extractFullName(session?.user ?? null));
      setLoading(false);
    });

    // Listen for auth changes (login, logout, token refresh)
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        setRole(extractRole(session?.user ?? null));
        setFullName(extractFullName(session?.user ?? null));
        setLoading(false);
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  const signUp = async (
    email: string,
    password: string,
    role: "employer" | "applicant",
    fullName: string
  ): Promise<string | null> => {

    if ((role as string) === "admin") {
      return "Invalid role";
    }

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { role, fullName: fullName }, // store role and full name in user metadata
      },
    });
    if (error) return error.message;

    if (data?.user && !data?.session) return "CHECK_EMAIL"; // email sent, awaiting confirmation

    if (data?.user && data?.session) {
      return null; // success
    }

    return "something went wrong";
  };

  const signIn = async (email: string, password: string): Promise<string | null> => {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });

    if (error) return error.message;
    
   // Check the profile role: admins are not allowed in this app
    const { data: profile } = await supabase
      .from("profiles")
      .select("role, is_banned")
      .eq("id", data.user.id)
      .single();
 
    if (profile?.is_banned) {
      await supabase.auth.signOut();
      return "Your account has been suspended. Please contact support.";
    }
 
    if (profile?.role === "admin") {
      await supabase.auth.signOut();
      return "This account is not valid for this application.";
    }
 
    return null;

  };

  const signOut = async (): Promise<void> => {
    await supabase.auth.signOut();
  };

  return (
    <AuthContext.Provider value={{ user, session, role, fullName, loading, authModalOpen, openAuthModal, closeAuthModal, signUp, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used inside AuthProvider");
  return context;
}