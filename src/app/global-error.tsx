/* eslint-disable @next/next/no-page-custom-font, @next/next/no-html-link-for-pages */
"use client";

import { useEffect } from "react";

const styles = `
:root{--background:#ffffff;--foreground:#09090b;--muted:#f4f4f5;--muted-bg:rgba(244,244,245,0.3);--muted-foreground:#71717a;--border:#e4e4e7;--border-half:rgba(228,228,231,0.5);--primary:#3b82f6;--primary-bg:rgba(59,130,246,0.1);--primary-border:rgba(59,130,246,0.2);--gradient:radial-gradient(circle at top,rgba(59,130,246,0.12),transparent 45%)}
@media (prefers-color-scheme:dark){:root{--background:#09090b;--foreground:#fafafa;--muted:#27272a;--muted-bg:rgba(39,39,42,0.3);--muted-foreground:#a1a1aa;--border:#27272a;--border-half:rgba(39,39,42,0.5);--primary:#60a5fa;--primary-bg:rgba(96,165,250,0.1);--primary-border:rgba(96,165,250,0.2);--gradient:radial-gradient(circle at top,rgba(96,165,250,0.14),transparent 45%)}}
*{box-sizing:border-box}
body{font-family:'Geist',sans-serif;background-color:var(--background);color:var(--foreground);margin:0;min-height:100vh;display:flex;align-items:center;justify-content:center;padding:1.25rem}
.error-container{position:relative;overflow:hidden;border-radius:2rem;border:1px solid var(--border-half);background-color:var(--muted-bg);padding:3rem 1.25rem;width:100%;max-width:42rem;margin:0 auto}
@media (min-width:640px){.error-container{padding:4rem 2rem}}
.error-gradient{position:absolute;top:0;left:0;right:0;bottom:0;background:var(--gradient);pointer-events:none}
.error-content{position:relative;display:flex;flex-direction:column;align-items:flex-start;gap:1.25rem}
.error-badge{border-radius:9999px;border:1px solid var(--primary-border);background-color:var(--primary-bg);padding:0.25rem 0.75rem;font-size:11px;font-weight:900;text-transform:uppercase;letter-spacing:0.28em;color:var(--primary)}
.error-text{display:flex;flex-direction:column;gap:0.75rem}
.error-title{margin:0;font-size:1.875rem;font-weight:700;letter-spacing:-0.025em;line-height:1.2}
@media (min-width:640px){.error-title{font-size:2.25rem}}
.error-description{margin:0;font-size:15px;line-height:1.625;color:var(--muted-foreground);max-width:36rem}
@media (min-width:640px){.error-description{font-size:16px}}
.error-actions{display:flex;flex-wrap:wrap;gap:0.75rem;padding-top:0.25rem}
.btn{display:inline-flex;align-items:center;gap:0.5rem;border-radius:9999px;padding:0.625rem 1rem;font-size:13px;font-weight:700;text-decoration:none;cursor:pointer;transition:all 0.2s;font-family:inherit;border:none}
.btn-primary{background-color:var(--foreground);color:var(--background)}
.btn-primary:hover{background-color:var(--primary);color:var(--background)}
.btn-secondary{background-color:rgba(255,255,255,0.7);color:var(--foreground);border:1px solid var(--border)}
@media (prefers-color-scheme:dark){.btn-secondary{background-color:rgba(9,9,11,0.7)}}
.btn-secondary:hover{background-color:var(--muted)}
`;

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Geist:wght@400;700;900&display=swap"
          rel="stylesheet"
        />
        <style dangerouslySetInnerHTML={{ __html: styles }} />
      </head>
      <body>
        <div className="error-container">
          <div className="error-gradient" />
          <div className="error-content">
            <span className="error-badge">500</span>
            <div className="error-text">
              <h1 className="error-title">Something went wrong</h1>
              <p className="error-description">
                An unexpected error occurred. Please try again or return to the
                home page.
              </p>
            </div>
            <div className="error-actions">
              <a href="/" className="btn btn-primary">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <path d="m12 19-7-7 7-7" />
                  <path d="M19 12H5" />
                </svg>
                Back Home
              </a>
              <button
                type="button"
                onClick={reset}
                className="btn btn-secondary"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
                  <path d="M3 3v5h5" />
                </svg>
                Try Again
              </button>
            </div>
          </div>
        </div>
      </body>
    </html>
  );
}
