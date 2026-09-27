import { useState } from 'react';
import { MoreHorizontal, ImageIcon } from 'lucide-react';
import { AppShell } from '../../components/layout/AppShell';
import { PageHeader } from '../../components/layout/PageHeader';
import { PostCard } from '../../components/social/PostCard';
import type { Post } from '../../data/social';
import { socialService, toPost, type RawPost, type RawUser } from '../../services/socialService';
import { profileService } from '../../services/profileService';
import { useApiData } from '../../hooks/useApiData';

const TABS = ['Publicações', 'Perfis', 'Pulses'] as const;

interface RawSalvamento { tipo_conteudo?: string; postagem?: RawPost }

/** Publicações salvas do usuário → mapeadas para a UI (com autor enriquecido). */
async function fetchSaved(): Promise<Post[]> {
    const raw = await socialService.salvamentos.list<{ results: RawSalvamento[] } | RawSalvamento[]>();
    const list = Array.isArray(raw) ? raw : raw?.results ?? [];
    const posts = list.filter((s) => s.tipo_conteudo === 'postagem' && s.postagem).map((s) => s.postagem as RawPost);
    const ids = [...new Set(posts.map((p) => p.autor_id).filter(Boolean))];
    const byId = new Map<number, RawUser>();
    await Promise.all(ids.map(async (id) => { try { const u = await profileService.getPublicUser<RawUser>(id); if (u) byId.set(id, u); } catch { /* fallback */ } }));
    return posts.map((p) => toPost(p, byId.get(p.autor_id)));
}

export function Salvos() {
    const [tab, setTab] = useState<(typeof TABS)[number]>('Publicações');
    const { data: saved } = useApiData(fetchSaved, [], []);

    return (
        <AppShell rightRail={null}>
            <div className="max-w-2xl mx-auto">
                <PageHeader
                    title="Salvos"
                    to="/meu-perfil"
                    right={<button className="text-gray-500 hover:text-[#407BFF]"><MoreHorizontal size={20} /></button>}
                />

                {/* Abas */}
                <div className="flex gap-2 bg-gray-100 rounded-full p-1 mb-4">
                    {TABS.map((t) => (
                        <button
                            key={t}
                            onClick={() => setTab(t)}
                            className={`flex-1 py-2 rounded-full text-sm font-semibold transition-colors ${tab === t ? 'bg-white text-[#407BFF] shadow-sm' : 'text-gray-500'}`}
                        >
                            {t}
                        </button>
                    ))}
                </div>

                {tab === 'Publicações' && (
                    saved.length === 0 ? (
                        <p className="text-sm text-gray-400 py-10 text-center">Você ainda não salvou publicações.</p>
                    ) : (
                        <div className="flex flex-col gap-4">
                            {saved.map((p) => <PostCard key={p.id} post={p} />)}
                        </div>
                    )
                )}

                {tab === 'Perfis' && (
                    <p className="text-sm text-gray-400 py-10 text-center">Nenhum perfil salvo ainda.</p>
                )}

                {tab === 'Pulses' && (
                    <div className="grid grid-cols-3 gap-2">
                        {Array.from({ length: 6 }).map((_, i) => (
                            <div key={i} className="aspect-[9/16] rounded-lg bg-gray-100 flex items-center justify-center text-gray-300">
                                <ImageIcon size={28} />
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </AppShell>
    );
}
