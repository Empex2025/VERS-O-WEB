import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface AuthUser {
    id: number;
    nome: string;
    email: string;
    tipo_usuario: 'paciente' | 'profissional' | 'clinica' | string;
    ft_perfil?: string;
}

interface AuthState {
    token: string | null;
    user: AuthUser | null;
    setAuth: (token: string, user: AuthUser) => void;
    logout: () => void;
    isAuthenticated: () => boolean;
}

/** Sessão do usuário (token JWT + dados). Persistida no localStorage. */
export const useAuthStore = create<AuthState>()(
    persist(
        (set, get) => ({
            token: null,
            user: null,
            setAuth: (token, user) => set({ token, user }),
            logout: () => set({ token: null, user: null }),
            isAuthenticated: () => !!get().token,
        }),
        { name: 'isaude-auth' },
    ),
);
