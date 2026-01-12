"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Music, Plus, Home } from "lucide-react";
import { cn } from "@/lib/utils";

export function Navigation() {
  const pathname = usePathname();

  const isActive = (path: string) => pathname === path;

  return (
    <nav className="sticky top-0 z-50 w-full border-b bg-background/80 backdrop-blur-md supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 group">
          <div className="p-2 bg-primary rounded-lg group-hover:bg-accent transition-colors duration-300">
            <Music className="w-5 h-5 text-primary-foreground" />
          </div>
          <span className="font-bold text-xl tracking-tight">Harmonia</span>
        </Link>

        <div className="flex items-center gap-1 sm:gap-4">
          <NavLink href="/" active={isActive("/")}>
            <Home className="w-4 h-4 sm:mr-2" />
            <span className="hidden sm:inline">Library</span>
          </NavLink>
          
          <Link href="/new">
            <button className="flex items-center gap-2 px-4 py-2 rounded-full bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200 active:translate-y-0">
              <Plus className="w-4 h-4" />
              <span>New Song</span>
            </button>
          </Link>
        </div>
      </div>
    </nav>
  );
}

function NavLink({ href, active, children }: { href: string, active: boolean, children: React.ReactNode }) {
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
