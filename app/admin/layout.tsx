import React from "react";
import AdminLayout from "@/components/admin/AdminLayout";

export const metadata = {
  title: "Admin CMS | Noorul Hassan",
  description: "Secure Content Management System for Noorul Hassan's Portfolio.",
};

export default function AdminRootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <AdminLayout>{children}</AdminLayout>;
}
