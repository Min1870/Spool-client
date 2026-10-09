import Link from "next/link";

export default function NotFound() {
  return (
    <div className="gutter flex min-h-[70vh] flex-col items-center justify-center pt-24 text-center">
      <p className="text-gradient-brand font-display text-8xl font-extrabold sm:text-9xl">404</p>
      <h1 className="mt-4 font-display text-3xl font-bold">Lost your way?</h1>
      <p className="mt-2 max-w-md text-muted">
        Sorry, we can&apos;t find that page. You&apos;ll find lots to explore on the home page.
      </p>
      <Link
        href="/"
        className="mt-8 rounded-md bg-brand-red px-7 py-3 font-semibold transition hover:bg-brand-red-dark"
      >
        MSW Home
      </Link>
    </div>
  );
}
