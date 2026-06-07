'use client';

export default function GlobalError({ reset }: { reset: () => void }) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-4 text-center px-6">
      <h2 className="font-sora text-2xl font-bold">Something went wrong</h2>
      <p className="text-muted-foreground">An unexpected error occurred.</p>
      <button
        type="button"
        onClick={reset}
        className="bg-brand !text-white px-5 py-2 rounded-lg font-semibold text-sm hover:bg-brand-dark transition-colors"
      >
        Try again
      </button>
    </div>
  );
}
