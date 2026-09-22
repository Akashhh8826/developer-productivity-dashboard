const rawApiUrl =
    process.env.NEXT_PUBLIC_API_URL ||
    "https://devpulse-backend-jbzu.onrender.com";
const API_URL = rawApiUrl.replace(/\/+$/, "");

interface ApiOptions extends RequestInit {
    token?: string | null;
}

async function apiRequest<T>(
    endpoint: string,
    options: ApiOptions = {}
): Promise<T> {
    const { token, headers, ...fetchOptions } = options;

    const authToken =
        token ??
        (typeof window !== "undefined"
            ? localStorage.getItem("devpulse_token")
            : null);

    const cleanEndpoint = endpoint.startsWith("/") ? endpoint : `/${endpoint}`;

    const response = await fetch(`${API_URL}${cleanEndpoint}`, {
        ...fetchOptions,
        headers: {
            "Content-Type": "application/json",
            ...(authToken
                ? {
                    Authorization: `Bearer ${authToken}`,
                }
                : {}),
            ...headers,
        },
    });

    let data: any = null;

    try {
        data = await response.json();
    } catch {
        data = null;
    }

    if (!response.ok) {
        if (response.status === 401 && typeof window !== "undefined") {
            localStorage.removeItem("devpulse_token");
        }

        const errorMessage =
            data?.message ||
            data?.error?.message ||
            (typeof data?.error === "string" ? data.error : null) ||
            data?.data?.message ||
            (typeof data === "string" ? data : null) ||
            `Request failed with status ${response.status}`;

        throw new Error(errorMessage);
    }

    return data;
}

export const api = {
    get: <T>(endpoint: string, options?: ApiOptions) =>
        apiRequest<T>(endpoint, {
            ...options,
            method: "GET",
        }),

    post: <T>(
        endpoint: string,
        body?: unknown,
        options?: ApiOptions
    ) =>
        apiRequest<T>(endpoint, {
            ...options,
            method: "POST",
            body: body ? JSON.stringify(body) : undefined,
        }),

    put: <T>(
        endpoint: string,
        body?: unknown,
        options?: ApiOptions
    ) =>
        apiRequest<T>(endpoint, {
            ...options,
            method: "PUT",
            body: body ? JSON.stringify(body) : undefined,
        }),

    patch: <T>(
        endpoint: string,
        body?: unknown,
        options?: ApiOptions
    ) =>
        apiRequest<T>(endpoint, {
            ...options,
            method: "PATCH",
            body: body ? JSON.stringify(body) : undefined,
        }),

    delete: <T>(endpoint: string, options?: ApiOptions) =>
        apiRequest<T>(endpoint, {
            ...options,
            method: "DELETE",
        }),
};
