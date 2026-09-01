import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { MoreHorizontal, ImageIcon, X, Flag, VolumeX, Ban, Lock, UserX, MessageCircle } from 'lucide-react';
import { AppShell } from '../../components/layout/AppShell';
import { Avatar } from '../../components/ui/Avatar';
import { profileService } from '../../services/profileService';
import { useApiData } from '../../hooks/useApiData';

interface ProfileData {
    name: string;
    handle: string;
    verified?: boolean;
    professional?: boolean;
    bio: string;
    stats: { posts: string; followers: string; following: string };
}

const TABS = ['Publicações', 'Fotos', 'Reposts'] as const;

function ProfileView({ profile }: { profile: ProfileData }) {
    const [tab, setTab] = useState<(typeof TABS)[number]>('Publicações');
    const [following, setFollowing] = useState(false);
    const [menuOpen, setMenuOpen] = useState(false);
    const [confirmBlock, setConfirmBlock] = useState(false);
    const [blocked, setBlocked] = useState(false);

    return (
        <AppShell rightRail={null}>
            <div className="max-w-4xl mx-auto">
                {/* Capa */}
                <div className={`h-40 rounded-2xl ${profile.professional ? 'bg-gradient-to-r from-[#407BFF] to-emerald-400' : 'bg-gradient-to-r from-violet-400 to-rose-300'}`} />

                {/* Cabeçalho do perfil */}
                <div className="px-4 sm:px-6 -mt-12">
                    <div className="flex items-end justify-between">
                        <div className="p-1 bg-white rounded-full">
                            <Avatar name={profile.name} size={96} ring={profile.professional} />
                        </div>
                        <div className="flex items-center gap-2 mb-2">
                            {!blocked && (
                                <button
                                    onClick={() => setFollowing((v) => !v)}
                                    className={`text-sm font-bold px-5 py-2 rounded-full transition-colors ${
                                        following ? 'bg-gray-100 text-gray-700' : 'bg-[#407BFF] text-white hover:bg-blue-600'
                                    }`}
                                >
                                    {following ? 'Seguindo' : 'Seguir'}
                                </button>
                            )}
                            <button className="flex items-center gap-1.5 text-sm font-bold px-5 py-2 rounded-full border border-gray-200 text-gray-700 hover:bg-gray-50">
                                {profile.professional ? 'Página Profissional' : (<><MessageCircle size={16} /> Mensagem</>)}
                            </button>
                            <button onClick={() => setMenuOpen(true)} className="w-9 h-9 rounded-full border border-gray-200 flex items-center justify-center text-gray-600 hover:bg-gray-50">
                                <MoreHorizontal size={18} />
                            </button>
                        </div>
                    </div>

                    <div className="mt-3">
                        <h1 className="text-xl font-bold text-gray-900 flex items-center gap-1.5">
                            {profile.name}
                            {profile.verified && <span className="text-[#407BFF] text-sm">✔</span>}
                        </h1>
                        <p className="text-sm text-gray-400">{profile.handle}</p>
                    </div>

                    {/* Stats */}
                    <div className="flex gap-8 mt-4">
                        <Stat value={profile.stats.posts} label="Publicações" />
                        <Stat value={profile.stats.followers} label="Seguidores" />
                        <Stat value={profile.stats.following} label="Seguindo" />
                    </div>

                    {/* Bio */}
                    <p className="text-sm text-gray-700 mt-4 whitespace-pre-line leading-relaxed">{profile.bio}</p>
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

                {/* Conteúdo */}
                {blocked ? (
                    <div className="flex flex-col items-center text-center py-20 text-gray-500">
                        <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mb-4">
                            <UserX size={30} className="text-gray-400" />
                        </div>
                        <h2 className="text-lg font-bold text-gray-900">Usuário Bloqueado</h2>
                        <p className="text-sm mt-1 max-w-xs">
                            Você bloqueou este perfil. Nenhuma publicação será exibida enquanto o bloqueio estiver ativo.
                        </p>
                        <button onClick={() => setBlocked(false)} className="mt-5 text-sm font-bold text-[#407BFF] hover:underline">
                            Desbloquear
                        </button>
                    </div>
                ) : (
                    <div className="grid grid-cols-3 gap-2 p-4 sm:p-6">
                        {Array.from({ length: 9 }).map((_, i) => (
                            <div key={i} className="aspect-square rounded-lg bg-gray-100 flex items-center justify-center text-gray-300">
                                <ImageIcon size={32} />
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Menu "Sobre a Conta" */}
            {menuOpen && (
                <div className="fixed inset-0 z-40 bg-black/30 flex items-center justify-center p-4" onClick={() => setMenuOpen(false)}>
                    <div className="bg-white rounded-2xl shadow-xl w-full max-w-xs overflow-hidden" onClick={(e) => e.stopPropagation()}>
                        <div className="flex items-center justify-between p-4 border-b border-gray-100">
                            <h3 className="font-bold text-gray-900">Sobre a Conta</h3>
                            <button onClick={() => setMenuOpen(false)} className="text-gray-400"><X size={18} /></button>
                        </div>
                        <MenuRow icon={<Flag size={18} />} label="Reportar Perfil" />
                        <MenuRow icon={<VolumeX size={18} />} label="Silenciar" />
                        <MenuRow
                            icon={<Ban size={18} />}
                            label="Bloquear Usuário"
                            danger
                            onClick={() => { setMenuOpen(false); setConfirmBlock(true); }}
                        />
                    </div>
                </div>
            )}

            {/* Confirmação de bloqueio */}
            {confirmBlock && (
                <div className="fixed inset-0 z-40 bg-black/40 flex items-center justify-center p-4">
                    <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm p-6 text-center relative">
                        <button onClick={() => setConfirmBlock(false)} className="absolute top-4 right-4 text-gray-400"><X size={18} /></button>
                        <div className="w-14 h-14 rounded-full bg-rose-50 flex items-center justify-center mx-auto mb-4">
                            <Ban size={26} className="text-rose-500" />
                        </div>
                        <h3 className="text-base font-bold text-gray-900">Você tem certeza que deseja bloquear {profile.handle}?</h3>
                        <p className="text-sm text-gray-500 mt-2">
                            A pessoa não poderá ver seu perfil nem entrar em contato, e você deixará de ver o conteúdo dela.
                        </p>
                        <button
                            onClick={() => { setBlocked(true); setConfirmBlock(false); }}
                            className="w-full mt-5 bg-rose-500 hover:bg-rose-600 text-white font-bold text-sm py-3 rounded-full transition-colors"
                        >
                            Sim, Bloquear
                        </button>
                        <button onClick={() => setConfirmBlock(false)} className="w-full mt-2 text-gray-500 font-semibold text-sm py-2">
                            Voltar
                        </button>
                    </div>
                </div>
            )}
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

function MenuRow({ icon, label, danger, onClick }: { icon: React.ReactNode; label: string; danger?: boolean; onClick?: () => void }) {
    return (
        <button onClick={onClick} className={`w-full flex items-center gap-3 px-4 py-3.5 text-sm font-medium hover:bg-gray-50 transition-colors ${danger ? 'text-rose-500' : 'text-gray-700'}`}>
            {icon} {label}
        </button>
    );
}

interface RawUser { id: number; nome?: string; username?: string; descricao_bio?: string | null; is_verificado?: boolean; tipo_usuario?: string }

const PERFIL_FALLBACK: ProfileData = {
    name: 'Dra. Maria Glenda',
    handle: '@dra.mariaglenda',
    verified: true,
    professional: true,
    bio: 'Clínica Geral · Atendimento humanizado. Compartilho conteúdo sobre saúde, prevenção e bem-estar. 💙',
    stats: { posts: '124', followers: '23mil', following: '2.870' },
};

/** Resolve o `:handle` (username ou id) para um usuário real. */
async function fetchProfile(handle?: string): Promise<ProfileData> {
    if (!handle) throw new Error('sem handle');
    const clean = handle.replace(/^@/, '');
    const res = await profileService.getUsers<{ users?: RawUser[] } | RawUser[]>();
    const list = Array.isArray(res) ? res : res?.users ?? [];
    const user = list.find((u) => String(u.id) === clean || u.username === clean);
    if (!user) throw new Error('não encontrado');
    return {
        name: user.nome || `Usuário ${user.id}`,
        handle: user.username ? `@${user.username}` : `@user${user.id}`,
        verified: !!user.is_verificado,
        professional: user.tipo_usuario === 'profissional' || user.tipo_usuario === 'clinica',
        bio: user.descricao_bio || 'Membro da comunidade iSaúde.',
        stats: { posts: '—', followers: '—', following: '—' },
    };
}

/** Perfil público (rota `/perfil/:handle`). */
export function Perfil() {
    const { handle } = useParams();
    const { data } = useApiData(() => fetchProfile(handle), PERFIL_FALLBACK, [handle]);
    return <ProfileView profile={data} />;
}

/** Perfil público de paciente. */
export function PerfilPaciente() {
    return (
        <ProfileView
            profile={{
                name: 'Luana Paiva',
                handle: '@luana.paiva',
                verified: true,
                professional: false,
                bio: 'Apaixonada por bem-estar e vida saudável. 🌱 Compartilhando minha jornada no iSaúde.',
                stats: { posts: '82', followers: '1.298', following: '453' },
            }}
        />
    );
}

/** Variante de perfil privado (perfis fechados). */
export function PerfilPrivado() {
    return (
        <AppShell rightRail={null}>
            <div className="max-w-4xl mx-auto">
                <div className="h-40 rounded-2xl bg-gradient-to-r from-gray-300 to-gray-400" />
                <div className="px-6 -mt-12">
                    <div className="p-1 bg-white rounded-full w-fit">
                        <Avatar name="Luana Paiva" size={96} />
                    </div>
                    <h1 className="text-xl font-bold text-gray-900 mt-3">Luana Paiva</h1>
                    <p className="text-sm text-gray-400">@luana.paiva</p>
                </div>
                <div className="flex flex-col items-center text-center py-20 text-gray-500">
                    <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mb-4">
                        <Lock size={28} className="text-gray-400" />
                    </div>
                    <h2 className="text-lg font-bold text-gray-900">Perfil Privado</h2>
                    <p className="text-sm mt-1 max-w-xs">Este perfil é privado. Siga para ver as publicações.</p>
                </div>
            </div>
        </AppShell>
    );
}
