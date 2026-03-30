'use client';

export default function Error({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="flex min-h-full items-center justify-center px-6 py-24">
      <div className="text-center">
        <p className="text-sm font-medium text-danger">Error</p>
        <h1 className="mt-2 text-2xl font-semibold text-text-primary">Something went wrong</h1>
        <p className="mt-2 text-text-secondary">An unexpected error occurred. Please try again.</p>
        <div className="mt-6">
          <button
            onClick={reset}
            className="rounded-md bg-accent px-4 py-2 text-sm font-medium text-white hover:bg-accent-hover"
          >
            Try again
          </button>
        </div>
      </div>
    </div>
  );
}
