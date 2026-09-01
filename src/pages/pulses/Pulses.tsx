import { useEffect, useState } from 'react';
import {
    Heart, MessageCircle, Send, MoreHorizontal, ChevronUp, ChevronDown,
    Play, X, Music, Info, Flag, Ban,
} from 'lucide-react';
import { AppShell } from '../../components/layout/AppShell';
import { Avatar } from '../../components/ui/Avatar';
import { ShareModal } from '../../components/social/ShareModal';
import { socialService } from '../../services/socialService';
import { profileService } from '../../services/profileService';
import { useAuthStore } from '../../store/useAuthStore';
import { useApiData } from '../../hooks/useApiData';
import { compactNumber } from '../../lib/format';

interface RawPost { id: number; conteudo: string; autor_id: number; tipo_conteudo: string; curtidas_count?: number; curtidas?: number; comentarios_count?: number; comentarios_qtd?: number }
interface RawComment { id?: number; id_comentario?: number; id_postagem?: number; autor_id?: number; conteudo?: string }
interface RawUser { nome?: string; username?: string; is_verificado?: boolean }
interface Pulse { id: number; authorName: string; authorHandle: string; verified: boolean; caption: string; likes: number; comments: number }

const PULSE_FALLBACK: Pulse[] = [
    { id: -1, authorName: 'Dr. Walter Alencar', authorHandle: '@dr.walter.alencar', verified: true, caption: '😴 Você sabia que seu cérebro faz uma faxina enquanto você dorme?', likes: 25000, comments: 2000 },
];
const COMMENTS_FALLBACK = [
    { name: 'Jorge Zikenay', text: 'Rotina rápida de 3 exercícios para aliviar dor nas costas.', time: 'Há 1d' },
    { name: 'anapaulanutri', text: 'Não sabia disso até me deparar com esse vídeo!', time: '15:24' },
];

async function fetchPulses(): Promise<Pulse[]> {
    const raw = await socialService.posts.list<{ results: RawPost[] } | RawPost[]>();
    const list = Array.isArray(raw) ? raw : raw?.results ?? [];
    const pulses = list.filter((p) => p.tipo_conteudo === 'pulse');
    const source = pulses.length ? pulses : list; // sem pulses: mostra qualquer post
    return Promise.all(
        source.map(async (p) => {
            let name = `Usuário ${p.autor_id}`, handle = `@user${p.autor_id}`, verified = false;
            try {
                const user = await profileService.getPublicUser<RawUser>(p.autor_id);
                if (user) { name = user.nome || name; handle = user.username ? `@${user.username}` : handle; verified = !!user.is_verificado; }
            } catch { /* fallback */ }
            return { id: p.id, authorName: name, authorHandle: handle, verified, caption: p.conteudo, likes: p.curtidas_count ?? p.curtidas ?? 0, comments: p.comentarios_count ?? p.comentarios_qtd ?? 0 };
        }),
    );
}

export function Pulses() {
    const selfId = useAuthStore((s) => s.user?.id) ?? 0;
    const { data: pulses } = useApiData(fetchPulses, PULSE_FALLBACK, []);
    const [idx, setIdx] = useState(0);
    const [showComments, setShowComments] = useState(false);
    const [showMenu, setShowMenu] = useState(false);
    const [liked, setLiked] = useState(false);
    const [sharing, setSharing] = useState(false);
    const [draft, setDraft] = useState('');
    const [comments, setComments] = useState<{ name: string; text: string; time?: string }[]>(COMMENTS_FALLBACK);

    const pulse = pulses[idx] ?? PULSE_FALLBACK[0];
    const isReal = pulse.id > 0;

    // Carrega comentários reais do pulse ativo.
    useEffect(() => {
        let alive = true;
        if (!isReal) { setComments(COMMENTS_FALLBACK); return; }
        (async () => {
            try {
                const raw = await socialService.comentarios.list<{ results: RawComment[] } | RawComment[]>({ id_postagem: pulse.id });
                const all = Array.isArray(raw) ? raw : raw?.results ?? [];
                const mine = all.filter((c) => !c.id_postagem || c.id_postagem === pulse.id);
                const mapped = await Promise.all(mine.map(async (c) => {
                    let name = `Usuário ${c.autor_id}`;
                    try { const user = await profileService.getPublicUser<RawUser>(c.autor_id!); if (user?.nome) name = user.nome; } catch { /* fallback */ }
                    return { name, text: c.conteudo || '' };
                }));
                if (alive) setComments(mapped);
            } catch { if (alive) setComments([]); }
        })();
        return () => { alive = false; };
    }, [pulse.id, isReal]);

    const go = (d: number) => {
        setIdx((i) => Math.max(0, Math.min(pulses.length - 1, i + d)));
        setLiked(false); setShowComments(false);
    };

    const like = async () => {
        const next = !liked;
        setLiked(next);
        if (next && isReal) { try { await socialService.likePost(pulse.id, selfId); } catch { /* otimista */ } }
    };

    const sendComment = async () => {
        const text = draft.trim();
        if (!text) return;
        setComments((c) => [{ name: 'Você', text }, ...c]);
        setDraft('');
        if (isReal) { try { await socialService.comment(pulse.id, selfId, text); } catch { /* otimista */ } }
    };

    return (
        <AppShell rightRail={null} bare>
            <div className="flex items-center justify-center gap-4 py-6 px-4 min-h-[calc(100vh-4rem)]">
                {/* Vídeo vertical */}
                <div className="relative h-[80vh] aspect-[9/16] rounded-2xl overflow-hidden bg-gradient-to-b from-gray-700 to-gray-900 shrink-0">
                    {/* Placeholder de vídeo */}
                    <div className="absolute inset-0 flex items-center justify-center text-white/40">
                        <Play size={64} />
                    </div>

                    {/* Autor (topo) */}
                    <div className="absolute top-4 left-4 right-4 flex items-center gap-2">
                        <Avatar name={pulse.authorName} size={36} />
                        <span className="text-white text-sm font-bold flex items-center gap-1">
                            {pulse.authorName} {pulse.verified && <span className="text-[#7db1ff] text-xs">✔</span>}
                        </span>
                        <button className="ml-1 text-xs font-bold text-white border border-white/70 px-3 py-1 rounded-full hover:bg-white/10">
                            Seguir
                        </button>
                    </div>

                    {/* Rodapé (autor + áudio) */}
                    <div className="absolute bottom-4 left-4 right-16 text-white">
                        <p className="text-sm font-bold">{pulse.authorHandle}</p>
                        <p className="text-xs text-white/80 mt-1 line-clamp-2">
                            {pulse.caption}
                        </p>
                        <p className="text-xs text-white/70 mt-2 flex items-center gap-1.5">
                            <Music size={12} /> Áudio original · iSaúde
                        </p>
                    </div>

                    {/* Ações laterais */}
                    <div className="absolute bottom-4 right-3 flex flex-col items-center gap-4 text-white">
                        <ActionButton icon={<Heart size={26} className={liked ? 'fill-rose-500 text-rose-500' : ''} />} label={compactNumber(pulse.likes + (liked ? 1 : 0))} onClick={like} />
                        <ActionButton icon={<MessageCircle size={26} />} label={compactNumber(pulse.comments)} onClick={() => setShowComments((v) => !v)} />
                        <ActionButton icon={<Send size={26} />} label="Enviar" onClick={() => setSharing(true)} />
                        <ActionButton icon={<MoreHorizontal size={26} />} onClick={() => setShowMenu((v) => !v)} />
                    </div>

                    {/* Navegação */}
                    <div className="absolute top-1/2 -translate-y-1/2 right-3 flex flex-col gap-2 opacity-0">
                        <ChevronUp /><ChevronDown />
                    </div>
                </div>

                {/* Navegação cima/baixo */}
                <div className="hidden md:flex flex-col gap-3">
                    <button onClick={() => go(-1)} disabled={idx === 0} className="w-10 h-10 rounded-full bg-white shadow flex items-center justify-center text-gray-600 hover:bg-gray-50 disabled:opacity-40">
                        <ChevronUp size={20} />
                    </button>
                    <button onClick={() => go(1)} disabled={idx >= pulses.length - 1} className="w-10 h-10 rounded-full bg-white shadow flex items-center justify-center text-gray-600 hover:bg-gray-50 disabled:opacity-40">
                        <ChevronDown size={20} />
                    </button>
                </div>

                {/* Painel de comentários */}
                {showComments && (
                    <div className="h-[80vh] w-80 bg-white rounded-2xl border border-gray-100 shadow-sm flex flex-col shrink-0">
                        <div className="flex items-center justify-between p-4 border-b border-gray-100">
                            <h3 className="font-bold text-gray-900">Comentários</h3>
                            <button onClick={() => setShowComments(false)} className="text-gray-400 hover:text-gray-600"><X size={18} /></button>
                        </div>
                        <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-4">
                            {comments.length === 0 && <p className="text-xs text-gray-400 text-center mt-6">Seja o primeiro a comentar.</p>}
                            {comments.map((c, i) => (
                                <div key={i} className="flex gap-2.5">
                                    <Avatar name={c.name} size={32} />
                                    <div className="flex-1">
                                        <p className="text-xs font-bold text-gray-900 flex items-center gap-1">
                                            {c.name}
                                            {c.time && <span className="font-normal text-gray-400 ml-1">{c.time}</span>}
                                        </p>
                                        <p className="text-xs text-gray-600 mt-0.5">{c.text}</p>
                                        <button className="text-[11px] text-gray-400 mt-1 hover:text-gray-600">Responder</button>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <div className="p-3 border-t border-gray-100 flex items-center gap-2">
                            <input
                                value={draft}
                                onChange={(e) => setDraft(e.target.value)}
                                onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); sendComment(); } }}
                                placeholder="Escreva um comentário"
                                className="flex-1 bg-[#F3F4F6] rounded-full py-2 px-4 text-sm outline-none"
                            />
                            <button onClick={sendComment} disabled={!draft.trim()} className="w-9 h-9 rounded-full bg-[#407BFF] text-white flex items-center justify-center disabled:bg-gray-200 disabled:text-gray-400"><Send size={16} /></button>
                        </div>
                    </div>
                )}
            </div>

            {/* Menu de opções */}
            {showMenu && (
                <div className="fixed inset-0 z-40 bg-black/30 flex items-center justify-center p-4" onClick={() => setShowMenu(false)}>
                    <div className="bg-white rounded-2xl shadow-xl w-full max-w-xs overflow-hidden" onClick={(e) => e.stopPropagation()}>
                        <div className="flex items-center gap-3 p-4 border-b border-gray-100">
                            <Avatar name={pulse.authorName} size={40} />
                            <div>
                                <p className="text-sm font-bold text-gray-900">{pulse.authorName}</p>
                                <p className="text-xs text-gray-400">{pulse.authorHandle}</p>
                            </div>
                            <button onClick={() => setShowMenu(false)} className="ml-auto text-gray-400"><X size={18} /></button>
                        </div>
                        <MenuRow icon={<Info size={18} />} label="Sobre esta Conta" />
                        <MenuRow icon={<Flag size={18} />} label="Denunciar" />
                        <MenuRow icon={<Ban size={18} />} label="Bloquear Usuário" danger />
                    </div>
                </div>
            )}

            <ShareModal open={sharing} onClose={() => setSharing(false)} />
        </AppShell>
    );
}

function ActionButton({ icon, label, onClick }: { icon: React.ReactNode; label?: string; onClick?: () => void }) {
    return (
        <button onClick={onClick} className="flex flex-col items-center gap-1 hover:scale-110 transition-transform">
            <span className="w-11 h-11 rounded-full bg-black/30 flex items-center justify-center">{icon}</span>
            {label && <span className="text-xs font-semibold">{label}</span>}
        </button>
    );
}

function MenuRow({ icon, label, danger }: { icon: React.ReactNode; label: string; danger?: boolean }) {
    return (
        <button className={`w-full flex items-center gap-3 px-4 py-3.5 text-sm font-medium hover:bg-gray-50 transition-colors ${danger ? 'text-rose-500' : 'text-gray-700'}`}>
            {icon} {label}
        </button>
    );
}
