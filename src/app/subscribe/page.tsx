import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/auth";

export default async function SubscribePage() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) redirect("/signin"); // must be signed in

  return (
    <main className="max-w-3xl mx-auto p-8 space-y-4">
      <h1 className="text-2xl font-semibold">Subscribe</h1>
      <form action="/api/checkout" method="post">
        <button className="inline-flex items-center justify-center rounded-md bg-white text-black px-4 py-2 text-sm font-medium border border-zinc-300 hover:bg-zinc-100 hover:border-zinc-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black focus-visible:ring-offset-2 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed dark:bg-zinc-900 dark:text-white dark:border-zinc-700 dark:hover:bg-zinc-800">
          Start Checkout
        </button>
      </form>
      <p className="text-sm text-gray-500">You’ll use your account email for billing.</p>
    </main>
  );
}
