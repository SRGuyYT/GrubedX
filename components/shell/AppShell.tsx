import type { ReactNode } from "react";

import { Footer } from "@/components/shell/Footer";
import { Navbar } from "@/components/shell/Navbar";

export function AppShell({ children }: { children: ReactNode }) {
  return (
    <div className="grain min-h-screen overflow-x-hidden">
      <Navbar />
      <div className="pb-12 pt-[calc(5.5rem+env(safe-area-inset-top))] md:pt-[calc(6rem+env(safe-area-inset-top))]">
        <main>{children}</main>
        <Footer />
      </div>
    </div>
  );
}
