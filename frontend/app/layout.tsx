import type { Metadata } from "next";
import "@fontsource/cairo/400.css";
import "@fontsource/cairo/600.css";
import "@fontsource/cairo/700.css";
import "@fontsource/ibm-plex-sans-arabic/400.css";
import "@fontsource/ibm-plex-sans-arabic/500.css";
import "@fontsource/ibm-plex-sans-arabic/600.css";
import "@fontsource/rakkas/400.css";
import "./globals.css";
import { siteConfig } from "@/config/site.config";
import { ToastProvider } from "@/src/shared/components/ui/ToastProvider";

import { ThemeProvider } from "@/src/shared/components/ThemeProvider";
import { ThemeToggle } from "@/src/shared/components/ThemeToggle";
import { FloatingWhatsApp } from "@/src/shared/components/FloatingWhatsApp";

export const metadata: Metadata = {
  title: `${siteConfig.teacher.name} | استلم شرحك`,
  description: siteConfig.teacher.bio,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="ar"
      dir="rtl"
      suppressHydrationWarning
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: `
          (function() {
            var t = localStorage.getItem('theme');
            if (t === 'dark') {
              document.documentElement.classList.add('dark');
            }
          })();
        `}} />
      </head>
      <body>
        <ThemeProvider>
          {children}
          <ThemeToggle />
          <ToastProvider />
          <FloatingWhatsApp />
        </ThemeProvider>
      </body>
    </html>
  );
}
