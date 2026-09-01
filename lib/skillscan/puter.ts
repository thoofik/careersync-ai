"use client";

import { create } from "zustand";
import { formatError } from "@/lib/format-error";

declare global {
    interface Window {
        puter: {
            auth: {
                getUser: () => Promise<PuterUser>;
                isSignedIn: () => Promise<boolean>;
                signIn: () => Promise<void>;
                signOut: () => Promise<void>;
            };
            fs: {
                write: (
                    path: string,
                    data: string | File | Blob
                ) => Promise<File | undefined>;
                read: (path: string) => Promise<Blob>;
                upload: (file: File[] | Blob[]) => Promise<FSItem>;
                delete: (path: string) => Promise<void>;
                readdir: (path: string) => Promise<FSItem[] | undefined>;
            };
            ai: {
                chat: (
                    prompt: string | ChatMessage[],
                    imageURL?: string | PuterChatOptions,
                    testMode?: boolean,
                    options?: PuterChatOptions
                ) => Promise<Object>;
                img2txt: (
                    image: string | File | Blob,
                    testMode?: boolean
                ) => Promise<string>;
            };
            kv: {
                get: (key: string) => Promise<string | null>;
                set: (key: string, value: string) => Promise<boolean>;
                delete: (key: string) => Promise<boolean>;
                list: (pattern: string, returnValues?: boolean) => Promise<string[]>;
                flush: () => Promise<boolean>;
            };
        };
    }
}

interface PuterStore {
    isLoading: boolean;
    error: string | null;
    puterReady: boolean;
    authChecked: boolean;
    auth: {
        user: PuterUser | null;
        isAuthenticated: boolean;
        signIn: () => Promise<void>;
        signOut: () => Promise<void>;
        refreshUser: () => Promise<void>;
        checkAuthStatus: () => Promise<boolean>;
        getUser: () => PuterUser | null;
    };
    fs: {
        write: (
            path: string,
            data: string | File | Blob
        ) => Promise<File | undefined>;
        read: (path: string) => Promise<Blob | undefined>;
        upload: (file: File[] | Blob[]) => Promise<FSItem | undefined>;
        delete: (path: string) => Promise<void>;
        readDir: (path: string) => Promise<FSItem[] | undefined>;
    };
    ai: {
        chat: (
            prompt: string | ChatMessage[],
            imageURL?: string | PuterChatOptions,
            testMode?: boolean,
            options?: PuterChatOptions
        ) => Promise<AIResponse | undefined>;
        feedback: (
            path: string,
            message: string
        ) => Promise<AIResponse | undefined>;
        feedbackFromText: (
            resumeText: string,
            message: string
        ) => Promise<AIResponse | undefined>;
        img2txt: (
            image: string | File | Blob,
            testMode?: boolean
        ) => Promise<string | undefined>;
    };
    kv: {
        get: (key: string) => Promise<string | null | undefined>;
        set: (key: string, value: string) => Promise<boolean | undefined>;
        delete: (key: string) => Promise<boolean | undefined>;
        list: (
            pattern: string,
            returnValues?: boolean
        ) => Promise<string[] | KVItem[] | undefined>;
        flush: () => Promise<boolean | undefined>;
    };

    init: () => void;
    clearError: () => void;
}

const getPuter = (): typeof window.puter | null =>
    typeof window !== "undefined" && window.puter ? window.puter : null;

const toPuterUser = (value: unknown): PuterUser | null => {
    if (!value || typeof value !== "object") return null;
    const record = value as Record<string, unknown>;
    const inner =
        record.user && typeof record.user === "object"
            ? (record.user as Record<string, unknown>)
            : record;
    const uuid = typeof inner.uuid === "string" ? inner.uuid : "";
    const username = typeof inner.username === "string" ? inner.username : "";
    if (!uuid && !username) return null;
    return { uuid: uuid || username, username: username || uuid };
};

const isPuterSignedIn = async (puter: NonNullable<ReturnType<typeof getPuter>>) => {
    const status = puter.auth.isSignedIn() as boolean | Promise<boolean>;
    return Boolean(await status);
};

export const usePuterStore = create<PuterStore>((set, get) => {
    const setError = (msg: string) => {
        set({
            error: msg,
            isLoading: false,
        });
    };

    const applySignedIn = (user: PuterUser | null) => {
        set({
            auth: {
                user,
                isAuthenticated: Boolean(user),
                signIn: get().auth.signIn,
                signOut: get().auth.signOut,
                refreshUser: get().auth.refreshUser,
                checkAuthStatus: get().auth.checkAuthStatus,
                getUser: () => user,
            },
            isLoading: false,
            authChecked: true,
            error: null,
        });
    };

    const applySignedOut = () => {
        set({
            auth: {
                user: null,
                isAuthenticated: false,
                signIn: get().auth.signIn,
                signOut: get().auth.signOut,
                refreshUser: get().auth.refreshUser,
                checkAuthStatus: get().auth.checkAuthStatus,
                getUser: () => null,
            },
            isLoading: false,
            authChecked: true,
        });
    };

    const checkAuthStatus = async (): Promise<boolean> => {
        const puter = getPuter();
        if (!puter) {
            setError("Puter.js not available");
            set({ authChecked: true });
            return false;
        }

        set({ isLoading: true, error: null });

        try {
            const signedIn = await isPuterSignedIn(puter);
            const user = toPuterUser(await puter.auth.getUser().catch(() => null));
            if (signedIn || user) {
                applySignedIn(
                    user ?? {
                        uuid: "puter-user",
                        username: "Puter user",
                    }
                );
                return true;
            }
            if (get().auth.isAuthenticated) {
                set({ isLoading: false, authChecked: true });
                return true;
            }
            applySignedOut();
            return false;
        } catch (err) {
            setError(formatError(err) || "Failed to check auth status");
            set({ authChecked: true, isLoading: false });
            return get().auth.isAuthenticated;
        }
    };

    const signIn = async (): Promise<void> => {
        const puter = getPuter();
        if (!puter) {
            setError("Puter.js not available");
            return;
        }

        set({ isLoading: true, error: null });

        try {
            const result = await puter.auth.signIn();
            const signedInUser = toPuterUser(result);
            if (signedInUser) {
                applySignedIn(signedInUser);
                return;
            }
            for (let attempt = 0; attempt < 8; attempt++) {
                if (await checkAuthStatus()) return;
                await new Promise((resolve) => setTimeout(resolve, 250));
            }
        } catch (err) {
            // Google in the Puter popup often closes the window before Puter
            // resolves; the session can still be valid.
            for (let attempt = 0; attempt < 8; attempt++) {
                if (await checkAuthStatus()) return;
                await new Promise((resolve) => setTimeout(resolve, 250));
            }
            if (!get().auth.isAuthenticated) {
                setError(formatError(err) || "Sign in failed");
            }
        }
    };

    const signOut = async (): Promise<void> => {
        const puter = getPuter();
        if (!puter) {
            setError("Puter.js not available");
            return;
        }

        set({ isLoading: true, error: null });

        try {
            await puter.auth.signOut();
            set({
                auth: {
                    user: null,
                    isAuthenticated: false,
                    signIn: get().auth.signIn,
                    signOut: get().auth.signOut,
                    refreshUser: get().auth.refreshUser,
                    checkAuthStatus: get().auth.checkAuthStatus,
                    getUser: () => null,
                },
                isLoading: false,
            });
        } catch (err) {
            setError(formatError(err) || "Sign out failed");
        }
    };

    const refreshUser = async (): Promise<void> => {
        const puter = getPuter();
        if (!puter) {
            setError("Puter.js not available");
            return;
        }

        set({ isLoading: true, error: null });

        try {
            const user = await puter.auth.getUser();
            set({
                auth: {
                    user,
                    isAuthenticated: true,
                    signIn: get().auth.signIn,
                    signOut: get().auth.signOut,
                    refreshUser: get().auth.refreshUser,
                    checkAuthStatus: get().auth.checkAuthStatus,
                    getUser: () => user,
                },
                isLoading: false,
            });
        } catch (err) {
            setError(formatError(err) || "Failed to refresh user");
            set({ isLoading: false });
        }
    };

    const init = (): void => {
        const puter = getPuter();
        if (puter) {
            set({ puterReady: true });
            checkAuthStatus();
            return;
        }

        const interval = setInterval(() => {
            if (getPuter()) {
                clearInterval(interval);
                set({ puterReady: true });
                checkAuthStatus();
            }
        }, 100);

        setTimeout(() => {
            clearInterval(interval);
            if (!getPuter()) {
                setError("Puter.js failed to load within 10 seconds");
            }
        }, 10000);
    };

    const withPuter = async <T>(fn: (puter: NonNullable<ReturnType<typeof getPuter>>) => Promise<T>) => {
        const puter = getPuter();
        if (!puter) {
            setError("Puter.js not available");
            return;
        }
        try {
            return await fn(puter);
        } catch (err) {
            set({ error: formatError(err), isLoading: false });
            return;
        }
    };

    const write = async (path: string, data: string | File | Blob) => {
        return withPuter((puter) => puter.fs.write(path, data));
    };

    const readDir = async (path: string) => {
        return withPuter((puter) => puter.fs.readdir(path));
    };

    const readFile = async (path: string) => {
        return withPuter((puter) => puter.fs.read(path));
    };

    const upload = async (files: File[] | Blob[]) => {
        return withPuter((puter) => puter.fs.upload(files));
    };

    const deleteFile = async (path: string) => {
        return withPuter((puter) => puter.fs.delete(path));
    };

    const chat = async (
        prompt: string | ChatMessage[],
        imageURL?: string | PuterChatOptions,
        testMode?: boolean,
        options?: PuterChatOptions
    ) => {
        const puter = getPuter();
        if (!puter) {
            setError("Puter.js not available");
            return;
        }
        try {
            return await puter.ai.chat(prompt, imageURL, testMode, options) as Promise<
                AIResponse | undefined
            >;
        } catch (err) {
            setError(formatError(err));
            return;
        }
    };

    const feedback = async (path: string, message: string) => {
        const puter = getPuter();
        if (!puter) {
            setError("Puter.js not available");
            return;
        }

        try {
            return await puter.ai.chat(
                [
                    {
                        role: "user",
                        content: [
                            {
                                type: "file",
                                puter_path: path,
                            },
                            {
                                type: "text",
                                text: message,
                            },
                        ],
                    },
                ],
                { model: "claude-haiku-4-5" }
            ) as Promise<AIResponse | undefined>;
        } catch (err) {
            setError(formatError(err));
            return;
        }
    };

    const feedbackFromText = async (resumeText: string, message: string) => {
        const puter = getPuter();
        if (!puter) {
            setError("Puter.js not available");
            return;
        }

        try {
            return await puter.ai.chat(
                `${message}\n\nResume text:\n${resumeText}`,
                { model: "claude-haiku-4-5" }
            ) as Promise<AIResponse | undefined>;
        } catch (err) {
            setError(formatError(err));
            return;
        }
    };

    const img2txt = async (image: string | File | Blob, testMode?: boolean) => {
        return withPuter((puter) => puter.ai.img2txt(image, testMode));
    };

    const getKV = async (key: string) => {
        return withPuter((puter) => puter.kv.get(key));
    };

    const setKV = async (key: string, value: string) => {
        return withPuter((puter) => puter.kv.set(key, value));
    };

    const deleteKV = async (key: string) => {
        return withPuter((puter) => puter.kv.delete(key));
    };

    const listKV = async (pattern: string, returnValues?: boolean) => {
        return withPuter((puter) =>
            puter.kv.list(pattern, returnValues === undefined ? false : returnValues)
        );
    };

    const flushKV = async () => {
        return withPuter((puter) => puter.kv.flush());
    };

    return {
        isLoading: true,
        error: null,
        puterReady: false,
        authChecked: false,
        auth: {
            user: null,
            isAuthenticated: false,
            signIn,
            signOut,
            refreshUser,
            checkAuthStatus,
            getUser: () => get().auth.user,
        },
        fs: {
            write: (path: string, data: string | File | Blob) => write(path, data),
            read: (path: string) => readFile(path),
            readDir: (path: string) => readDir(path),
            upload: (files: File[] | Blob[]) => upload(files),
            delete: (path: string) => deleteFile(path),
        },
        ai: {
            chat: (
                prompt: string | ChatMessage[],
                imageURL?: string | PuterChatOptions,
                testMode?: boolean,
                options?: PuterChatOptions
            ) => chat(prompt, imageURL, testMode, options),
            feedback: (path: string, message: string) => feedback(path, message),
            feedbackFromText: (resumeText: string, message: string) =>
                feedbackFromText(resumeText, message),
            img2txt: (image: string | File | Blob, testMode?: boolean) =>
                img2txt(image, testMode),
        },
        kv: {
            get: (key: string) => getKV(key),
            set: (key: string, value: string) => setKV(key, value),
            delete: (key: string) => deleteKV(key),
            list: (pattern: string, returnValues?: boolean) =>
                listKV(pattern, returnValues),
            flush: () => flushKV(),
        },
        init,
        clearError: () => set({ error: null }),
    };
});
