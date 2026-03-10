"use client";

import { useEffect } from "react";
import ErrorState from "@/components/ErrorState";

export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return <ErrorState kind="server-error" retryAction={reset} />;
}
