"use client";

import { useEffect, useState } from "react";
import { ChevronDown, type LucideIcon } from "lucide-react";
import { Link, usePathname } from "@/core/i18n/navigation";
import { localizeHref } from "@/paraglide/runtime.js";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

export interface NavItem {
  href: string;
  label: string;
  icon: LucideIcon;
  group?: string;
  newTab?: boolean;
}

export function AppSidebar({
  brand,
  brandHref = "/",
  navItems,
  footerNavItems,
  footer,
}: {
  brand: React.ReactNode;
  brandHref?: string;
  navItems: NavItem[];
  footerNavItems?: NavItem[];
  footer?: React.ReactNode;
}) {
  const pathname = usePathname();

  // Group nav items
  const groups: { label?: string; items: NavItem[] }[] = [];
  let currentGroup: string | undefined = '__initial__';
  for (const item of navItems) {
    if (item.group !== currentGroup) {
      groups.push({ label: item.group, items: [item] });
      currentGroup = item.group;
    } else {
      groups[groups.length - 1].items.push(item);
    }
  }

  const isItemActive = (item: NavItem) =>
    item.href === navItems[0]?.href
      ? pathname === item.href
      : pathname.startsWith(item.href);

  // The group that contains the current route — kept expanded.
  const activeGroupLabel = groups.find((g) => g.items.some(isItemActive))?.label;

  // Collapsible group state, persisted per sidebar (admin vs settings) so the
  // two surfaces don't share collapse state. Starts all-expanded to match SSR,
  // then hydrates from localStorage.
  const storageKey = `sidebar-collapsed:${brandHref}`;
  const [collapsed, setCollapsed] = useState<Set<string>>(new Set());

  useEffect(() => {
    let saved: string[] = [];
    try {
      saved = JSON.parse(localStorage.getItem(storageKey) || "[]");
    } catch {}
    const next = new Set(saved);
    if (activeGroupLabel) next.delete(activeGroupLabel);
    setCollapsed(next);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [storageKey]);

  // Keep the active group open as the route changes, without touching others.
  useEffect(() => {
    if (!activeGroupLabel) return;
    setCollapsed((prev) => {
      if (!prev.has(activeGroupLabel)) return prev;
      const next = new Set(prev);
      next.delete(activeGroupLabel);
      return next;
    });
  }, [activeGroupLabel]);

  function toggleGroup(label: string) {
    setCollapsed((prev) => {
      const next = new Set(prev);
      if (next.has(label)) next.delete(label);
      else next.add(label);
      try {
        localStorage.setItem(storageKey, JSON.stringify([...next]));
      } catch {}
      return next;
    });
  }

  return (
    <Sidebar variant="inset">
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <Link
              href={brandHref}
              className="flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-left text-sm hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
            >
              <span className="flex-1 font-serif italic text-lg leading-none">
                {brand}
              </span>
            </Link>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent>
        {groups.map((group, gi) => {
          const label = group.label;
          const isCollapsed = !!label && collapsed.has(label);
          return (
            <SidebarGroup key={gi}>
              {label && (
                <SidebarGroupLabel
                  role="button"
                  tabIndex={0}
                  onClick={() => toggleGroup(label)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      toggleGroup(label);
                    }
                  }}
                  aria-expanded={!isCollapsed}
                  className="flex cursor-pointer select-none items-center justify-between pr-1 hover:text-sidebar-foreground"
                >
                  <span>{label}</span>
                  <ChevronDown
                    className={`size-3.5 shrink-0 text-muted-foreground transition-transform ${
                      isCollapsed ? "-rotate-90" : ""
                    }`}
                  />
                </SidebarGroupLabel>
              )}
              {!isCollapsed && (
                <SidebarGroupContent className="flex flex-col gap-2">
                  <SidebarMenu>
                    {group.items.map((item) => {
                      const Icon = item.icon;
                      const isActive = isItemActive(item);
                      return (
                        <SidebarMenuItem key={item.href}>
                          <Link href={item.href}>
                            <SidebarMenuButton tooltip={item.label} isActive={isActive}>
                              <Icon />
                              <span>{item.label}</span>
                            </SidebarMenuButton>
                          </Link>
                        </SidebarMenuItem>
                      );
                    })}
                  </SidebarMenu>
                </SidebarGroupContent>
              )}
            </SidebarGroup>
          );
        })}
      </SidebarContent>

      <SidebarFooter>
        {footerNavItems && footerNavItems.length > 0 && (
          <SidebarMenu>
            {footerNavItems.map((item) => {
              const Icon = item.icon;
              const isActive = item.newTab
                ? false
                : item.href === "/"
                  ? pathname === "/"
                  : pathname.startsWith(item.href);
              const button = (
                <SidebarMenuButton tooltip={item.label} isActive={isActive}>
                  <Icon />
                  <span>{item.label}</span>
                </SidebarMenuButton>
              );
              return (
                <SidebarMenuItem key={item.href}>
                  {item.newTab ? (
                    <a
                      href={localizeHref(item.href)}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {button}
                    </a>
                  ) : (
                    <Link href={item.href}>{button}</Link>
                  )}
                </SidebarMenuItem>
              );
            })}
          </SidebarMenu>
        )}
        {footer}
      </SidebarFooter>
    </Sidebar>
  );
}
