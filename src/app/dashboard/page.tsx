"use client";

import { useEffect, useState, useSyncExternalStore } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

type User = {
  id: string;
  name: string;
  email: string;
};

type Document = {
  id: string;
  title: string;
  owner: User;
  updatedAt: string;
};

function getSavedUser(): User | null {
  const savedUser = localStorage.getItem("ajaia-current-user");

  if (!savedUser) {
    return null;
  }

  try {
    return JSON.parse(savedUser) as User;
  } catch {
    return null;
  }
}

export default function DashboardPage() {
  const hasHydrated = useSyncExternalStore(
    () => () => {},
    () => true,
    () => false,
  );

  const user = hasHydrated ? getSavedUser() : null;

  const [documents, setDocuments] = useState<Document[]>([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  useEffect(() => {
    if (!hasHydrated) {
      return;
    }

    if (!user) {
      router.push("/");
      return;
  }

  const currentUser = user;


    async function loadDocuments() {
      try {
        const response = await fetch("/api/documents", {
          headers: {
            "x-user-id": currentUser.id,
          },
        });


        if (!response.ok) {
          throw new Error("Unable to load documents");
        }

        const data: Document[] = await response.json();
        setDocuments(data);
      } catch {
        setError("Unable to load documents.");
      } finally {
        setLoading(false);
      }
    }

    loadDocuments();
  }, [hasHydrated, router, user]);


  async function createDocument() {
    if (!user) return;

    setCreating(true);
    setError("");

    try {
      const response = await fetch("/api/documents", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-user-id": user.id,
        },
        body: JSON.stringify({
          title: "Untitled document",
        }),
      });

      if (!response.ok) {
        throw new Error("Unable to create document");
      }

      const document: Document = await response.json();
      router.push(`/dashboard/documents/${document.id}`);

    } catch {
      setError("Unable to create document.");
    } finally {
      setCreating(false);
    }
  }

  return (
    <main className="min-h-screen bg-slate-100 px-6 py-10">
      <div className="mx-auto max-w-5xl">
        <header className="mb-8 flex items-center justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wide text-blue-600">
              Ajaia Workspace
            </p>

            <h1 className="mt-1 text-3xl font-bold text-slate-900">
              Documents
            </h1>

            {user && (
              <p className="mt-2 text-slate-600">
                Signed in as {user.name}
              </p>
            )}
          </div>

          <button
            type="button"
            onClick={createDocument}
            disabled={creating}
            className="rounded-lg bg-blue-600 px-4 py-3 font-semibold text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {creating ? "Creating..." : "New document"}
          </button>
        </header>

        {error && (
          <p className="mb-4 rounded-lg bg-red-50 p-3 text-sm text-red-700">
            {error}
          </p>
        )}

        <section className="rounded-2xl bg-white p-6 shadow-sm">
          <h2 className="mb-4 text-lg font-semibold text-slate-900">
            My Documents
          </h2>

          {loading ? (
            <p className="text-slate-500">Loading documents...</p>
          ) : documents.length === 0 ? (
            <p className="text-slate-500">
              You do not have any documents yet.
            </p>
          ) : (
            <div className="space-y-3">
              {documents.map((document) => (
                <Link
                  key={document.id}
                  href={`/dashboard/documents/${document.id}`}
                  className="block rounded-lg border border-slate-200 p-4 transition hover:border-blue-400 hover:bg-blue-50"
                >
                  <p className="font-medium text-slate-900">
                    {document.title}
                  </p>

                  <p className="mt-1 text-sm text-slate-500">
                    Owned by {document.owner.name}
                  </p>
                </Link>
              ))}

            </div>
          )}
        </section>
      </div>
    </main>
  );
}
