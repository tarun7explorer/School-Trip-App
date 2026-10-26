import type { TripSlug } from "@/types/trip";

export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export type Database = {
  public: {
    Tables: {
      trips: {
        Row: { slug: TripSlug; city: string; theme: string; learning_purpose: string };
        Insert: { slug: TripSlug; city: string; theme: string; learning_purpose: string };
        Update: Partial<{ city: string; theme: string; learning_purpose: string }>;
        Relationships: [];
      };
      trip_interests: {
        Row: {
          id: string;
          teacher_name: string;
          school_name: string;
          email: string;
          phone: string;
          trip_slug: TripSlug;
          student_count: number;
          created_at: string;
        };
        Insert: {
          teacher_name: string;
          school_name: string;
          email: string;
          phone: string;
          trip_slug: TripSlug;
          student_count: number;
        };
        Update: Partial<Database["public"]["Tables"]["trip_interests"]["Insert"]>;
        Relationships: [];
      };
      admin_users: {
        Row: { user_id: string; created_at: string };
        Insert: { user_id: string; created_at?: string };
        Update: Partial<{ user_id: string }>;
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: {
      get_admin_interest_summary: {
        Args: Record<PropertyKey, never>;
        Returns: { trip_slug: string; enquiry_count: number; student_count: number }[];
      };
      get_admin_interest_count: {
        Args: { p_trip_slug: string | null; p_search: string | null };
        Returns: number;
      };
      get_admin_interest_page: {
        Args: { p_trip_slug: string | null; p_search: string | null; p_limit: number; p_offset: number };
        Returns: {
          teacher_name: string;
          school_name: string;
          email: string;
          phone: string;
          trip_slug: string;
          student_count: number;
          created_at: string;
        }[];
      };
    };
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
};
