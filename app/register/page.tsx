"use client";

import { FormEvent, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

export default function RegisterPage() {
    const router = useRouter();
    const { register, error, clearError, isAuthenticated } = useAuth();

    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        if (isAuthenticated) {
            router.replace("/");
        }
    }, [isAuthenticated, router]);

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (!name || !email || !password) {
            return;
        }

        setIsSubmitting(true);
        clearError();

        try {
            await register(name, email, password);
            router.replace("/");
        } catch {
            // AuthContext already stores the error message.
        } finally {
            setIsSubmitting(false);
        }


    };

    return (<main className="flex min-h-screen items-center justify-center px-4 py-12"> <div className="w-full max-w-md"> <div className="mb-8 text-center"> <h1 className="text-3xl font-bold">Create your account</h1>)
        <p className="mt-2 text-sm text-slate-400">
            Get started with DevPulse
        </p>
    </div>

        <div className="rounded-2xl border border-slate-700 bg-slate-900/80 p-6 shadow-xl">
            <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                    <label
                        htmlFor="name"
                        className="mb-2 block text-sm font-medium"
                    >
                        Name
                    </label>

                    <input
                        id="name"
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Your name"
                        className="w-full rounded-xl border border-slate-700 bg-slate-800 px-4 py-3 text-sm outline-none transition focus:border-indigo-500"
                        required
                    />
                </div>

                <div>
                    <label
                        htmlFor="email"
                        className="mb-2 block text-sm font-medium"
                    >
                        Email
                    </label>

                    <input
                        id="email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="you@example.com"
                        className="w-full rounded-xl border border-slate-700 bg-slate-800 px-4 py-3 text-sm outline-none transition focus:border-indigo-500"
                        required
                    />
                </div>

                <div>
                    <label
                        htmlFor="password"
                        className="mb-2 block text-sm font-medium"
                    >
                        Password
                    </label>

                    <input
                        id="password"
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Create a password"
                        className="w-full rounded-xl border border-slate-700 bg-slate-800 px-4 py-3 text-sm outline-none transition focus:border-indigo-500"
                        required
                        minLength={6}
                    />
                </div>

                {error && (
                    <div className="rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-400">
                        {error}
                    </div>
                )}

                <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full rounded-xl bg-indigo-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-indigo-500 disabled:cursor-not-allowed disabled:opacity-50"
                >
                    {isSubmitting ? "Creating account..." : "Create Account"}
                </button>
            </form>

            <p className="mt-6 text-center text-sm text-slate-400">
                Already have an account?{" "}
                <Link
                    href="/login"
                    className="font-medium text-indigo-400 hover:text-indigo-300"
                >
                    Sign in
                </Link>
            </p>
        </div>
    </div>
    </main>

    );
}
