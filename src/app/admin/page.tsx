import { DashboardOverview } from "@/components/admin/dashboard/DashboardOverview";
import { AdminLayout } from "@/components/admin/layout/AdminLayout";

export default function AdminDashboardPage() {
    return (
        <AdminLayout>
            <DashboardOverview />
        </AdminLayout>
    );
}
