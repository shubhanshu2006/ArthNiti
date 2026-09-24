import React from "react";
import type { Metadata } from "next";
import AppShell from "../../components/dashboard/AppShell";

export const metadata: Metadata = {
  title: "Dashboard — ArthNiti",
  description:
    "Your intelligent financial dashboard. Monitor income, savings, investments, and tax in one place.",
};

export default function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <AppShell>{children}</AppShell>;
}
