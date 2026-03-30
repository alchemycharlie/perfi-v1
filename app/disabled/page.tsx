import Link from 'next/link';

export default function DisabledPage() {
  return (
    <div className="flex min-h-full items-center justify-center px-6 py-24">
      <div className="text-center">
        <h1 className="text-2xl font-semibold text-text-primary">Account disabled</h1>
        <p className="mt-4 text-text-secondary">
          Your account has been disabled. If you believe this is an error, please{' '}
          <Link href="/contact" className="text-accent hover:text-accent-hover underline">
            contact us
          </Link>
          .
        </p>
      </div>
    </div>
  );
}
