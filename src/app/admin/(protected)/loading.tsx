export default function AdminDashboardLoading() {
  return (
    <main id="main" className="admin-dashboard" aria-busy="true" aria-label="Loading dashboard">
      <div className="admin-skeleton admin-skeleton-title" />
      <div className="admin-skeleton-grid"><div className="admin-skeleton admin-skeleton-metric" /><div className="admin-skeleton admin-skeleton-metric" /></div>
      <div className="admin-skeleton-grid admin-skeleton-destinations"><div className="admin-skeleton admin-skeleton-metric" /><div className="admin-skeleton admin-skeleton-metric" /><div className="admin-skeleton admin-skeleton-metric" /></div>
      <div className="admin-skeleton admin-skeleton-table" />
      <span className="visually-hidden">Loading enquiries and live totals…</span>
    </main>
  );
}
