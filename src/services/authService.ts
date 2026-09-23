import { signInWithEmailAndPassword, sendEmailVerification } from 'firebase/auth';
import { api } from './http';
import { firebaseAuth } from './firebase';
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
        return data;
    },

    register(payload: RegisterPayload) {
        return api('/api/user-api/users', { method: 'POST', auth: false, body: payload });
    },

    /**
     * Dispara o e-mail de ativação via Firebase. O backend já criou o usuário no
     * Firebase (emailVerified=false) com esta mesma senha, então autenticamos no
     * cliente e pedimos ao Firebase para enviar o link de verificação por e-mail.
     */
    async sendActivationEmail(email: string, password: string) {
        const cred = await signInWithEmailAndPassword(firebaseAuth, email, password);
        await sendEmailVerification(cred.user);
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
