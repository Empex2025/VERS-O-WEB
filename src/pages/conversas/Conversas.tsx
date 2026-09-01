import { useEffect, useState } from 'react';
import { Search, Send, Phone, Video, MoreHorizontal, X, Mic, MicOff, PhoneOff } from 'lucide-react';
import { AppShell } from '../../components/layout/AppShell';
import { Avatar } from '../../components/ui/Avatar';
import { suggestions } from '../../data/social';
import { socialService } from '../../services/socialService';
import { profileService } from '../../services/profileService';
import { useAuthStore } from '../../store/useAuthStore';
import { useApiData } from '../../hooks/useApiData';
import { timeAgo } from '../../lib/format';

interface RawConversa { contato_id: number; ultima_mensagem: string; dt_envio: string; enviada_por_mim: boolean }
interface RawMensagem { id: number; remetente_id: number; destinatario_id: number; mensagem: string; dt_envio: string }
interface RawUser { nome?: string }
interface ChatItem { contatoId: number; name: string; last: string; time: string; unread: number }

/** Fallback mock — mantém a tela navegável quando a API está fora ("modo demo"). */
const CHATS_FALLBACK: ChatItem[] = suggestions.map((p, i) => ({
    contatoId: -(i + 1),
    name: p.name,
    last: ['Podemos remarcar para amanhã?', 'Obrigada, doutor! 🙏', 'Vou te enviar o exame agora.', 'Perfeito, até lá!', 'Bom dia! Tudo bem?'][i] || '',
    time: ['09:12', 'Ontem', 'Ter', 'Seg', '12/08'][i] || '',
    unread: i === 0 ? 2 : 0,
}));

const MESSAGES_FALLBACK = [
    { me: false, text: 'Bom dia, doutora! Gostaria de remarcar minha consulta.' },
    { me: true, text: 'Bom dia! Claro, temos horário amanhã às 14h.' },
    { me: false, text: 'Podemos remarcar para amanhã?' },
    { me: true, text: 'Sim, confirmado para amanhã às 14h. 😊' },
];

/** Lista de conversas + enriquecimento do nome do contato. */
async function fetchChats(): Promise<ChatItem[]> {
    const raw = await socialService.conversas.list<RawConversa[] | { results: RawConversa[] }>();
    const list = Array.isArray(raw) ? raw : raw?.results ?? [];
    return Promise.all(
        list.map(async (c) => {
            let name = `Usuário ${c.contato_id}`;
            try {
                const user = await profileService.getPublicUser<RawUser>(c.contato_id);
                if (user?.nome) name = user.nome;
            } catch { /* sem dados do contato: usa fallback */ }
            return { contatoId: c.contato_id, name, last: c.ultima_mensagem, time: timeAgo(c.dt_envio), unread: 0 };
        }),
    );
}

export function Conversas() {
    const selfId = useAuthStore((s) => s.user?.id) ?? 0;
    const { data: chats } = useApiData(fetchChats, CHATS_FALLBACK, []);
    const [active, setActive] = useState(0);
    const [inCall, setInCall] = useState(false);
    const [messages, setMessages] = useState<{ me: boolean; text: string }[]>(MESSAGES_FALLBACK);
    const [draft, setDraft] = useState('');
    const [sending, setSending] = useState(false);
    const chat = chats[active];
    const isReal = !!chat && chat.contatoId > 0 && !!selfId;

    // Carrega o histórico real ao trocar de conversa (conversa mock mantém o fallback).
    useEffect(() => {
        let alive = true;
        if (!chat || chat.contatoId < 0 || !selfId) { setMessages(MESSAGES_FALLBACK); return; }
        (async () => {
            try {
                const raw = await socialService.conversas.historico<RawMensagem[]>({ usuario_id: selfId, contato_id: chat.contatoId });
                const list = Array.isArray(raw) ? raw : [];
                if (alive) setMessages(list.map((m) => ({ me: m.remetente_id === selfId, text: m.mensagem })));
            } catch {
                if (alive) setMessages([]);
            }
        })();
        return () => { alive = false; };
    }, [chat?.contatoId, selfId]);

    const sendMessage = async () => {
        const text = draft.trim();
        if (!text || !chat) return;
        setDraft('');
        setMessages((m) => [...m, { me: true, text }]); // otimista
        if (!isReal) return; // conversa demo: só otimista
        setSending(true);
        try {
            await socialService.conversas.enviar({ destinatario_id: chat.contatoId, mensagem: text });
        } catch { /* mantém a mensagem otimista */ } finally {
            setSending(false);
        }
    };

    return (
        <AppShell rightRail={null}>
            <div className="flex gap-4 h-[calc(100vh-6.5rem)]">
                {/* Lista de conversas */}
                <div className="w-full max-w-xs shrink-0 bg-white rounded-2xl border border-gray-100 shadow-sm flex flex-col">
                    <div className="p-4 border-b border-gray-100">
                        <h1 className="text-lg font-bold text-gray-900 mb-3">Conversas</h1>
                        <div className="relative">
                            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                            <input placeholder="Pesquisar" className="w-full bg-[#F3F4F6] rounded-full py-2 pl-9 pr-3 text-sm outline-none" />
                        </div>
                    </div>
                    <div className="flex-1 overflow-y-auto">
                        {chats.map((c, i) => (
                            <button
                                key={c.contatoId}
                                onClick={() => setActive(i)}
                                className={`w-full flex items-center gap-3 p-3 text-left transition-colors ${i === active ? 'bg-[#407BFF]/5' : 'hover:bg-gray-50'}`}
                            >
                                <Avatar name={c.name} size={44} />
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-semibold text-gray-900 truncate">{c.name}</p>
                                    <p className="text-xs text-gray-400 truncate">{c.last}</p>
                                </div>
                                <div className="flex flex-col items-end gap-1">
                                    <span className="text-[10px] text-gray-400">{c.time}</span>
                                    {c.unread > 0 && <span className="bg-[#407BFF] text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center">{c.unread}</span>}
                                </div>
                            </button>
                        ))}
                    </div>
                </div>

                {/* Thread */}
                <div className="flex-1 bg-white rounded-2xl border border-gray-100 shadow-sm flex flex-col min-w-0">
                    <div className="flex items-center gap-3 p-4 border-b border-gray-100">
                        <Avatar name={chat?.name ?? ''} size={40} />
                        <div className="flex-1">
                            <p className="text-sm font-bold text-gray-900">{chat?.name ?? 'Conversa'}</p>
                            <p className="text-xs text-emerald-500">online</p>
                        </div>
                        <button className="text-gray-500 hover:text-[#407BFF] p-2"><Phone size={18} /></button>
                        <button onClick={() => setInCall(true)} className="text-gray-500 hover:text-[#407BFF] p-2"><Video size={18} /></button>
                        <button className="text-gray-500 hover:text-[#407BFF] p-2"><MoreHorizontal size={18} /></button>
                    </div>

                    <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-3 bg-gray-50/50">
                        {messages.length === 0 && (
                            <p className="text-center text-xs text-gray-400 mt-6">Nenhuma mensagem ainda. Diga olá! 👋</p>
                        )}
                        {messages.map((m, i) => (
                            <div key={i} className={`max-w-[70%] px-4 py-2.5 rounded-2xl text-sm ${m.me ? 'self-end bg-[#407BFF] text-white rounded-br-md' : 'self-start bg-white border border-gray-100 text-gray-700 rounded-bl-md'}`}>
                                {m.text}
                            </div>
                        ))}
                    </div>

                    <div className="p-3 border-t border-gray-100 flex items-center gap-2">
                        <input
                            value={draft}
                            onChange={(e) => setDraft(e.target.value)}
                            onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage(); } }}
                            placeholder="Escreva uma mensagem..."
                            className="flex-1 bg-[#F3F4F6] rounded-full py-2.5 px-4 text-sm outline-none"
                        />
                        <button
                            onClick={sendMessage}
                            disabled={!draft.trim() || sending}
                            className="w-10 h-10 rounded-full bg-[#407BFF] text-white flex items-center justify-center hover:bg-blue-600 disabled:bg-gray-200 disabled:text-gray-400"
                        >
                            <Send size={18} />
                        </button>
                    </div>
                </div>
            </div>

            {/* Chamada de vídeo */}
            {inCall && <VideoCallOverlay name={chat?.name ?? ''} onEnd={() => setInCall(false)} />}
        </AppShell>
    );
}

function VideoCallOverlay({ name, onEnd }: { name: string; onEnd: () => void }) {
    const [muted, setMuted] = useState(false);
    return (
        <div className="fixed inset-0 z-50 bg-gray-900 flex flex-col items-center justify-center">
            <button onClick={onEnd} className="absolute top-6 right-6 text-white/70 hover:text-white"><X size={24} /></button>

            {/* Vídeo remoto */}
            <div className="flex-1 w-full flex items-center justify-center">
                <div className="text-center">
                    <Avatar name={name} size={120} />
                    <p className="text-white font-bold text-lg mt-4">{name}</p>
                    <p className="text-white/60 text-sm">Chamando…</p>
                </div>
            </div>

            {/* Vídeo local (PiP) */}
            <div className="absolute bottom-28 right-6 w-32 h-44 rounded-xl bg-gray-700 border border-white/10" />

            {/* Controles */}
            <div className="pb-10 flex items-center gap-5">
                <button onClick={() => setMuted((v) => !v)} className="w-14 h-14 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center">
                    {muted ? <MicOff size={22} /> : <Mic size={22} />}
                </button>
                <button onClick={onEnd} className="w-16 h-16 rounded-full bg-red-500 hover:bg-red-600 text-white flex items-center justify-center">
                    <PhoneOff size={26} />
                </button>
                <button className="w-14 h-14 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center">
                    <Video size={22} />
                </button>
            </div>
        </div>
    );
}
