"use client";
import { signIn } from "next-auth/react";
import { useState } from "react";

export default function SignInPage() {
  const [email, setEmail] = useState("");
  return (
    <div className="max-w-md mx-auto p-8">
      <h1 className="text-2xl font-semibold mb-4">Sign in</h1>
      <input
        className="border rounded w-full p-2 mb-3"
        placeholder="you@example.com"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        type="email"
      />
      <button
        className="inline-flex items-center justify-center rounded-md bg-white text-black px-4 py-2 text-sm font-medium border border-zinc-300 hover:bg-zinc-100 hover:border-zinc-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black focus-visible:ring-offset-2 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed dark:bg-zinc-900 dark:text-white dark:border-zinc-700 dark:hover:bg-zinc-800"
        onClick={() => signIn("email", {
		  email,
		  callbackUrl: "/dashboard", 
        })}
      >
        Email me a magic link
      </button>
    </div>
  );
}

