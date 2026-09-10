"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

type User = {
  id: string;
  name: string;
  email: string;
};

export default function LoginPage() {
  const router = useRouter();

  const [users, setUsers] = useState<User[]>([]);
  const [selectedUserId, setSelectedUserId] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [loggingIn, setLoggingIn] = useState(false);

  useEffect(() => {
    async function loadUsers() {
      try {
        const response = await fetch("/api/users");

        if (!response.ok) {
          throw new Error("Unable to load users");
        }

        const data: User[] = await response.json();
        setUsers(data);

        if (data.length > 0) {
          setSelectedUserId(data[0].id);
        }
      } catch {
        setError("Unable to load demo users. Please refresh the page.");
      } finally {
        setLoading(false);
      }
    }

    loadUsers();
  }, []);

  function handleLogin() {
    if (!selectedUserId) {
      setError("Please select a user.");
      return;
    }

    const selectedUser = users.find((user) => user.id === selectedUserId);

    if (!selectedUser) {
      setError("Selected user could not be found.");
      return;
    }

    setLoggingIn(true);
    localStorage.setItem("ajaia-current-user", JSON.stringify(selectedUser));
    router.push("/dashboard");
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-100 px-4">
      <section className="w-full max-w-md rounded-2xl bg-white p-8 shadow-lg">
        <div className="mb-8">
          <p className="mb-2 text-sm font-semibold uppercase tracking-wide text-blue-600">
            Ajaia Workspace
          </p>

          <h1 className="text-3xl font-bold text-slate-900">
            Welcome back
          </h1>

          <p className="mt-2 text-slate-600">
            Choose a demo account to continue.
          </p>
        </div>

        {loading ? (
          <p className="text-sm text-slate-500">Loading users...</p>
        ) : error ? (
          <p className="rounded-lg bg-red-50 p-3 text-sm text-red-700">
            {error}
          </p>
        ) : (
          <>
            <label
              htmlFor="user"
              className="mb-2 block text-sm font-medium text-slate-700"
            >
              Demo account
            </label>

            <select
              id="user"
              value={selectedUserId}
              onChange={(event) => setSelectedUserId(event.target.value)}
              className="w-full rounded-lg border border-slate-300 bg-white px-3 py-3 text-slate-900 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
            >
              {users.map((user) => (
                <option key={user.id} value={user.id}>
                  {user.name} — {user.email}
                </option>
              ))}
            </select>

            <button
              type="button"
              onClick={handleLogin}
              disabled={loggingIn || !selectedUserId}
              className="mt-6 w-full rounded-lg bg-blue-600 px-4 py-3 font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loggingIn ? "Opening workspace..." : "Continue"}
            </button>
          </>
        )}

        <p className="mt-6 text-center text-xs text-slate-400">
          Demo authentication for the assignment
        </p>
      </section>
    </main>
  );
}
