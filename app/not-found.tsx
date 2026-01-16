import Link from "next/link";

export default function NotFound() {
  return (
    <div className="max-w-prose mx-auto px-8 pt-16 border-x border-stone-200 dark:border-neutral-800 min-h-screen pb-32">
      <div className="text-center py-16">
        <h1 className="text-2xl font-medium mb-4">Oops! Not found</h1>
        <Link
          href="/"
          className="text-stone-500 hover:text-stone-700 dark:hover:text-stone-300"
        >
          ← Back to toread list
        </Link>
      </div>
    </div>
  );
}
