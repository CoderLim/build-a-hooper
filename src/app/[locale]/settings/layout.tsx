"use client";

import { useTranslations } from "next-intl";
import { LayoutDashboard, User, CreditCard, Key, Receipt, Coins } from "lucide-react";
import { envConfigs } from "@/config";
import { AppLayout } from "@/components/app-layout";

export default function SettingsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const t = useTranslations();

  const group = t("common.systems.settings");
  const navItems = [
    { href: "/settings", label: t("settings.nav.overview"), icon: LayoutDashboard, group },
    { href: "/settings/profile", label: t("settings.nav.profile"), icon: User, group },
    { href: "/settings/billing", label: t("settings.nav.billing"), icon: CreditCard, group },
    { href: "/settings/payments", label: t("settings.nav.payments"), icon: Receipt, group },
    { href: "/settings/credits", label: t("settings.nav.credits"), icon: Coins, group },
    { href: "/settings/apikeys", label: t("settings.nav.apikeys"), icon: Key, group },
  ];

  return (
    <AppLayout navItems={navItems} brand={envConfigs.app_name}>
      {children}
    </AppLayout>
  );
}
