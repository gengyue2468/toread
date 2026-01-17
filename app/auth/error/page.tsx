"use client";

import { Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { LoaderIcon } from "@/components/icons";

function AuthErrorContent() {
  const searchParams = useSearchParams();
  const error = searchParams.get("error");

  const errorMessages: Record<string, string> = {
    Default: "An unexpected error occurred during authentication.",
    Configuration: "There is a problem with the server configuration.",
    AccessDenied: "You do not have permission to sign in.",
    Verification:
      "The verification link may have expired or has already been used.",
  };

  const message = error
    ? errorMessages[error] || errorMessages.Default
    : errorMessages.Default;

  return (
    <div className="max-w-prose mx-auto px-8 pt-16 border-x border-stone-200 dark:border-neutral-800 min-h-screen pb-32">
      <div className="text-center py-16">
        <h1 className="font-serif text-3xl md:text-4xl font-medium text-stone-900 dark:text-stone-100 mb-3">
          Access Denied
        </h1>

        <p className="text-stone-500 dark:text-neutral-400 max-w-md mx-auto mb-8">
          {message}
        </p>

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

function LoadingFallback() {
  return (
    <div className="min-h-screen max-w-prose mx-auto border-x border-stone-200 dark:border-neutral-800 flex flex-col items-center justify-center text-center">
      <LoaderIcon className="mx-auto my-16 animate-spin" />
    </div>
  );
}

export default function AuthErrorPage() {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <AuthErrorContent />
    </Suspense>
  );
}
