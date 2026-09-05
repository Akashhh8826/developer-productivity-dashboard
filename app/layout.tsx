import type { Metadata } from "next";
import "./globals.css";
import { DataProvider } from "@/context/DataContext";
import { AppShell } from "@/components/layout/AppShell";

export const metadata: Metadata = {
  title: "DevPulse — Developer Productivity Dashboard",
  description:
    "A responsive engineering productivity dashboard for tracking full-stack development projects, sprint tasks, and delivery velocity.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark" data-theme="slate">
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              try {
                var theme = localStorage.getItem('devpulse_theme') || 'slate';
                document.documentElement.setAttribute('data-theme', theme);
                if (theme === 'nordic') {
                  document.documentElement.classList.remove('dark');
                } else {
                  document.documentElement.classList.add('dark');
                }
              } catch (e) {}
            `,
          }}
        />
      </head>
      <body className="min-h-screen antialiased">
        <DataProvider>
          <AppShell>{children}</AppShell>
        </DataProvider>
      </body>
    </html>
  );
}
