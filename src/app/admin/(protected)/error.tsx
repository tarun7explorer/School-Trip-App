"use client";

export default function AdminDashboardError({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <main id="main" className="admin-dashboard" tabIndex={-1}>
      <section className="admin-state-card" role="alert">
        <h1>Something went wrong</h1>
        <p>The dashboard could not finish loading. Your enquiry data is still protected. Please retry.</p>
        <button className="button button-primary" onClick={reset} type="button">Retry dashboard</button>
      </section>
    </main>
  );
}
