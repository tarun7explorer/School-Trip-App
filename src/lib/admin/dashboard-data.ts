import "server-only";

import { z } from "zod";
import { trips } from "@/data/trips";
import { AdminAccessError, getAdminAccess } from "@/lib/admin/auth";

export const ADMIN_PAGE_SIZE = 20;

const dashboardFiltersSchema = z.object({
  trip: z.enum(["hyderabad-stem", "jaipur-heritage", "delhi-discovery"]).optional(),
  q: z.string().trim().max(100).optional().transform((value) => value || undefined),
  page: z.coerce.number().int().min(1).max(50_000).default(1),
});

export type DashboardFilters = z.output<typeof dashboardFiltersSchema>;

export function parseDashboardFilters(params: URLSearchParams | Record<string, string | string[] | undefined>) {
  const raw = params instanceof URLSearchParams
    ? { trip: params.get("trip") ?? undefined, q: params.get("q") ?? undefined, page: params.get("page") ?? undefined }
    : {
        trip: Array.isArray(params.trip) ? params.trip[0] : params.trip,
        q: Array.isArray(params.q) ? params.q[0] : params.q,
        page: Array.isArray(params.page) ? params.page[0] : params.page,
      };
  const result = dashboardFiltersSchema.safeParse(raw);
  return result.success ? result.data : null;
}

export type DashboardEnquiry = {
  teacher_name: string;
  school_name: string;
  email: string;
  phone: string;
  trip_slug: string;
  student_count: number;
  created_at: string;
};

export type DestinationSummary = {
  slug: string;
  city: string;
  theme: string;
  enquiryCount: number;
  studentCount: number;
};

export type AdminDashboardData = {
  enquiries: DashboardEnquiry[];
  summaries: DestinationSummary[];
  totalEnquiries: number;
  totalStudents: number;
  filteredCount: number;
  page: number;
  pageSize: number;
  pageCount: number;
};

export type DashboardDataResult =
  | { ok: true; data: AdminDashboardData }
  | { ok: false; message: string };

export async function getAdminDashboardData(filters: DashboardFilters): Promise<DashboardDataResult> {
  const access = await getAdminAccess();
  if (access.kind !== "authorized") throw new AdminAccessError(access.kind);

  const pSearch = filters.q ?? null;
  const pTripSlug = filters.trip ?? null;
  try {
    const [summaryResult, countResult] = await Promise.all([
      access.supabase.rpc("get_admin_interest_summary"),
      access.supabase.rpc("get_admin_interest_count", { p_trip_slug: pTripSlug, p_search: pSearch }),
    ]);

    if (summaryResult.error || countResult.error) {
      return { ok: false, message: "We couldn't load the enquiry data. Please try again." };
    }

    const filteredCount = Number(countResult.data ?? 0);
    const pageCount = Math.max(1, Math.ceil(filteredCount / ADMIN_PAGE_SIZE));
    const currentPage = Math.min(filters.page, pageCount);
    const pageResult = await access.supabase.rpc("get_admin_interest_page", {
      p_trip_slug: pTripSlug,
      p_search: pSearch,
      p_limit: ADMIN_PAGE_SIZE,
      p_offset: (currentPage - 1) * ADMIN_PAGE_SIZE,
    });
    if (pageResult.error) return { ok: false, message: "We couldn't load the enquiry data. Please try again." };

    const summaryByTrip = new Map(summaryResult.data.map((row) => [row.trip_slug, row]));
    const summaries = trips.map((trip) => {
      const row = summaryByTrip.get(trip.slug);
      return {
        slug: trip.slug,
        city: trip.city,
        theme: trip.theme,
        enquiryCount: Number(row?.enquiry_count ?? 0),
        studentCount: Number(row?.student_count ?? 0),
      };
    });
    const totalEnquiries = summaries.reduce((total, row) => total + row.enquiryCount, 0);
    const totalStudents = summaries.reduce((total, row) => total + row.studentCount, 0);
    return {
      ok: true,
      data: {
        enquiries: pageResult.data,
        summaries,
        totalEnquiries,
        totalStudents,
        filteredCount,
        page: currentPage,
        pageSize: ADMIN_PAGE_SIZE,
        pageCount,
      },
    };
  } catch {
    return { ok: false, message: "We couldn't load the enquiry data. Please try again." };
  }
}

export function buildDashboardHref(filters: DashboardFilters, page: number) {
  const params = new URLSearchParams();
  if (filters.trip) params.set("trip", filters.trip);
  if (filters.q) params.set("q", filters.q);
  if (page > 1) params.set("page", String(page));
  const query = params.toString();
  return query ? `/admin?${query}` : "/admin";
}
