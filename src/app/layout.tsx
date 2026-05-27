import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "@/app/globals.css";
import { AppShell } from "@/components/shell/app-shell";
import { StoreProvider } from "@/lib/store";
import { ToastProvider } from "@/components/ui/toast";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Equipro LPG Stock Manager",
  description: "LPG gas cylinder stock taking, sales, delivery, returns, and reports for Equipro Investments (K) Ltd."
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ToastProvider>
          <StoreProvider>
            <AppShell>{children}</AppShell>
          </StoreProvider>
        </ToastProvider>
      </body>
    </html>
  );
}
