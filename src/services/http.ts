import { useAuthStore } from '../store/useAuthStore';

/** BBF de produção (Railway). Usado como base e como rede de segurança em produção. */
const PROD_API_URL = 'https://isaude-api-production.up.railway.app';

/**
 * URL base do gateway BBF. Configurável por VITE_API_URL (ex.: IIS :8191).
 * Rede de segurança: se o build vier com uma URL de localhost (env mal configurada
 * na hospedagem) mas o site estiver rodando num domínio real, força a Railway —
 * um site publicado nunca deve falar com localhost.
 */
function resolveApiUrl(): string {
    const configured = (import.meta.env.VITE_API_URL as string | undefined)?.replace(/\/+$/, '');
    const isBrowser = typeof window !== 'undefined';
    const onLocalhost = isBrowser && /^(localhost|127\.0\.0\.1|\[::1\])$/.test(window.location.hostname);
    if (!configured) return onLocalhost || !isBrowser ? 'http://localhost:3000' : PROD_API_URL;
    if (isBrowser && !onLocalhost && /localhost|127\.0\.0\.1/.test(configured)) return PROD_API_URL;
    return configured;
}

export const API_URL = resolveApiUrl();

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

/**
 * Upload de arquivo (multipart). Não define Content-Type — o browser gera o
 * boundary correto do FormData (senão o busboy do backend recusa). Mantém o
 * Bearer token e o tratamento de erro/401 do `api`.
 */
export async function upload<T = unknown>(path: string, file: File, field = 'file'): Promise<T> {
    const token = useAuthStore.getState().token;
    const form = new FormData();
    form.append(field, file);

    const res = await fetch(`${API_URL}${path}`, {
        method: 'POST',
        headers: { ...(token ? { Authorization: `Bearer ${token}` } : {}) },
        body: form,
    });

    const isJson = res.headers.get('content-type')?.includes('application/json');
    const data = isJson ? await res.json().catch(() => null) : await res.text().catch(() => null);

    if (!res.ok) {
        if (res.status === 401) useAuthStore.getState().logout();
        const msg =
            data && typeof data === 'object' && 'message' in data
                ? String((data as { message: unknown }).message)
                : `Erro ${res.status}`;
        throw new ApiError(msg, res.status, data);
    }

    return data as T;
}
