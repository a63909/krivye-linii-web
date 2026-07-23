import type { ReactNode } from "react";
import AboutHeader from "../about/about-header";

export default function ClientsLayout({ children }: { children: ReactNode }) {
  return (
    <div className="site-shell clients-shell">
      <AboutHeader active="clients" />
      <main className="clients-empty-page">{children}</main>
    </div>
  );
}
