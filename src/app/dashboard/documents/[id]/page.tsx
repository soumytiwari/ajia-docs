"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";

type User = {
  id: string;
  name: string;
  email: string;
};

type DocumentData = {
  id: string;
  title: string;
  content: Record<string, unknown>;
  owner: User;
  updatedAt: string;
};

export default function DocumentEditorPage() {
    const params = useParams<{ id: string }>();
    const router = useRouter();

    const [user] = useState<User | null>(() => {
    if (typeof window === "undefined") {
        return null;
    }

    const savedUser = localStorage.getItem("ajaia-current-user");

    if (!savedUser) {
        return null;
    }

    try {
        return JSON.parse(savedUser) as User;
    } catch {
        return null;
    }
    });

    const [document, setDocument] = useState<DocumentData | null>(null);
    const [title, setTitle] = useState("");
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [saveStatus, setSaveStatus] = useState<
        "saved" | "unsaved" | "saving"
    >("saved");

    const [error, setError] = useState("");

    const editor = useEditor({
        extensions: [StarterKit, Underline],
        content: "",
        immediatelyRender: false,
        onUpdate: () => {
            setSaveStatus("unsaved");
        },
    });

    const [users, setUsers] = useState<User[]>([]);
    const [selectedUserId, setSelectedUserId] = useState("");
    const [sharing, setSharing] = useState(false);
    const [shareMessage, setShareMessage] = useState("");


    useEffect(() => {
    if (!user) {
        router.push("/");
    }
    }, [router, user]);


    useEffect(() => {
        if (!user || !params.id || !editor) {
            return;
        }

        const currentUser = user;
        const currentEditor = editor;
        const documentId = params.id;

        async function loadDocument() {
            try {
            const response = await fetch(`/api/documents/${documentId}`, {
                headers: {
                "x-user-id": currentUser.id,
                },
            });

            if (!response.ok) {
                setSaveStatus("unsaved");
                setError("Unable to load document.");
            }

            const data: DocumentData = await response.json();

            setDocument(data);
            setTitle(data.title);
                currentEditor.commands.setContent(data.content);
                setSaveStatus("saved");
            } catch {
                setError("Unable to load document.");
            } finally {
                setLoading(false);
            }
        }

        loadDocument();
    }, [editor, params.id, user]);

    useEffect(() => {
        async function loadUsers() {
            try {
            const response = await fetch("/api/users");

            if (!response.ok) {
                return;
            }

            const data: User[] = await response.json();
            setUsers(data);
            } catch {
            // Sharing remains unavailable if users cannot be loaded.
            }
        }

        loadUsers();
    }, []);

    async function shareDocument() {
        if (!user || !document || !selectedUserId) {
            return;
        }

        setSharing(true);
        setShareMessage("");

        try {
            const response = await fetch(`/api/documents/${document.id}/shares`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "x-user-id": user.id,
            },
            body: JSON.stringify({
                userId: selectedUserId,
            }),
        });

       const data = await response.json();

            if (!response.ok) {
            throw new Error(data.error || "Unable to share document");
            }

            setShareMessage("Document shared successfully.");
            setSelectedUserId("");
        } catch (shareError) {
            setShareMessage(
            shareError instanceof Error
                ? shareError.message
                : "Unable to share document.",
            );
        } finally {
            setSharing(false);
        }
    }




    async function saveDocument() {
        if (!user || !editor || !document) {
        return;
        }
        setSaveStatus("saving");

        setSaving(true);
        setError("");

        try {
        const response = await fetch(`/api/documents/${document.id}`, {
            method: "PATCH",
            headers: {
            "Content-Type": "application/json",
            "x-user-id": user.id,
            },
            body: JSON.stringify({
            title,
            content: editor.getJSON(),
            }),
        });

        if (!response.ok) {
            throw new Error("Unable to save document");
        }

        const updatedDocument: DocumentData = await response.json();
            setDocument(updatedDocument);
            setSaveStatus("saved");
        } catch {
            setError("Unable to save document.");
        } finally {
            setSaving(false);
        }
    }

    if (loading) {
        return (
        <main className="flex min-h-screen items-center justify-center bg-slate-100">
            <p className="text-slate-500">Loading document...</p>
        </main>
        );
    }

    if (!document || !editor) {
        return (
        <main className="flex min-h-screen items-center justify-center bg-slate-100">
            <p className="text-red-600">
            {error || "Document could not be loaded."}
            </p>
        </main>
        );
    }

    return (
        <main className="min-h-screen bg-slate-100">
        <header className="border-b border-slate-200 bg-white px-6 py-4">
            <div className="mx-auto flex max-w-5xl items-center justify-between gap-4">
            <input
                value={title}
                onChange={(event) => {
                    setTitle(event.target.value);
                    setSaveStatus("unsaved");
                }}
                className="min-w-0 flex-1 border-none text-2xl font-bold text-slate-900 outline-none"
                aria-label="Document title"
            />

            <div className="flex items-center gap-3">
                <p className="text-sm text-slate-500">
                    {saveStatus === "saving"
                        ? "Saving..."
                        : saveStatus === "saved"
                        ? "Saved"
                        : "Unsaved changes"}
                </p>

                <button
                type="button"
                onClick={() => router.push("/dashboard")}
                className="rounded-lg px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100"
                >
                Dashboard
                </button>

                <button
                type="button"
                onClick={saveDocument}
                disabled={saving}
                className="rounded-lg bg-blue-600 px-4 py-2 font-semibold text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
                >
                {saving ? "Saving..." : "Save"}
                </button>
            </div>
            </div>
        </header>

        {error && (
            <p className="mx-auto mt-4 max-w-5xl rounded-lg bg-red-50 p-3 text-sm text-red-700">
            {error}
            </p>
        )}

        <section className="mx-auto mt-8 max-w-5xl rounded-xl bg-white p-8 shadow-sm">
            <EditorContent
            editor={editor}
            className="min-h-[500px] text-slate-900 [&_.ProseMirror]:min-h-[500px] [&_.ProseMirror]:outline-none [&_.ProseMirror_p]:mb-4"
            />
        </section>
        <section className="mx-auto mt-6 max-w-5xl rounded-xl bg-white p-6 shadow-sm">
            <h2 className="mb-3 text-lg font-semibold text-slate-900">
                Share document
            </h2>

            <div className="flex flex-col gap-3 sm:flex-row">
                <select
                value={selectedUserId}
                onChange={(event) => setSelectedUserId(event.target.value)}
                className="rounded-lg border border-slate-300 px-3 py-2 text-slate-900"
                >
                <option value="">Select a user</option>

                {users
                    .filter((shareUser) => shareUser.id !== user?.id)
                    .map((shareUser) => (
                    <option key={shareUser.id} value={shareUser.id}>
                        {shareUser.name} ({shareUser.email})
                    </option>
                    ))}
                </select>

                <button
                type="button"
                onClick={shareDocument}
                disabled={!selectedUserId || sharing}
                className="rounded-lg bg-emerald-600 px-4 py-2 font-semibold text-white hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-60"
                >
                {sharing ? "Sharing..." : "Share"}
                </button>
            </div>

            {shareMessage && (
                <p className="mt-3 text-sm text-slate-600">
                {shareMessage}
                </p>
            )}
        </section>

        </main>
    );
    }
