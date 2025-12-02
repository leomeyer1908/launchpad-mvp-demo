import { getServerSession } from "next-auth";
import { authOptions } from "@/auth";
import Link from "next/link";
import ManageBillingButton from "@/components/ManageBillingButton";

export default async function ProtectedPage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    return (
      <main className="mx-auto max-w-2xl p-8">
        <h1 className="mb-2 text-2xl font-semibold">Account</h1>
        <p className="mb-4 text-sm text-zinc-600">You must sign in to view your account.</p>
        <Link className="text-sm font-medium text-blue-600 underline" href="/signin">
          Go to sign in
        </Link>
      </main>
    );
  }

  const email = session.user?.email ?? "your account";

  return (
    <main className="mx-auto max-w-2xl p-8">
      <section className="rounded-lg border border-zinc-200 bg-white p-6 shadow-sm">
        <h1 className="text-xl font-semibold text-zinc-900">Account</h1>
        <p className="mt-1 text-sm text-zinc-600">
          You&apos;re signed in as{" "}
          <span className="font-mono text-zinc-800">{email}</span>.
        </p>

        <div className="mt-4 space-y-2 text-sm text-zinc-600">
          <p>
            If you have an active subscription, you can manage your billing
            details, update your card, or cancel from the Stripe customer
            portal.
          </p>
        </div>

        <div className="mt-6">
          <ManageBillingButton />
        </div>
      </section>
    </main>
  );
}

