import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { siteOperator } from "../../site-operator";

export const metadata: Metadata = {
  title: "Реквизиты — Кривые Линии WEB",
  robots: {
    index: false,
    follow: false,
  },
};

export default function RequisitesPage() {
  redirect(siteOperator ? "/documents#details" : "/documents");
}
