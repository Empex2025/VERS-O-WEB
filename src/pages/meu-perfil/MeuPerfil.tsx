import { useState } from 'react';
import { Settings, Pencil, ImageIcon, RefreshCcw } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { AppShell } from '../../components/layout/AppShell';
import { Avatar } from '../../components/ui/Avatar';
import { useAuthStore } from '../../store/useAuthStore';
import { socialService, type RawPost } from '../../services/socialService';
import { useApiData } from '../../hooks/useApiData';
import { compactNumber } from '../../lib/format';

const TABS = ['Publicações', 'Fotos', 'Reposts'] as const;

function roleLabel(tipo?: string) {
    if (tipo === 'profissional') return 'Profissional';
    if (tipo === 'clinica') return 'Clínica';
    return 'Paciente';
}

interface RawSeg { seguidor_id?: number; seguindo_id?: number }
interface MyData { posts: RawPost[]; followers: number; following: number }
const MY_FALLBACK: MyData = { posts: [], followers: 0, following: 0 };

/** Posts próprios + contadores de seguidores/seguindo (filtrado no cliente). */
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

    // Usa os dados do usuário logado; se não houver (modo demo), cai no padrão.
    const me = {
        name: user?.nome ?? 'Carlos Magno',
        handle: user?.username ? `@${user.username}` : user?.email ? `@${user.email.split('@')[0]}` : '@carlos.magno',
        role: roleLabel(user?.tipo_usuario),
        bio: user?.descricao_bio || 'Membro da comunidade iSaúde. 💙',
        stats: { posts: compactNumber(mine.posts.length), followers: compactNumber(mine.followers), following: compactNumber(mine.following) },
    };

    return (
        <AppShell rightRail={null}>
            <div className="max-w-4xl mx-auto">
                {/* Capa */}
                <div className="h-40 rounded-2xl bg-gradient-to-r from-[#407BFF] to-violet-400" />

                <div className="px-4 sm:px-6 -mt-12">
                    <div className="flex items-end justify-between">
                        <div className="p-1 bg-white rounded-full">
                            <Avatar name={me.name} size={96} />
                        </div>
                        {/* Ações do próprio perfil (sem Seguir/Bloquear) */}
                        <div className="flex items-center gap-2 mb-2">
                            <button
                                onClick={() => navigate('/meu-perfil/editar')}
                                className="flex items-center gap-1.5 text-sm font-bold px-5 py-2 rounded-full bg-[#407BFF] text-white hover:bg-blue-600 transition-colors"
                            >
                                <Pencil size={15} /> Editar Perfil
                            </button>
                            <button
                                onClick={() => navigate('/meu-perfil/opcoes')}
                                className="w-9 h-9 rounded-full border border-gray-200 flex items-center justify-center text-gray-600 hover:bg-gray-50"
                                title="Opções de perfil"
                            >
                                <Settings size={18} />
                            </button>
                        </div>
                    </div>

                    <div className="mt-3">
                        <h1 className="text-xl font-bold text-gray-900">{me.name}</h1>
                        <p className="text-sm text-gray-400">{me.handle}</p>
                        <button
                            onClick={() => navigate('/meu-perfil/editar')}
                            className="flex items-center gap-1 text-xs font-semibold text-[#407BFF] mt-1 hover:underline"
                        >
                            <RefreshCcw size={12} /> {me.role} · Trocar Perfil
                        </button>
                    </div>

                    <div className="flex gap-8 mt-4">
                        <Stat value={me.stats.posts} label="Publicações" />
                        <Stat value={me.stats.followers} label="Seguidores" />
                        <Stat value={me.stats.following} label="Seguindo" />
                    </div>

                    <p className="text-sm text-gray-700 mt-4 whitespace-pre-line leading-relaxed">{me.bio}</p>
                </div>

                {/* Abas */}
                <div className="flex border-b border-gray-100 mt-6 px-4 sm:px-6">
                    {TABS.map((t) => (
                        <button
                            key={t}
                            onClick={() => setTab(t)}
                            className={`px-4 py-3 text-sm font-semibold transition-colors border-b-2 -mb-px ${
                                tab === t ? 'border-[#407BFF] text-[#407BFF]' : 'border-transparent text-gray-500 hover:text-gray-700'
                            }`}
                        >
                            {t}
                        </button>
                    ))}
                </div>

                {tab === 'Publicações' && mine.posts.length === 0 ? (
                    <p className="text-sm text-gray-400 py-10 text-center">Você ainda não publicou nada.</p>
                ) : (
                    <div className="grid grid-cols-3 gap-2 p-4 sm:p-6">
                        {mine.posts.map((p) => (
                            <div key={p.id} className="aspect-square rounded-lg bg-gray-100 p-3 flex items-center justify-center text-center overflow-hidden">
                                <p className="text-[11px] text-gray-600 line-clamp-5">{p.conteudo}</p>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </AppShell>
    );
}

function Stat({ value, label }: { value: string; label: string }) {
    return (
        <div className="text-center">
            <p className="text-base font-bold text-gray-900">{value}</p>
            <p className="text-xs text-gray-400">{label}</p>
        </div>
    );
}
