import type { Metadata } from "next";
import "./globals.css";
import AuthProvider from "./utils/auth/auth-provider";

export const metadata: Metadata = {
  title: "PropertyPulse",
  description: "Find and manage rental properties",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full font-sans">
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
