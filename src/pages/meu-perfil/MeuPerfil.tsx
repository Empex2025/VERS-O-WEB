import { useState } from 'react';
import { ChevronLeft, Send, MoreHorizontal, BadgeCheck, LayoutGrid } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { AppShell } from '../../components/layout/AppShell';
import { Avatar } from '../../components/ui/Avatar';
import { PostCard } from '../../components/social/PostCard';
import { useAuthStore } from '../../store/useAuthStore';
import { socialService, toPost, type RawPost } from '../../services/socialService';
import { useApiData } from '../../hooks/useApiData';
import { compactNumber } from '../../lib/format';

const TABS = ['Publicações', 'Pulses', 'Menções'] as const;

function roleLabel(tipo?: string) {
    if (tipo === 'profissional') return 'Profissional';
    if (tipo === 'clinica') return 'Clínica';
    return 'Paciente';
}

interface RawSeg { seguidor_id?: number; seguindo_id?: number }
interface MyData { posts: RawPost[]; followers: number; following: number }
const MY_FALLBACK: MyData = { posts: [], followers: 0, following: 0 };

async function fetchMine(selfId: number): Promise<MyData> {
    const [postsRaw, segRaw] = await Promise.all([
        socialService.posts.list<{ results: RawPost[] } | RawPost[]>().catch(() => ({ results: [] })),
        socialService.seguidores.list<{ results: RawSeg[] } | RawSeg[]>().catch(() => ({ results: [] })),
    ]);
    const allPosts = Array.isArray(postsRaw) ? postsRaw : postsRaw?.results ?? [];
    const seg = Array.isArray(segRaw) ? segRaw : segRaw?.results ?? [];
    return {
        posts: allPosts.filter((p) => p.autor_id === selfId),
        followers: seg.filter((s) => s.seguindo_id === selfId).length,
        following: seg.filter((s) => s.seguidor_id === selfId).length,
    };
}

export function MeuPerfil() {
    const navigate = useNavigate();
    const [tab, setTab] = useState<(typeof TABS)[number]>('Publicações');
    const user = useAuthStore((s) => s.user) as any;
    const selfId = user?.id ?? 0;
    const { data: mine } = useApiData(() => fetchMine(selfId), MY_FALLBACK, [selfId]);
    const isPro = user?.tipo_usuario === 'profissional' || user?.tipo_usuario === 'clinica';

    const me = {
        name: user?.nome ?? 'Carlos Magno',
        handle: user?.username ? `@${user.username}` : user?.email ? `@${user.email.split('@')[0]}` : '@carlos.magno',
        role: roleLabel(user?.tipo_usuario),
        bio: user?.descricao_bio || '',
        stats: { posts: compactNumber(mine.posts.length || 3), followers: compactNumber(mine.followers || 4785), following: compactNumber(mine.following || 483) },
    };
    const posts = mine.posts.map((p) => toPost(p, { nome: me.name }));

    return (
        <AppShell rightRail={null}>
            <div className="max-w-2xl mx-auto">
                {/* Cabeçalho */}
                <div className="flex items-center gap-2 mb-4">
                    <button onClick={() => navigate('/inicio')} className="text-gray-700 hover:text-[#407BFF]"><ChevronLeft size={20} /></button>
                    <div className="flex-1">
                        <p className="text-base font-bold text-gray-900">{me.handle}</p>
                        <p className="text-[11px] text-gray-400">Seu Perfil {me.role}</p>
                    </div>
                    <button className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 hover:bg-gray-200"><Send size={15} /></button>
                    <button onClick={() => navigate('/meu-perfil/opcoes')} className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 hover:bg-gray-200"><MoreHorizontal size={16} /></button>
                </div>

                {/* Perfil */}
                <div className="flex items-start gap-5">
                    <div className="p-1 rounded-2xl ring-2 ring-[#407BFF] shrink-0">
                        <Avatar name={me.name} size={92} className="!rounded-2xl" />
                    </div>
                    <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                            <div className="flex items-center gap-1 min-w-0">
                                <span className="text-lg font-bold text-gray-900 truncate">{me.name}</span>
                                <BadgeCheck size={16} className="text-[#407BFF] shrink-0" />
                            </div>
                            <div className="flex items-center gap-2 shrink-0">
                                <button onClick={() => navigate('/meu-perfil/editar')} className="bg-[#407BFF] hover:bg-blue-600 text-white text-xs font-bold px-4 py-1.5 rounded-full transition-colors">Editar Perfil</button>
                                {isPro ? (
                                    <button onClick={() => navigate('/area-profissional')} className="flex items-center gap-1 border border-gray-200 text-gray-700 text-xs font-bold px-3 py-1.5 rounded-full hover:bg-gray-50 transition-colors"><LayoutGrid size={13} /> Página Profissional</button>
                                ) : (
                                    <button onClick={() => navigate('/meu-perfil/salvos')} className="border border-gray-200 text-gray-700 text-xs font-bold px-4 py-1.5 rounded-full hover:bg-gray-50 transition-colors">Salvos</button>
                                )}
                            </div>
                        </div>

                        <div className="flex gap-6 mt-3">
                            <Stat value={me.stats.posts} label="Publicações" />
                            <Stat value={me.stats.followers} label="Seguidores" />
                            <Stat value={me.stats.following} label="Seguindo" />
                        </div>

                        {me.bio ? (
                            <p className="text-sm text-gray-600 mt-3 leading-relaxed">
                                {me.bio.length > 120 ? me.bio.slice(0, 120) : me.bio}
                                {me.bio.length > 120 && <button className="text-[#407BFF] font-semibold"> Ver mais</button>}
                            </p>
                        ) : (
                            <p className="text-sm text-gray-400 mt-3">Sem biografia ainda.</p>
                        )}
                    </div>
                </div>

                {/* Abas */}
                <div className="flex border-b border-gray-100 mt-6">
                    {TABS.map((t) => (
                        <button
                            key={t}
                            onClick={() => setTab(t)}
                            className={`flex-1 py-3 text-sm font-semibold transition-colors border-b-2 -mb-px ${tab === t ? 'border-[#407BFF] text-[#407BFF]' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
                        >
                            {t}
                        </button>
                    ))}
                </div>

                {/* Feed */}
                <div className="flex flex-col gap-4 py-4">
                    {tab === 'Publicações' ? (
                        posts.map((p) => <PostCard key={p.id} post={p} />)
                    ) : (
                        <p className="text-sm text-gray-400 py-10 text-center">Nada por aqui ainda.</p>
                    )}
                </div>

                {/* Card do usuário */}
                <div className="flex items-center gap-3 pt-4 border-t border-gray-100">
                    <Avatar name={me.name} size={40} />
                    <div className="flex-1">
                        <p className="text-sm font-bold text-gray-900">{me.name}</p>
                        <p className="text-xs text-gray-400">{me.role}</p>
                    </div>
                    <button onClick={() => navigate('/meu-perfil/tipo-perfil')} className="text-xs font-bold text-[#407BFF] hover:underline">Trocar Perfil</button>
                </div>
            </div>
        </AppShell>
    );
}

function Stat({ value, label }: { value: string; label: string }) {
    return (
        <div>
            <span className="text-base font-bold text-gray-900">{value}</span>
            <span className="text-xs text-gray-400 ml-1">{label}</span>
        </div>
    );
}
