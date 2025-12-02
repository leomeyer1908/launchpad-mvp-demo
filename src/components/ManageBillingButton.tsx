"use client";
import { useState } from "react";

export default function ManageBillingButton() {
  const [loading, setLoading] = useState(false);

  async function onClick() {
    try {
      setLoading(true);
      const res = await fetch("/api/portal", { method: "POST" });
      const data = await res.json();
      if (res.ok && data.url) {
        window.location.href = data.url;
      } else {
        alert(data.error ?? "Unable to open billing portal.");
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <button
      onClick={onClick}
      disabled={loading}
	  className="inline-flex items-center justify-center rounded-md bg-white text-black px-4 py-2 text-sm font-medium border border-zinc-300 hover:bg-zinc-100 hover:border-zinc-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black focus-visible:ring-offset-2 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed dark:bg-zinc-900 dark:text-white dark:border-zinc-700 dark:hover:bg-zinc-800"

    >
      {loading ? "Opening..." : "Manage billing"}
    </button>
  );
}

