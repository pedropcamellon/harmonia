"use client";

import { Music, Plus, Home } from "lucide-react";
import { usePathname } from "next/navigation";
import Link from "next/link";

import { Button } from "@/components/ui/button";

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
          <Button variant="ghost" asChild className={isActive("/") ? "bg-accent text-accent-foreground" : ""}>
            <Link href="/">
              <Home className="w-4 h-4 sm:mr-2" />
              <span className="hidden sm:inline">Library</span>
            </Link>
          </Button>

          <Button asChild className="rounded-full hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200 active:translate-y-0">
            <Link href="/new">
              <Plus className="w-4 h-4 mr-2" />
              <span>New Song</span>
            </Link>
          </Button>
        </div>
      </div>
    </nav>
  );
}