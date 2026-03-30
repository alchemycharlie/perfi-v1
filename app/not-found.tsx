import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="flex min-h-full items-center justify-center px-6 py-24">
      <div className="text-center">
        <p className="text-sm font-medium text-accent">404</p>
        <h1 className="mt-2 text-2xl font-semibold text-text-primary">Page not found</h1>
        <p className="mt-2 text-text-secondary">
          The page you&apos;re looking for doesn&apos;t exist or has been moved.
        </p>
        <div className="mt-6">
          <Link href="/" className="text-sm font-medium text-accent hover:text-accent-hover">
            Go back home
          </Link>
        </div>
      </div>
    </div>
  );
}
