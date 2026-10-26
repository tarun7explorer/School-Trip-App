import type { TripSlug } from "@/types/trip";

export type TripInterest = {
  id: string;
  teacherName: string;
  schoolName: string;
  email: string;
  phone: string;
  tripSlug: TripSlug;
  studentCount: number;
  createdAt: string;
};
