"use client";

import React from "react";
import { usePathname } from "next/navigation";
import { AdminLayout as LayoutComponent } from "@/components/admin/layout/AdminLayout";

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const pathname = usePathname();
    const isLoginPage = pathname === "/admin/login";

    if (isLoginPage) {
        return (
            <div className="admin-root">
                {children}
            </div>
        );
    }

    return (
        <div className="admin-root">
            <LayoutComponent>
                {children}
            </LayoutComponent>
        </div>
    );
}
