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
    Functions: Record<string, never>;
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
};
