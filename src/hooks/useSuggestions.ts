import { useState } from 'react';
import { profileService } from '../services/profileService';
import { socialService } from '../services/socialService';
import { useAuthStore } from '../store/useAuthStore';
import { useApiData } from './useApiData';

export interface Suggestion {
    id: number;
    name: string;
    handle: string;
    role: string;
    verified: boolean;
}

interface RawDirUser {
    id: number;
    nome?: string;
    username?: string;
    tipo_usuario?: string;
    is_verificado?: boolean;
}

const ROLE: Record<string, string> = {
    profissional: 'Profissional',
    clinica: 'Clínica',
    paciente: 'Paciente',
};

/** Usuários reais do diretório público (`GET /users`), exceto o logado. */
async function fetchSuggestions(selfId?: number): Promise<Suggestion[]> {
    const users = (await profileService.getDirectory()) as RawDirUser[];
    return users
        .filter((u) => u && u.id !== selfId)
        .map((u) => ({
            id: u.id,
            name: u.nome || `Usuário ${u.id}`,
            handle: u.username ? `@${u.username}` : `@user${u.id}`,
            role: ROLE[u.tipo_usuario || ''] || 'Membro',
            verified: !!u.is_verificado,
        }));
}

/**
 * Lista de "pessoas para seguir" (dados reais) + ação de seguir.
 * Reutilizado no rail de sugestões, no Início, no perfil profissional e no compartilhar.
 */
export function useSuggestions() {
    const selfId = useAuthStore((s) => s.user?.id);
    const { data: suggestions, loading } = useApiData<Suggestion[]>(() => fetchSuggestions(selfId), [], [selfId]);
    const [followed, setFollowed] = useState<Set<number>>(new Set());

    const follow = (id: number) => {
        setFollowed((prev) => new Set(prev).add(id));
        socialService.seguidores.create({ seguindo_id: id }).catch(() => { /* otimista */ });
    };

    return { suggestions, loading, followed, follow };
}
