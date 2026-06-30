import type { Metadata } from "next";
import { AdminEditor } from "@/components/AdminEditor";
import { adminContentFiles } from "@/content/adminContentFiles";

export const metadata: Metadata = {
  title: "Velomac Admin",
  robots: {
    index: false,
    follow: false
  }
};

export default function AdminPage() {
  return <AdminEditor files={adminContentFiles} />;
}
