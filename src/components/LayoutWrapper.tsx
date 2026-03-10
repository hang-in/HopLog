"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

export default function LayoutWrapper({ children }: { children: React.ReactNode }) {
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div className={cn(
      "w-full mx-auto flex flex-col flex-grow max-w-5xl narrow:max-w-2xl",
      mounted && "transition-all duration-500 ease-in-out"
    )}>
      {children}
    </div>
  );
}
