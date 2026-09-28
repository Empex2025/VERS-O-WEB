import { api } from './http';
import { useAuthStore, type AuthUser } from '../store/useAuthStore';

interface LoginResponse {
    message?: string;
    token: string;
    user: AuthUser;
}

export interface RegisterPayload {
    nome: string;
    email: string;
    senha_hash: string; // senha em texto; o backend faz o hash
    tipo_usuario: 'paciente' | 'profissional' | 'clinica';
    username?: string;
    telefone?: string;
    cpfcnpj?: string;
    dt_nascimento?: string;
    [key: string]: unknown;
}

/** Serviço de autenticação — rotas públicas do gateway BBF (`/api/user-api`). */
export const authService = {
    async login(email: string, password: string): Promise<LoginResponse> {
        const data = await api<LoginResponse>('/api/user-api/users/login', {
            method: 'POST',
            auth: false,
            body: { email, password },
        });
        useAuthStore.getState().setAuth(data.token, data.user);
        // Hidrata o perfil completo (username, bio, cpf, nascimento…) que o login não traz.
        authService.hydrateUser();
        return data;
    },

    /**
     * Mescla o perfil do diretório público no store — o login devolve só
     * id/nome/email/tipo, sem `username`/`descricao_bio`/`is_verificado`.
     * (`GET /users/:id` devolve a lista paginada, não serve; o diretório sim.)
     */
    async hydrateUser(): Promise<void> {
        const { token, user } = useAuthStore.getState();
        if (!token || !user?.id) return;
        try {
            const { profileService } = await import('./profileService');
            const full = await profileService.getPublicUser<Record<string, unknown>>(user.id);
            if (full && typeof full === 'object') {
                useAuthStore.getState().setAuth(token, { ...user, ...full } as AuthUser);
            }
        } catch { /* mantém o que já tem no store */ }
    },

    register(payload: RegisterPayload) {
        return api('/api/user-api/users', { method: 'POST', auth: false, body: payload });
    },

    /**
     * Dispara o e-mail de confirmação de conta (Resend, via backend). O backend
     * marca `is_verificado` no SQL quando o usuário abre o link do e-mail
     * (`GET /users/confirm-email?token=`). O login só passa após a confirmação.
     */
    sendConfirmationEmail(email: string) {
        return api('/api/user-api/users/send-confirmation', { method: 'POST', auth: false, body: { email } });
    },

    sendResetCode(email: string) {
        return api('/api/user-api/users/send-reset-code', { method: 'POST', auth: false, body: { email } });
    },

    verifyResetCode(email: string, otpCode: string) {
        return api('/api/user-api/users/verify-reset-code', { method: 'POST', auth: false, body: { email, otpCode } });
    },

    resetPassword(email: string, password: string, repeatPassword: string, otpCode: string) {
        return api('/api/user-api/users/reset-password', {
            method: 'POST',
            auth: false,
            body: { email, password, repeatPassword, otpCode },
        });
    },

    async logout() {
        const token = useAuthStore.getState().token;
        try {
            if (token) await api('/api/user-api/users/logout', { method: 'POST', body: { token } });
        } finally {
            useAuthStore.getState().logout();
        }
    },
};
