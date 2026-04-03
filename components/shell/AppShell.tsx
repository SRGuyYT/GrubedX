import type { ReactNode } from "react";

import { GuestModeBanner } from "@/components/user/GuestModeBanner";
import { Footer } from "@/components/shell/Footer";
import { Navbar } from "@/components/shell/Navbar";

export function AppShell({ children }: { children: ReactNode }) {
  return (
    <div className="grain min-h-screen overflow-x-hidden">
      <Navbar />
      <div className="pt-28 md:pt-32">
        <GuestModeBanner />
        <main>{children}</main>
      </div>
      <Footer />
    </div>
  );
}
