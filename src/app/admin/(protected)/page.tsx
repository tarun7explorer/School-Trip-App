import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, ArrowRight, RotateCcw, Search, UsersRound } from "lucide-react";
import {
  buildDashboardHref,
  getAdminDashboardData,
  parseDashboardFilters,
} from "@/lib/admin/dashboard-data";

export const metadata: Metadata = {
  title: "Enquiry Dashboard",
  robots: { index: false, follow: false },
};

type AdminDashboardPageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

const numberFormat = new Intl.NumberFormat("en-IN");
const dateFormat = new Intl.DateTimeFormat("en-IN", {
  day: "2-digit", month: "short", year: "numeric", timeZone: "Asia/Kolkata",
});

export default async function AdminDashboardPage({ searchParams }: AdminDashboardPageProps) {
  const params = await searchParams;
  const filters = parseDashboardFilters(params);

  if (!filters) {
    return (
      <main id="main" className="admin-dashboard" tabIndex={-1}>
        <section className="admin-state-card" role="alert">
          <h1>Those filters aren’t valid</h1>
          <p>Reset the destination, search or page number and try again.</p>
          <Link className="button button-primary" href="/admin">Reset filters</Link>
        </section>
      </main>
    );
  }

  const result = await getAdminDashboardData(filters);
  if (!result.ok) {
    return (
      <main id="main" className="admin-dashboard" tabIndex={-1}>
        <section className="admin-state-card" role="alert">
          <span className="admin-state-icon" aria-hidden="true"><RotateCcw size={21} /></span>
          <h1>Enquiries could not be loaded</h1>
          <p>{result.message}</p>
          <Link className="button button-primary" href={buildDashboardHref(filters, filters.page)}>Try again</Link>
        </section>
      </main>
    );
  }

  const { data } = result;
  const hasActiveFilters = Boolean(filters.trip || filters.q);
  const selectedTrip = data.summaries.find((trip) => trip.slug === filters.trip);
  const rangeStart = data.filteredCount === 0 ? 0 : (filters.page - 1) * data.pageSize + 1;
  const rangeEnd = Math.min(filters.page * data.pageSize, data.filteredCount);

  return (
    <main id="main" className="admin-dashboard" tabIndex={-1}>
      <header className="admin-dashboard-heading">
        <div>
          <p className="eyebrow">ADMINISTRATION <span aria-hidden="true">/</span> OVERVIEW</p>
          <h1>Enquiry dashboard</h1>
          <p>Review teacher interest and understand demand across the three destinations.</p>
        </div>
        <div className="admin-updated-label"><span aria-hidden="true" /> Live from Supabase</div>
      </header>

      <section className="admin-summary-section" aria-labelledby="summary-title">
        <div className="admin-section-heading">
          <div><span className="admin-section-kicker">ALL TIME</span><h2 id="summary-title">Interest at a glance</h2></div>
          <p>Totals use every saved enquiry and are independent of table filters.</p>
        </div>
        <div className="admin-metrics">
          <article className="admin-total-card">
            <span className="admin-card-icon" aria-hidden="true"><UsersRound size={18} /></span>
            <span className="admin-metric-label">Total enquiries</span>
            <strong>{numberFormat.format(data.totalEnquiries)}</strong>
            <small>Schools and coordinators</small>
          </article>
          <article className="admin-total-card admin-total-card-accent">
            <span className="admin-card-icon" aria-hidden="true"><UsersRound size={18} /></span>
            <span className="admin-metric-label">Interested students</span>
            <strong>{numberFormat.format(data.totalStudents)}</strong>
            <small>Across all destinations</small>
          </article>
        </div>
        <div className="admin-destination-grid" aria-label="All-time interest by destination">
          {data.summaries.map((summary, index) => (
            <Link className="admin-destination-summary" href={`/admin?trip=${summary.slug}`} key={summary.slug}>
              <span className={`admin-destination-dot admin-destination-dot-${index + 1}`} aria-hidden="true" />
              <span className="admin-destination-copy"><strong>{summary.city}</strong><small>{summary.theme}</small></span>
              <span className="admin-destination-values"><strong>{numberFormat.format(summary.enquiryCount)}</strong><small>enquiries</small></span>
              <span className="admin-destination-values admin-student-values"><strong>{numberFormat.format(summary.studentCount)}</strong><small>students</small></span>
              <ArrowRight className="admin-destination-arrow" size={15} aria-hidden="true" />
            </Link>
          ))}
        </div>
      </section>

      <section className="admin-enquiry-section" aria-labelledby="enquiry-list-title">
        <div className="admin-enquiry-section-heading">
          <div>
            <span className="admin-section-kicker">INBOX</span>
            <h2 id="enquiry-list-title">School enquiries</h2>
            <p>Browse recent submissions, newest first.</p>
          </div>
          <span className="admin-record-count" aria-live="polite">{numberFormat.format(data.filteredCount)} {hasActiveFilters ? "matching " : ""}{data.filteredCount === 1 ? "enquiry" : "enquiries"}</span>
        </div>

        <form action="/admin" method="get" className="admin-filter-form" aria-label="Filter enquiries">
          <label className="admin-search-control">
            <span>Search enquiries</span>
            <span className="admin-search-input-wrap"><Search size={16} aria-hidden="true" /><input type="search" name="q" defaultValue={filters.q ?? ""} maxLength={100} placeholder="Teacher, school or contact" /></span>
          </label>
          <label className="admin-destination-control">
            <span>Destination</span>
            <select name="trip" defaultValue={filters.trip ?? ""}>
              <option value="">All destinations</option>
              {data.summaries.map((summary) => <option value={summary.slug} key={summary.slug}>{summary.city}</option>)}
            </select>
          </label>
          <button className="admin-filter-submit" type="submit">Apply filters</button>
          {hasActiveFilters && <Link className="admin-reset-filters" href="/admin"><RotateCcw size={14} aria-hidden="true" /> Reset</Link>}
        </form>

        {hasActiveFilters && (
          <div className="admin-active-filters" aria-label="Active filters">
            <span>Showing {selectedTrip?.city ?? "all destinations"}{filters.q ? ` matching “${filters.q}”` : ""}</span>
            {selectedTrip && <span className="admin-filter-pill">{selectedTrip.city} <span>×</span></span>}
            {filters.q && <span className="admin-filter-pill">“{filters.q}” <span>×</span></span>}
          </div>
        )}

        <div className="admin-table-card">
          {data.filteredCount === 0 ? (
            <div className="admin-empty-state">
              <span className="admin-empty-icon" aria-hidden="true"><Search size={20} /></span>
              <h3>{hasActiveFilters ? "No enquiries match these filters" : "No enquiries yet"}</h3>
              <p>{hasActiveFilters ? "Try a different search or destination, or clear the active filters." : "New school trip interest submissions will appear here when they are saved."}</p>
              {hasActiveFilters && <Link className="admin-reset-empty" href="/admin">Clear filters <ArrowRight size={14} aria-hidden="true" /></Link>}
            </div>
          ) : (
            <>
              <div className="admin-table-scroll">
                <table className="admin-enquiries-table">
                  <caption className="visually-hidden">Teacher trip interest enquiries sorted newest first</caption>
                  <thead><tr><th scope="col">Teacher</th><th scope="col">School / institution</th><th scope="col">Contact</th><th scope="col">Destination</th><th scope="col">Students</th><th scope="col">Submitted</th></tr></thead>
                  <tbody>
                    {data.enquiries.map((enquiry) => {
                      const trip = data.summaries.find((item) => item.slug === enquiry.trip_slug);
                      return (
                        <tr key={`${enquiry.created_at}-${enquiry.email}-${enquiry.trip_slug}`}>
                          <td data-label="Teacher"><strong>{enquiry.teacher_name}</strong></td>
                          <td data-label="School / institution">{enquiry.school_name}</td>
                          <td data-label="Contact"><a href={`mailto:${enquiry.email}`}>{enquiry.email}</a><a className="admin-phone-link" href={`tel:${enquiry.phone.replace(/[^+\d]/g, "")}`}>{enquiry.phone}</a></td>
                          <td data-label="Destination"><span className="admin-trip-tag">{trip?.city ?? enquiry.trip_slug}</span></td>
                          <td data-label="Students"><strong>{numberFormat.format(enquiry.student_count)}</strong></td>
                          <td data-label="Submitted"><time dateTime={enquiry.created_at}>{dateFormat.format(new Date(enquiry.created_at))}</time></td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
              <nav className="admin-pagination" aria-label="Enquiry pages">
                <span>Showing <strong>{numberFormat.format(rangeStart)}–{numberFormat.format(rangeEnd)}</strong> of {numberFormat.format(data.filteredCount)}</span>
                <div>
                  {filters.page > 1 ? <Link href={buildDashboardHref(filters, filters.page - 1)} aria-label="Previous page"><ArrowLeft size={15} aria-hidden="true" /> Previous</Link> : <span className="admin-page-disabled" aria-disabled="true"><ArrowLeft size={15} aria-hidden="true" /> Previous</span>}
                  <span className="admin-page-number">Page {filters.page} of {data.pageCount}</span>
                  {filters.page < data.pageCount ? <Link href={buildDashboardHref(filters, filters.page + 1)} aria-label="Next page">Next <ArrowRight size={15} aria-hidden="true" /></Link> : <span className="admin-page-disabled" aria-disabled="true">Next <ArrowRight size={15} aria-hidden="true" /></span>}
                </div>
              </nav>
            </>
          )}
        </div>
      </section>
    </main>
  );
}
