// src/app/dashboard/page.tsx
import { getServerSession } from "next-auth";
import { authOptions } from "@/auth"
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

function formatCurrency(amountInDollars: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(amountInDollars);
}

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);

  if (!session || !session.user || !session.user.email) {
    redirect("/signin");
  }

  const email = session.user.email;

  // Look up the DB user by email
  const user = await prisma.user.findUnique({
    where: { email },
    include: { projects: true },
  });

  const projects = user?.projects ?? [];

  const totalMrr = projects.reduce((sum, p) => sum + p.mrr, 0);
  const projectCount = projects.length;
  const activeProjectCount = projects.filter(
    (p) => p.status === "ACTIVE"
  ).length;

  const hasProjects = projects.length > 0;

  // Server action: create a new project for the current user
  async function createProject(formData: FormData) {
    "use server";

    const session = await getServerSession(authOptions);

    if (!session || !session.user || !session.user.email) {
      redirect("/signin");
    }

    const email = session.user.email;

    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      throw new Error("User not found");
    }

    const name = String(formData.get("name") || "").trim();
    const description = String(formData.get("description") || "").trim();

    const mrrRaw = formData.get("mrr");
    const activeUsersRaw = formData.get("activeUsers");
    const statusRaw = formData.get("status");

    const mrr = Number(mrrRaw || 0);
    const activeUsers = Number(activeUsersRaw || 0);
    const status = (statusRaw || "ACTIVE") as "ACTIVE" | "TRIALING" | "PAUSED" | "CANCELLED";

    if (!name) {
      // In a real app you'd surface this nicely; for demo, just stop.
      throw new Error("Project name is required.");
    }

    // Basic guards (don’t let negative or NaN values sneak in)
    const safeMrr = Number.isFinite(mrr) && mrr >= 0 ? Math.round(mrr) : 0;
    const safeActiveUsers =
      Number.isFinite(activeUsers) && activeUsers >= 0
        ? Math.round(activeUsers)
        : 0;

    await prisma.project.create({
      data: {
        name,
        description: description || null,
        mrr: safeMrr,
        activeUsers: safeActiveUsers,
        status,
        userId: user.id,
      },
    });

    // Refresh the dashboard so the new project + metrics appear
    revalidatePath("/dashboard");
  }


  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-black">
      <div className="max-w-5xl mx-auto px-4 py-10 sm:px-6 lg:px-8">
        {/* Header */}
        <section className="mb-8 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-zinc-900 dark:text-zinc-50">
              Dashboard
            </h1>
            <p className="text-sm text-zinc-600 dark:text-zinc-400">
              Signed in as <span className="font-mono">{email}</span>
            </p>
          </div>
          <a
            href="#new-project"
            className="inline-flex items-center justify-center rounded-md bg-black border border-zinc-200 bg-white px-4 py-2 text-sm font-medium text-zinc-900 shadow-sm hover:bg-zinc-800 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100 cursor-pointer"
          >
            New project
          </a>
        </section>

        {/* Summary metrics */}
        <section className="mb-8 grid gap-4 sm:grid-cols-3">
          <div className="rounded-lg border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-900">
            <p className="text-xs uppercase tracking-wide text-zinc-500">
              Total MRR
            </p>
            <p className="mt-2 text-xl font-semibold text-zinc-900 dark:text-zinc-50">
              {formatCurrency(totalMrr)}
            </p>
          </div>
          <div className="rounded-lg border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-900">
            <p className="text-xs uppercase tracking-wide text-zinc-500">
              Projects
            </p>
            <p className="mt-2 text-xl font-semibold text-zinc-900 dark:text-zinc-50">
              {projectCount}
            </p>
          </div>
          <div className="rounded-lg border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-900">
            <p className="text-xs uppercase tracking-wide text-zinc-500">
              Active projects
            </p>
            <p className="mt-2 text-xl font-semibold text-zinc-900 dark:text-zinc-50">
              {activeProjectCount}
            </p>
          </div>
        </section>

        {/* Projects list */}
        <section className="mb-10">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">
              Your projects
            </h2>
          </div>

          {hasProjects ? (
            <div className="grid gap-4 sm:grid-cols-2">
              {projects.map((project) => (
                <article
                  key={project.id}
                  className="flex flex-col justify-between rounded-lg border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-900"
                >
                  <div>
                    <div className="mb-2 flex items-center justify-between">
                      <h3 className="text-base font-semibold text-zinc-900 dark:text-zinc-50">
                        {project.name}
                      </h3>
                      <span className={statusPillClass(project.status)}>
                        {project.status}
                      </span>
                    </div>
                    {project.description && (
                      <p className="mb-3 line-clamp-3 text-sm text-zinc-600 dark:text-zinc-400">
                        {project.description}
                      </p>
                    )}
                  </div>
                  <dl className="mt-2 grid grid-cols-2 gap-2 text-sm">
                    <div>
                      <dt className="text-xs uppercase tracking-wide text-zinc-500">
                        MRR
                      </dt>
                      <dd className="font-medium text-zinc-900 dark:text-zinc-50">
                        {formatCurrency(project.mrr)}
                      </dd>
                    </div>
                    <div>
                      <dt className="text-xs uppercase tracking-wide text-zinc-500">
                        Active users
                      </dt>
                      <dd className="font-medium text-zinc-900 dark:text-zinc-50">
                        {project.activeUsers}
                      </dd>
                    </div>
                  </dl>
                  <p className="mt-3 text-xs text-zinc-500">
                    Created{" "}
                    {new Date(project.createdAt).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </p>
                </article>
              ))}
            </div>
          ) : (
            <div className="rounded-lg border border-dashed border-zinc-300 bg-zinc-50 p-6 text-center text-sm text-zinc-600 dark:border-zinc-700 dark:bg-zinc-900/40 dark:text-zinc-400">
              <p className="mb-3 text-base font-medium text-zinc-900 dark:text-zinc-50">
                No projects yet
              </p>
              <p className="mb-4">
                Create your first project to see your dashboard in action.
              </p>
              <a
                href="#new-project"
                className="inline-flex items-center justify-center rounded-md border border-zinc-200 bg-white px-4 py-2 text-sm font-medium text-zinc-900 shadow-sm hover:bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100"
              >
                Create your first project
              </a>
            </div>
          )}
        </section>
        <section
          id="new-project"
          className="border-t border-zinc-200 pt-6 dark:border-zinc-800 mt-10"
        >
          <h2 className="mb-2 text-lg font-semibold text-zinc-900 dark:text-zinc-50">
            New project
          </h2>
          <p className="mb-4 text-sm text-zinc-600 dark:text-zinc-400">
            Create a new project to track on your dashboard. In a real client
            sprint, this would be tailored to their product.
          </p>

          <form
            action={createProject}
            className="grid gap-4 rounded-lg border border-zinc-200 bg-white p-4 text-sm dark:border-zinc-800 dark:bg-zinc-900"
          >
            <div className="grid gap-2">
              <label
                htmlFor="name"
                className="text-xs font-medium uppercase tracking-wide text-zinc-500"
              >
                Project name
              </label>
              <input
                id="name"
                name="name"
                required
                placeholder="Marketing Site v2"
                className="rounded-md border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 shadow-sm outline-none ring-0 placeholder:text-zinc-400 focus:border-zinc-500 dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-50"
              />
            </div>

            <div className="grid gap-2">
              <label
                htmlFor="description"
                className="text-xs font-medium uppercase tracking-wide text-zinc-500"
              >
                Description (optional)
              </label>
              <textarea
                id="description"
                name="description"
                rows={3}
                placeholder="Short description of this project..."
                className="rounded-md border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 shadow-sm outline-none ring-0 placeholder:text-zinc-400 focus:border-zinc-500 dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-50"
              />
            </div>

            <div className="grid gap-4 sm:grid-cols-3">
              <div className="grid gap-2">
                <label
                  htmlFor="mrr"
                  className="text-xs font-medium uppercase tracking-wide text-zinc-500"
                >
                  Monthly MRR (USD)
                </label>
                <input
                  id="mrr"
                  name="mrr"
                  type="number"
                  min={0}
                  placeholder="1200"
                  className="rounded-md border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 shadow-sm outline-none ring-0 placeholder:text-zinc-400 focus:border-zinc-500 dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-50"
                />
              </div>

              <div className="grid gap-2">
                <label
                  htmlFor="activeUsers"
                  className="text-xs font-medium uppercase tracking-wide text-zinc-500"
                >
                  Active users
                </label>
                <input
                  id="activeUsers"
                  name="activeUsers"
                  type="number"
                  min={0}
                  placeholder="50"
                  className="rounded-md border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 shadow-sm outline-none ring-0 placeholder:text-zinc-400 focus:border-zinc-500 dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-50"
                />
              </div>

              <div className="grid gap-2">
                <label
                  htmlFor="status"
                  className="text-xs font-medium uppercase tracking-wide text-zinc-500"
                >
                  Status
                </label>
                <select
                  id="status"
                  name="status"
                  defaultValue="ACTIVE"
                  className="rounded-md border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 shadow-sm outline-none ring-0 focus:border-zinc-500 dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-50"
                >
                  <option value="ACTIVE">ACTIVE</option>
                  <option value="TRIALING">TRIALING</option>
                  <option value="PAUSED">PAUSED</option>
                  <option value="CANCELLED">CANCELLED</option>
                </select>
              </div>
            </div>

            <div className="mt-2 flex justify-end">
              <button
                type="submit"
                className="cursor-pointer inline-flex items-center justify-center rounded-md bg-zinc-900 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-zinc-800 dark:bg-zinc-50 dark:text-zinc-950 dark:hover:bg-zinc-200"
              >
                Create project
              </button>
            </div>
          </form>
        </section>
      </div>
    </div>
  );
}

// Helper to style status pill based on status
function statusPillClass(status: string) {
  const base =
    "inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium";

  switch (status) {
    case "ACTIVE":
      return base + " bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-200";
    case "TRIALING":
      return base + " bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-200";
    case "PAUSED":
      return base + " bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-200";
    case "CANCELLED":
      return base + " bg-zinc-200 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300";
    default:
      return base + " bg-zinc-200 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300";
  }
}

