import type { ReactNode } from "react";

import { Footer } from "@/components/shell/Footer";
import { Navbar } from "@/components/shell/Navbar";

export function AppShell({ children }: { children: ReactNode }) {
  return (
    <div className="grain min-h-screen overflow-x-hidden">
      <Navbar />
      <div className="pb-24 pt-20 md:pl-24 md:pb-12 md:pt-8 xl:pl-80">
        <main>{children}</main>
        <Footer />
      </div>
    </div>
  );
}
