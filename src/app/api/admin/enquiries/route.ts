import { NextResponse } from "next/server";
import { AdminAccessError } from "@/lib/admin/auth";
import { getAdminDashboardData, parseDashboardFilters } from "@/lib/admin/dashboard-data";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const filters = parseDashboardFilters(new URL(request.url).searchParams);
  if (!filters) {
    return NextResponse.json({ error: "Invalid dashboard filters." }, { status: 400, headers: { "Cache-Control": "private, no-store, max-age=0" } });
  }
  try {
    const result = await getAdminDashboardData(filters);
    if (!result.ok) {
      return NextResponse.json({ error: result.message }, { status: 503, headers: { "Cache-Control": "private, no-store, max-age=0" } });
    }
    return NextResponse.json(result.data, { headers: { "Cache-Control": "private, no-store, max-age=0" } });
  } catch (error) {
    if (error instanceof AdminAccessError) {
      const status = error.kind === "unauthenticated" ? 401 : error.kind === "forbidden" ? 403 : 503;
      return NextResponse.json({ error: "Administrator access required." }, { status, headers: { "Cache-Control": "private, no-store, max-age=0" } });
    }
    return NextResponse.json({ error: "Unable to load enquiries." }, { status: 500, headers: { "Cache-Control": "private, no-store, max-age=0" } });
  }
}
