"use client";

import { usePathname } from "next/navigation";

const style = `
@keyframes page-enter {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}
`;

export default function PageTransition({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <>
      <style>{style}</style>
      <div key={pathname} style={{ animation: "page-enter 0.35s ease-out both" }}>
        {children}
      </div>
    </>
  );
}
