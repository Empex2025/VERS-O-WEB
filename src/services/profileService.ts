import { api } from './http';
import { makeBaseCrud, qs } from './crud';

const U = '/api/user-api';

/** Cache do diretório público (`GET /users`) — evita N chamadas a `/users/:id` (que faz 403 p/ outros). */
let _dirCache: { at: number; users: any[] } | null = null;
let _dirPromise: Promise<any[]> | null = null;

/** Serviço de usuário e "profile extras" (`/api/user-api`). */
export const profileService = {
    getUser: <T = unknown>(id: number | string) => api<T>(`${U}/users/${id}`),
    getUsers: <T = unknown>(query?: Record<string, unknown>) => api<T>(`${U}/users${qs(query)}`),

    /** Diretório público (campos sem PII), cacheado por 60s. */
    async getDirectory(): Promise<any[]> {
        if (_dirCache && Date.now() - _dirCache.at < 60_000) return _dirCache.users;
        if (_dirPromise) return _dirPromise; // dedupe chamadas concorrentes
        _dirPromise = api<{ users?: any[] } | any[]>(`${U}/users?limit=200`)
            .then((res) => {
                const users = Array.isArray(res) ? res : res?.users ?? [];
                _dirCache = { at: Date.now(), users };
                return users;
            })
            .finally(() => { _dirPromise = null; });
        return _dirPromise;
    },
    /** Busca 1 usuário pelo diretório público (funciona para qualquer id, ao contrário de getUser). */
    async getPublicUser<T = any>(id: number | string): Promise<T | undefined> {
        const users = await profileService.getDirectory();
        return users.find((u) => String(u.id) === String(id)) as T | undefined;
    },
    updateUser: <T = unknown>(id: number | string, body: unknown) => api<T>(`${U}/users/${id}`, { method: 'PUT', body }),

    // Endereços de entrega/atendimento (base POST)
    addresses: makeBaseCrud(U, 'addresses'),
    // Telefones
    phones: makeBaseCrud(U, 'phones'),
    // Cartões (métodos de pagamento)
    cards: makeBaseCrud(U, 'payment-methods'),
    chargeToken: (id: number | string) => api(`${U}/payment-methods/${id}/charge-token`, { method: 'POST', body: {} }),

    // Validação de documentos (Meus Documentos)
    validation: {
        get: <T = unknown>() => api<T>(`${U}/validation`),
        submit: (body: unknown) => api(`${U}/validation`, { method: 'POST', body }),
    },

    // Histórico da conta / de username
    historicoConta: {
        list: <T = unknown>(query?: Record<string, unknown>) => api<T>(`${U}/historico-conta${qs(query)}`),
        create: (body: unknown) => api(`${U}/historico-conta/create`, { method: 'POST', body }),
    },
    historicoUsername: {
        list: <T = unknown>(query?: Record<string, unknown>) => api<T>(`${U}/historico-username${qs(query)}`),
        create: (body: unknown) => api(`${U}/historico-username/create`, { method: 'POST', body }),
    },

    // Contatos
    contacts: {
        list: <T = unknown>(query?: Record<string, unknown>) => api<T>(`${U}/contacts${qs(query)}`),
        create: (body: unknown) => api(`${U}/contacts`, { method: 'POST', body }),
        update: (id: number | string, body: unknown) => api(`${U}/contacts/${id}`, { method: 'PUT', body }),
        remove: (id: number | string) => api(`${U}/contacts/${id}`, { method: 'DELETE' }),
    },

    // Endereços do usuário (usa /create)
    enderecos: {
        list: <T = unknown>(query?: Record<string, unknown>) => api<T>(`${U}/enderecos${qs(query)}`),
        create: (body: unknown) => api(`${U}/enderecos/create`, { method: 'POST', body }),
        update: (id: number | string, body: unknown) => api(`${U}/enderecos/${id}`, { method: 'PUT', body }),
        remove: (id: number | string) => api(`${U}/enderecos/${id}`, { method: 'DELETE' }),
    },
};
