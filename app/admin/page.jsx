import ProtectedRoute from "../components/ProtectedRoute";

export default function AdminPage() {
  return (
    <ProtectedRoute allowedRoles={["ADMIN"]}>
      <div className="flex flex-col flex-1 text-foreground px-6 sm:px-10 py-10">
      

        <main className="py-8">
          <h1 className="text-2xl text-primary font-bold neon-text mb-4">
            Admin Console
          </h1>
          <p className="text-muted mb-6">
            This is a placeholder admin page (admins only).
          </p>

          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            <div className="bg-panel border border-panel-border rounded-md p-5">
              <h3 className="text-primary font-bold">User Stats</h3>
              <p className="text-muted text-sm mt-2">Active users: —</p>
            </div>

            <div className="bg-panel border border-panel-border rounded-md p-5">
              <h3 className="text-primary font-bold">Site Settings</h3>
              <p className="text-muted text-sm mt-2">Configuration: —</p>
            </div>

            <div className="bg-panel border border-panel-border rounded-md p-5">
              <h3 className="text-primary font-bold">Logs</h3>
              <p className="text-muted text-sm mt-2">Recent events: —</p>
            </div>
          </div>
        </main>
      </div>
    </ProtectedRoute>
  );
}
