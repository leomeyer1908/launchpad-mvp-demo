import Link from "next/link";
import { getServerSession } from "next-auth";
import { authOptions } from "@/auth";

export default async function Header() {
  const session = await getServerSession(authOptions);
  const email = session?.user?.email ?? null;
  const isLoggedIn = !!email;

  return (
    <header className="border-b border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-950">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
        {/* Left: brand */}
        <div className="flex items-center gap-2">
          <Link
            href="/"
            className="text-sm font-semibold text-zinc-900 dark:text-zinc-50"
          >
            LaunchPad
          </Link>
          <span className="text-xs text-zinc-400">MVP demo</span>
        </div>

        {/* Right: nav + auth controls */}
        <nav className="flex items-center gap-4 text-sm">
          <Link
            href="/"
            className="text-zinc-700 hover:text-zinc-900 dark:text-zinc-300 dark:hover:text-zinc-50"
          >
            Home
          </Link>

          {isLoggedIn && (
            <Link
              href="/dashboard"
              className="text-zinc-700 hover:text-zinc-900 dark:text-zinc-300 dark:hover:text-zinc-50"
            >
              Dashboard
            </Link>
          )}

          <Link
            href="/subscribe"
            className="text-zinc-700 hover:text-zinc-900 dark:text-zinc-300 dark:hover:text-zinc-50"
          >
            Subscribe
          </Link>
		  <Link href="/protected" 
            className="text-zinc-700 hover:text-zinc-900 dark:text-zinc-300 dark:hover:text-zinc-50"
>
			Account
		  </Link>

          {isLoggedIn ? (
            <>
              {/* Email (small, only on larger screens) */}
              <span className="hidden text-xs text-zinc-500 sm:inline">
                {email}
              </span>
              {/* Sign out via POST form */}
              <form action="/api/auth/signout" method="post">
                <button
                  type="submit"
                  className="cursor-pointer rounded-md border border-zinc-300 px-3 py-1 text-xs font-medium text-zinc-700 hover:bg-zinc-50 dark:border-zinc-700 dark:text-zinc-200 dark:hover:bg-zinc-900"
                >
                  Sign out
                </button>
              </form>
            </>
          ) : (
            <Link
              href="/signin"
              className="rounded-md border border-zinc-300 px-3 py-1 text-xs font-medium text-zinc-700 hover:bg-zinc-50 dark:border-zinc-700 dark:text-zinc-200 dark:hover:bg-zinc-900"
            >
              Sign in
            </Link>
          )}
        </nav>
      </div>
    </header>
  );
}

