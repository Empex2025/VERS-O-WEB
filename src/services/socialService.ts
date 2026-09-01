import { api } from './http';
import { makeCrud, qs } from './crud';
import { profileService } from './profileService';
import { timeAgo, compactNumber } from '../lib/format';
import type { Post } from '../data/social';

const P = '/api/social-midia';

/** Registro de postagem cru vindo do feed ranqueado. */
export interface RawPost {
    id: number;
    conteudo: string;
    midias: string | null;
    dt_postagem: string;
    autor_id: number;
    tipo_conteudo: string;
    hashtags?: string;
    curtidas_count?: number;
    curtidas?: number;
    comentarios_count?: number;
    comentarios_qtd?: number;
    compartilhamentos?: number;
    autor_verificado?: boolean;
}

export interface RawUser {
    id?: number;
    id_usuario?: number;
    nome?: string;
    username?: string;
    tipo_usuario?: string;
    ft_perfil?: string;
    is_verificado?: boolean;
}

function mapUserName(u: RawUser | undefined, autorId: number) {
    return {
        name: u?.nome || `Usuário ${autorId}`,
        handle: u?.username ? `@${u.username}` : `@user${autorId}`,
        role: u?.tipo_usuario === 'profissional' ? 'Profissional' : u?.tipo_usuario === 'clinica' ? 'Clínica' : 'Paciente',
        verified: !!u?.is_verificado,
    };
}

/** Converte uma postagem crua + autor para o tipo `Post` usado na UI. */
export function toPost(raw: RawPost, user?: RawUser): Post {
    let hasImage = false;
    try {
        const midias = raw.midias ? JSON.parse(raw.midias) : [];
        hasImage = Array.isArray(midias) && midias.length > 0;
    } catch { /* ignore */ }
    return {
        id: String(raw.id),
        author: mapUserName(user, raw.autor_id),
        time: timeAgo(raw.dt_postagem),
        text: raw.conteudo,
        hasImage,
        likes: compactNumber(raw.curtidas_count ?? raw.curtidas ?? 0),
        comments: `${compactNumber(raw.comentarios_count ?? raw.comentarios_qtd ?? 0)} Comentários`,
        shares: `${compactNumber(raw.compartilhamentos ?? 0)} Compartilhamentos`,
    };
}

export const socialService = {
    posts: makeCrud(P, 'postagem'),
    comentarios: makeCrud(P, 'comentario'),
    curtidas: makeCrud(P, 'curtida'),
    notificacoes: makeCrud(P, 'notificacao'),
    salvamentos: makeCrud(P, 'salvamento'),
    seguidores: makeCrud(P, 'seguidor'),
    stories: makeCrud(P, 'story'),
    profissionalDetalhes: makeCrud(P, 'profissional-detalhes'),
    anuncios: makeCrud(P, 'anuncio'),

    /** Feed ranqueado + enriquecimento de autor. Retorna já mapeado para a UI. */
    async getFeed(params?: { limit?: number; dias?: number; cursor?: string }): Promise<Post[]> {
        const data = await api<{ results: RawPost[] }>(`${P}/feed${qs(params as Record<string, unknown>)}`);
        const results = data.results ?? [];
        const authorIds = [...new Set(results.map((p) => p.autor_id).filter(Boolean))];
        const usersById = new Map<number, RawUser>();
        await Promise.all(
            authorIds.map(async (id) => {
                try {
                    const user = await profileService.getPublicUser<RawUser>(id);
                    if (user) usersById.set(id, user);
                } catch { /* autor sem dados: usa fallback */ }
            }),
        );
        return results.map((p) => toPost(p, usersById.get(p.autor_id)));
    },

    likePost: (postagem_id: number, autor_id: number) =>
        socialService.curtidas.create({ postagem_id, autor_id }),

    comment: (id_postagem: number, autor_id: number, conteudo: string) =>
        socialService.comentarios.create({ id_postagem, autor_id, conteudo }),

    conversas: {
        list: <T = unknown>() => api<T>(`${P}/conversas`),
        historico: <T = unknown>(params?: Record<string, unknown>) => api<T>(`${P}/conversas/historico${qs(params)}`),
        enviar: (body: unknown) => api(`${P}/conversas`, { method: 'POST', body }),
    },
};
