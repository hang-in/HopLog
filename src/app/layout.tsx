import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { ThemeProvider } from "@/components/theme-provider";
import Header from "@/components/Header";
import LayoutWrapper from "@/components/LayoutWrapper";
import CommandPalette from "@/components/CommandPalette";
import { getAllPosts } from "@/lib/posts";
import { getConfig, getSEOConfig } from "@/lib/config";
import { getColorSchemas } from "@/lib/schemas";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#000000" },
  ],
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export function generateMetadata(): Metadata {
  const config = getConfig();
  const seo = getSEOConfig();

  return {
    metadataBase: new URL(seo.siteUrl),
    title: {
      template: config.site.titleTemplate,
      default: config.site.title,
    },
    description: config.site.description,
    keywords: seo.keywords,
    appleWebApp: {
      capable: true,
      title: config.site.title,
      statusBarStyle: "default",
    },
    alternates: {
      canonical: "/",
    },
    openGraph: {
      title: seo.openGraph.title,
      description: seo.openGraph.description,
      url: seo.siteUrl,
      siteName: seo.openGraph.siteName,
      locale: seo.language,
      type: "website",
      images: [
        {
          url: seo.openGraph.image,
          width: seo.openGraph.imageWidth,
          height: seo.openGraph.imageHeight,
          alt: seo.openGraph.title,
        },
      ],
    },
    twitter: {
      card: seo.twitter.card,
      title: seo.openGraph.title,
      description: seo.openGraph.description,
      images: [seo.twitter.image],
      site: seo.twitter.site,
      creator: seo.twitter.creator,
    },
    icons: {
      icon: "/icon",
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-video-preview": -1,
        "max-image-preview": "large",
        "max-snippet": -1,
      },
    },
  };
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const posts = getAllPosts();
  const config = getConfig();
  const seo = getSEOConfig();
  const schemas = getColorSchemas();

  // Color schemas to CSS variables
  const schemaCss = schemas.map(schema => {
    const processVars = (colorMap: Record<string, string>) => {
      const vars = Object.entries(colorMap).map(([k, v]) => `--${k}: ${v};`);
      // Auto-generate activity levels if not explicitly defined
      if (!colorMap['activity-0']) vars.push(`--activity-0: var(--muted);`);
      if (!colorMap['activity-1']) vars.push(`--activity-1: ${colorMap.primary}40;`);
      if (!colorMap['activity-2']) vars.push(`--activity-2: ${colorMap.primary}80;`);
      if (!colorMap['activity-3']) vars.push(`--activity-3: ${colorMap.primary}c0;`);
      if (!colorMap['activity-4']) vars.push(`--activity-4: ${colorMap.primary};`);
      return vars.join('');
    };

    const lightVars = processVars(schema.light);
    const darkVars = processVars(schema.dark);
    return `
      [data-color-schema="${schema.id}"] { ${lightVars} }
      .dark[data-color-schema="${schema.id}"] { ${darkVars} }
    `;
  }).join('\n');

  // GEO Optimization: JSON-LD Structured Data
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": config.site.title,
    "url": seo.siteUrl,
    "description": config.site.description,
    "author": {
      "@type": "Person",
      "name": config.profile.name,
      "description": config.profile.bio,
      "url": config.profile.github,
    },
    "publisher": {
      "@type": "Organization",
      "name": config.site.title,
      "logo": {
        "@type": "ImageObject",
        "url": `${seo.siteUrl}/logo.svg`,
      },
    },
  };

  return (
    <html lang={seo.language.split("-")[0]} data-color-schema="default" suppressHydrationWarning>
      <head>
        <style dangerouslySetInnerHTML={{ __html: schemaCss }} />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              try {
                var store = localStorage.getItem('vimlog-storage');
                if (store) {
                  var parsed = JSON.parse(store);
                  if (parsed && parsed.state) {
                    if (parsed.state.isWideMode === false) {
                      document.documentElement.setAttribute('data-wide', 'false');
                    }
                    if (parsed.state.colorSchema) {
                      document.documentElement.setAttribute('data-color-schema', parsed.state.colorSchema);
                    }
                  }
                }
              } catch (e) {}
            `,
          }}
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen flex flex-col`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <Header title={config.site.title} />
          <CommandPalette posts={posts} schemas={schemas} />
          <LayoutWrapper>
            <main className="flex-grow w-full px-6 py-12 md:py-12">
              {children}
            </main>

            <footer className="w-full px-6 py-12 border-t border-border mt-auto">
              <div className="flex flex-col sm:flex-row justify-between items-center gap-6">
                <p className="text-[12px] text-muted-foreground font-medium">
                  © 2026 {config.profile.email}. All rights reserved.
                </p>
                <div className="flex flex-wrap justify-center gap-2">
                  {config.social.map((link, idx) => (
                    <a
                      key={idx}
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-3 py-1 bg-muted/50 hover:bg-primary/10 text-muted-foreground hover:text-primary text-[11px] font-bold rounded-full transition-all duration-200 border border-border/50 hover:border-primary/30"
                    >
                      {link.platform}
                    </a>
                  ))}
                </div>
              </div>
            </footer>
          </LayoutWrapper>
        </ThemeProvider>
      </body>
    </html>
  );
}
