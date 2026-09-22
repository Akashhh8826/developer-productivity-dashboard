"use client";

import React, {
    createContext,
    useContext,
    useEffect,
    useState,
    ReactNode,
} from "react";

import { User } from "@/types";
import { api } from "@/lib/api";

interface AuthResponse {
    success: boolean;
    data: {
        token: string;
        user: any;
    };
}

interface MeResponse {
    success: boolean;
    data: any;
}

interface AuthContextType {
    user: User | null;
    token: string | null;
    isLoading: boolean;
    isAuthenticated: boolean;
    error: string | null;

    login: (email: string, password: string) => Promise<void>;
    register: (
        name: string,
        email: string,
        password: string
    ) => Promise<void>;
    logout: () => Promise<void>;
    refreshUser: () => Promise<void>;
    clearError: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

function mapBackendUser(backendUser: any): User {
    return {
        id: backendUser.id || backendUser._id,
        name: backendUser.name || "User",
        email: backendUser.email || "",
        avatar:
            backendUser.avatar ||
            `https://ui-avatars.com/api/?name=${encodeURIComponent(
                backendUser.name || "User"
            )}`,
        role: backendUser.role || "Developer",
        department: backendUser.department,
        location: backendUser.location,
    };
}

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [token, setToken] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const storedToken = localStorage.getItem("devpulse_token");

        if (!storedToken) {
            setIsLoading(false);
            return;
        }

        setToken(storedToken);

        const loadUser = async () => {
            try {
                const response = await api.get<MeResponse>("/api/auth/me", {
                    token: storedToken,
                });

                setUser(mapBackendUser(response.data));
            } catch (err) {
                console.error("Failed to restore authentication:", err);

                localStorage.removeItem("devpulse_token");
                setToken(null);
                setUser(null);
            } finally {
                setIsLoading(false);
            }
        };

        loadUser();
    }, []);

    const login = async (email: string, password: string) => {
        try {
            setError(null);

            const response = await api.post<AuthResponse>("/api/auth/login", {
                email,
                password,
            });

            const newToken = response.data.token;
            const newUser = mapBackendUser(response.data.user);

            localStorage.setItem("devpulse_token", newToken);

            setToken(newToken);
            setUser(newUser);
        } catch (err) {
            const message =
                err instanceof Error ? err.message : "Login failed";

            setError(message);
            throw err;
        }
    };

    const register = async (
        name: string,
        email: string,
        password: string
    ) => {
        try {
            setError(null);

            const response = await api.post<AuthResponse>("/api/auth/register", {
                name,
                email,
                password,
            });

            const newToken = response.data.token;
            const newUser = mapBackendUser(response.data.user);

            localStorage.setItem("devpulse_token", newToken);

            setToken(newToken);
            setUser(newUser);
        } catch (err) {
            const message =
                err instanceof Error ? err.message : "Registration failed";

            setError(message);
            throw err;
        }
    };

    const logout = async () => {
        try {
            if (token) {
                await api.post("/api/auth/logout", undefined, {
                    token,
                });
            }
        } catch (err) {
            console.error("Logout request failed:", err);
        } finally {
            localStorage.removeItem("devpulse_token");

            setToken(null);
            setUser(null);
        }
    };

    const refreshUser = async () => {
        if (!token) return;

        try {
            const response = await api.get<MeResponse>("/api/auth/me", {
                token,
            });

            setUser(mapBackendUser(response.data));
        } catch (err) {
            console.error("Failed to refresh user:", err);
        }
    };

    const clearError = () => {
        setError(null);
    };

    const value: AuthContextType = {
        user,
        token,
        isLoading,
        isAuthenticated: !!user && !!token,
        error,
        login,
        register,
        logout,
        refreshUser,
        clearError,
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);

    if (!context) {
        throw new Error("useAuth must be used within an AuthProvider");
    }

    return context;
}