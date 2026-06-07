import Link from 'next/link';

export default function SuspendedPage() {
  return (
    <div className="center-page">
      <div className="suspended-card">
        <h1>Account suspended</h1>
        <p>
          Your Pick a Shift account has been suspended. If you believe this is a mistake, please contact
          our support team.
        </p>
        <Link href="mailto:support@pickashift.es" className="btn btn-primary">
          Contact support
        </Link>
      </div>
    </div>
  );
}
