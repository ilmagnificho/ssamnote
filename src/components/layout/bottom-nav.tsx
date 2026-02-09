"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { CalendarDays, CalendarRange, User } from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
    { href: "/", label: "일간", icon: CalendarDays },
    { href: "/weekly", label: "주간", icon: CalendarRange },
    { href: "/student", label: "유아", icon: User },
];

export function BottomNav() {
    const pathname = usePathname();

    return (
        <nav className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-200 px-4 py-2 safe-area-bottom">
            <div className="max-w-2xl mx-auto flex items-center justify-around">
                {navItems.map((item) => {
                    const isActive = pathname === item.href;
                    const Icon = item.icon;

                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={cn(
                                "flex flex-col items-center gap-1 px-4 py-2 rounded-lg transition-all",
                                isActive
                                    ? "text-blue-600 bg-blue-50"
                                    : "text-gray-500 hover:text-gray-700 hover:bg-gray-50"
                            )}
                        >
                            <Icon className="h-5 w-5" />
                            <span className="text-xs font-medium">{item.label}</span>
                        </Link>
                    );
                })}
            </div>
        </nav>
    );
}
