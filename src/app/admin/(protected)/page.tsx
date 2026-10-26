import type { Metadata } from "next";
import { listAdminInterests, requireAdmin } from "@/lib/admin/auth";
import { getTripBySlug } from "@/data/trips";

export const metadata: Metadata = {
  title: "Enquiry Dashboard",
  robots: { index: false, follow: false },
};

export default async function AdminDashboardPage() {
  await requireAdmin();
  const enquiries = await listAdminInterests();
  const totalStudents = enquiries.reduce((sum, enquiry) => sum + enquiry.student_count, 0);

  return (
    <main id="main" className="admin-dashboard">
      <div className="admin-dashboard-heading">
        <div><p className="eyebrow">PRIVATE ADMIN AREA</p><h1>School trip enquiries</h1><p>Review interest submitted by teachers and school coordinators.</p></div>
      </div>
      <section className="admin-metrics" aria-label="Enquiry totals">
        <article><span>Total enquiries</span><strong>{enquiries.length}</strong></article>
        <article><span>Interested students</span><strong>{totalStudents.toLocaleString("en-IN")}</strong></article>
      </section>
      <section className="admin-table-section" aria-labelledby="admin-enquiries-title">
        <div className="admin-table-heading"><h2 id="admin-enquiries-title">Recent enquiries</h2><span>{enquiries.length} records</span></div>
        {enquiries.length === 0 ? (
          <div className="admin-empty-state"><h3>No enquiries yet</h3><p>New school trip interest submissions will appear here.</p></div>
        ) : (
          <div className="admin-table-scroll">
            <table className="admin-enquiries-table">
              <thead><tr><th scope="col">Teacher</th><th scope="col">School</th><th scope="col">Contact</th><th scope="col">Destination</th><th scope="col">Students</th><th scope="col">Submitted</th></tr></thead>
              <tbody>
                {enquiries.map((enquiry) => {
                  const trip = getTripBySlug(enquiry.trip_slug);
                  return (
                    <tr key={enquiry.id}>
                      <td>{enquiry.teacher_name}</td><td>{enquiry.school_name}</td>
                      <td><a href={`mailto:${encodeURIComponent(enquiry.email)}`}>{enquiry.email}</a><span>{enquiry.phone}</span></td>
                      <td>{trip ? `${trip.city} — ${trip.theme}` : enquiry.trip_slug}</td>
                      <td>{enquiry.student_count}</td>
                      <td><time dateTime={enquiry.created_at}>{new Intl.DateTimeFormat("en-IN", { dateStyle: "medium" }).format(new Date(enquiry.created_at))}</time></td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </main>
  );
}
