import { NextResponse } from "next/server";
import { AdminAccessError, listAdminInterests } from "@/lib/admin/auth";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const enquiries = await listAdminInterests();
    return NextResponse.json({ enquiries }, { headers: { "Cache-Control": "private, no-store, max-age=0" } });
  } catch (error) {
    if (error instanceof AdminAccessError) {
      const status = error.kind === "unauthenticated" ? 401 : error.kind === "forbidden" ? 403 : 503;
      return NextResponse.json({ error: "Administrator access required." }, { status, headers: { "Cache-Control": "private, no-store, max-age=0" } });
    }
    return NextResponse.json({ error: "Unable to load enquiries." }, { status: 500, headers: { "Cache-Control": "private, no-store, max-age=0" } });
  }
}
