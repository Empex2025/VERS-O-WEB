import { api } from './http';

export function qs(query?: Record<string, unknown>): string {
    if (!query) return '';
    const parts = Object.entries(query)
        .filter(([, v]) => v != null && v !== '')
        .map(([k, v]) => `${encodeURIComponent(k)}=${encodeURIComponent(String(v))}`);
    return parts.length ? `?${parts.join('&')}` : '';
}

/**
 * CRUD genérico para recursos no padrão do gateway (social/teleconsulta/marketplace):
 * `GET /{r}/:id?`, `POST /{r}/create`, `PUT /{r}/:id`, `DELETE /{r}/:id`.
 */
export function makeCrud(prefix: string, resource: string) {
    const base = `${prefix}/${resource}`;
    return {
        list: <T = unknown>(query?: Record<string, unknown>) => api<T>(`${base}${qs(query)}`),
        get: <T = unknown>(id: number | string) => api<T>(`${base}/${id}`),
        create: <T = unknown>(body: unknown) => api<T>(`${base}/create`, { method: 'POST', body }),
        update: <T = unknown>(id: number | string, body: unknown) => api<T>(`${base}/${id}`, { method: 'PUT', body }),
        remove: (id: number | string) => api(`${base}/${id}`, { method: 'DELETE' }),
    };
}

/**
 * CRUD para recursos user-api que usam POST na base (sem `/create`):
 * `GET /{r}`, `POST /{r}`, `PUT /{r}/:id`, `DELETE /{r}/:id`.
 */
export function makeBaseCrud(prefix: string, resource: string) {
    const base = `${prefix}/${resource}`;
    return {
        list: <T = unknown>(query?: Record<string, unknown>) => api<T>(`${base}${qs(query)}`),
        create: <T = unknown>(body: unknown) => api<T>(`${base}`, { method: 'POST', body }),
        update: <T = unknown>(id: number | string, body: unknown) => api<T>(`${base}/${id}`, { method: 'PUT', body }),
        remove: (id: number | string) => api(`${base}/${id}`, { method: 'DELETE' }),
    };
}
