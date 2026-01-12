"use client";

import Link from "next/link";

import { cn } from "@/lib/utils";

export function NavLink({ href, active, children }: { href: string, active: boolean, children: React.ReactNode }) {
  return (
    <Link href={href}>
      <div className={cn(
        "flex items-center px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 cursor-pointer",
        active
          ? "bg-secondary text-secondary-foreground shadow-sm"
          : "text-muted-foreground hover:text-foreground hover:bg-secondary/50"
      )}>
        {children}
      </div>
    </Link>
  );
}
