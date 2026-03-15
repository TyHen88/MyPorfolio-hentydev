import { AdminContainerList } from "@/components/features/admin/AdminContainerList";

const AdminPage = () => {
    return (
        <main className="min-h-screen bg-background text-foreground">
            <section className="mx-auto max-w-6xl px-6 py-8">
                <div className="mb-6">
                    <p className="text-sm text-muted-foreground">Admin / Contents</p>
                    <h1 className="text-2xl font-bold">Manage Contents</h1>
                </div>
                <AdminContainerList />
            </section>
        </main>
    );
};

export default AdminPage;