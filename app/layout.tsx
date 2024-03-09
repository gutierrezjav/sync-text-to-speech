import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Text Sync",
  description: "Text Sync",
};

import { AppTheme } from "./theme";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="container mx-auto h-full bg-yellow-400">
        <AppTheme>{children}</AppTheme>
      </body>
    </html>
  );
}
