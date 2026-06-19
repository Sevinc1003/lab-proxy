import ProtectedRoute from "../components/ProtectedRoute";

export const metadata = {
  title: "DevForge // dashboard",
  description: "Get your posts from DevForge",
};

export default async function DashboardPage() {
  const res = await fetch("https://jsonplaceholder.typicode.com/posts", {
    next: { revalidate: 60 },
  });
  const posts = await res.json();

  return (
    <ProtectedRoute allowedRoles={["USER", "ADMIN"]}>
      <div className="flex flex-col flex-1 text-foreground px-6 sm:px-10 py-10">


        <section className="px-0 py-8">
          <h1 className="text-2xl text-primary font-bold neon-text mb-4">
            Dashboard
          </h1>
          <p className="text-muted mb-6">Latest posts (from jsonplaceholder)</p>

          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {posts.slice(0, 12).map((p) => (
              <article
                key={p.id}
                className="bg-panel border border-panel-border rounded-md p-5 hover:border-primary transition-colors"
              >
                <h3 className="text-primary font-bold">{p.title}</h3>
                <p className="text-muted text-sm mt-2">{p.body}</p>
              </article>
            ))}
          </div>
        </section>
      </div>
    </ProtectedRoute>
  );
}
