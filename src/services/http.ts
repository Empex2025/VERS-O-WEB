import { useAuthStore } from '../store/useAuthStore';

/** URL base do gateway BBF. Configurável por VITE_API_URL (ex.: IIS :8191). */
export const API_URL =
    (import.meta.env.VITE_API_URL as string | undefined)?.replace(/\/+$/, '') || 'http://localhost:3000';

export class ApiError extends Error {
    status: number;
    data: unknown;
    constructor(message: string, status: number, data?: unknown) {
        super(message);
        this.name = 'ApiError';
        this.status = status;
        this.data = data;
    }
}

interface RequestOptions {
    method?: 'GET' | 'POST' | 'PUT' | 'DELETE';
    body?: unknown;
    /** Envia o token de autenticação (padrão: true). */
    auth?: boolean;
    headers?: Record<string, string>;
}

/**
 * Cliente HTTP central. Injeta `Authorization: Bearer <token>`, serializa JSON
 * e lança `ApiError` com a mensagem do backend em caso de falha.
 */
export async function api<T = unknown>(path: string, opts: RequestOptions = {}): Promise<T> {
    const { method = 'GET', body, auth = true, headers = {} } = opts;
    const token = auth ? useAuthStore.getState().token : null;

    const res = await fetch(`${API_URL}${path}`, {
        method,
        headers: {
            'Content-Type': 'application/json',
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
            ...headers,
        },
        body: body != null ? JSON.stringify(body) : undefined,
    });

    const isJson = res.headers.get('content-type')?.includes('application/json');
    const data = isJson ? await res.json().catch(() => null) : await res.text().catch(() => null);

    if (!res.ok) {
        // Token inválido/expirado: encerra a sessão local
        if (res.status === 401) useAuthStore.getState().logout();
        const msg =
            data && typeof data === 'object' && 'message' in data
                ? String((data as { message: unknown }).message)
                : `Erro ${res.status}`;
        throw new ApiError(msg, res.status, data);
    }

    return data as T;
}
