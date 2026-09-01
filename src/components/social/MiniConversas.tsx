import { useState } from 'react';
import {
    MessageCircle, ChevronDown, Maximize2, Search, ChevronLeft,
    BadgeCheck, Paperclip, Send, PhoneIncoming, PhoneOff, MessageSquareText,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Avatar } from '../ui/Avatar';

type Tab = 'Principal' | 'Arquivados' | 'Solicitações';

interface Conversation {
    name: string;
    verified?: boolean;
    last: string;
    time: string;
    unread?: number;
}

const PRINCIPAL: Conversation[] = [
    { name: 'Dra. Maria Glenda', verified: true, last: 'Vou precisar apenas do seu cpf...', time: '7:21' },
    { name: 'Dr. Marcos Toledo', verified: true, last: 'Perfeito, até lá! 😊', time: 'Ontem' },
    { name: 'Luana Paiva', verified: true, last: 'Obrigada, doutor! 🙏', time: 'Ter' },
];

const SOLICITACOES: Conversation[] = [
    { name: 'Joana Pinha', verified: true, last: 'Olá, tudo bem? Sou...', time: 'Há 17 dias', unread: 2 },
];

type Msg =
    | { type: 'day'; text: string }
    | { type: 'out' | 'in'; text: string; time: string }
    | { type: 'call-in' | 'call-end'; text: string; time: string };

const MESSAGES: Msg[] = [
    { type: 'day', text: 'Hoje' },
    { type: 'out', text: 'Você tem disponibilidade para atender hj às 17hrs', time: '7:10' },
    { type: 'call-in', text: 'Chamada Recebida', time: '17:00' },
    { type: 'call-end', text: 'Chamada Finalizada', time: '17:00' },
    { type: 'in', text: 'Tenho sim', time: '7:21' },
    { type: 'in', text: 'Vou precisar apenas do seu cpf para fazer o cadastro', time: '7:21' },
];

export function MiniConversas({ open, onClose }: { open: boolean; onClose: () => void }) {
    const navigate = useNavigate();
    const [tab, setTab] = useState<Tab>('Principal');
    const [chat, setChat] = useState<Conversation | null>(null);

    if (!open) return null;

    const list = tab === 'Principal' ? PRINCIPAL : tab === 'Solicitações' ? SOLICITACOES : [];

    return (
        <div className="fixed top-[4.25rem] right-4 z-[60] w-[340px] max-w-[calc(100vw-2rem)] bg-white rounded-2xl shadow-2xl border border-gray-100 flex flex-col overflow-hidden" style={{ maxHeight: 'calc(100vh - 5.5rem)' }}>
            {/* Cabeçalho */}
            <div className="flex items-center gap-2 px-4 py-3 border-b border-gray-100">
                <span className="relative">
                    <MessageCircle size={22} className="text-gray-700" />
                    <span className="absolute -top-1.5 -right-1.5 bg-red-500 text-white text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center">3</span>
                </span>
                <h3 className="text-lg font-bold text-gray-800 flex-1">Conversas</h3>
                <button onClick={() => { onClose(); navigate('/conversas'); }} className="text-gray-400 hover:text-gray-600" title="Expandir">
                    <Maximize2 size={18} />
                </button>
                <button onClick={onClose} className="text-gray-400 hover:text-gray-600" title="Fechar">
                    <ChevronDown size={20} />
                </button>
            </div>

            {chat ? (
                <ThreadView chat={chat} onBack={() => setChat(null)} />
            ) : (
                <>
                    {/* Busca */}
                    <div className="p-3">
                        <div className="relative">
                            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                            <input placeholder="busque por contatos, mensagens..." className="w-full bg-[#F3F4F6] rounded-full py-2.5 pl-9 pr-3 text-sm outline-none" />
                        </div>
                    </div>

                    {/* Abas */}
                    <div className="flex gap-2 px-3 pb-2">
                        {(['Principal', 'Arquivados', 'Solicitações'] as Tab[]).map((t) => (
                            <button
                                key={t}
                                onClick={() => setTab(t)}
                                className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-colors ${tab === t ? 'bg-[#407BFF] text-white' : 'bg-gray-100 text-gray-500 hover:bg-gray-200'}`}
                            >
                                {t}
                            </button>
                        ))}
                    </div>

                    {/* Lista ou estado vazio */}
                    <div className="flex-1 overflow-y-auto">
                        {list.length === 0 ? (
                            <EmptyState />
                        ) : (
                            list.map((c) => (
                                <button key={c.name} onClick={() => setChat(c)} className="w-full flex items-center gap-3 px-3 py-2.5 hover:bg-gray-50 transition-colors text-left">
                                    <Avatar name={c.name} size={44} />
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-bold text-gray-900 flex items-center gap-1 truncate">
                                            {c.name} {c.verified && <BadgeCheck size={13} className="text-emerald-500 shrink-0" />}
                                        </p>
                                        <p className="text-xs text-gray-400 truncate">{c.last}</p>
                                        <p className="text-[10px] text-gray-400">{c.time}</p>
                                    </div>
                                    {c.unread && <span className="bg-[#407BFF] text-white text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center shrink-0">{c.unread}</span>}
                                </button>
                            ))
                        )}
                    </div>
                </>
            )}
        </div>
    );
}

function EmptyState() {
    return (
        <div className="flex flex-col items-center text-center px-6 py-10">
            <div className="w-full h-32 rounded-xl bg-[#407BFF]/5 flex items-center justify-center mb-4">
                <MessageSquareText size={44} className="text-[#407BFF]" />
            </div>
            <h4 className="text-sm font-bold text-gray-900">Vamos iniciar uma conversa?</h4>
            <p className="text-xs text-gray-500 mt-1 leading-relaxed">
                Este é um lugar reservado para trocas significativas sobre sua saúde e se conectar com outras pessoas.
            </p>
        </div>
    );
}

function ThreadView({ chat, onBack }: { chat: Conversation; onBack: () => void }) {
    return (
        <div className="flex flex-col flex-1 min-h-0">
            {/* Cabeçalho da conversa */}
            <div className="flex items-center gap-2 px-3 py-2.5 border-b border-gray-100">
                <button onClick={onBack} className="text-gray-500 hover:text-gray-700"><ChevronLeft size={18} /></button>
                <Avatar name={chat.name} size={32} />
                <p className="text-sm font-bold text-gray-900 flex items-center gap-1 flex-1 truncate">
                    {chat.name} {chat.verified && <BadgeCheck size={13} className="text-emerald-500 shrink-0" />}
                </p>
                {/* Toggle decorativo */}
                <span className="w-9 h-5 rounded-full bg-gray-300 p-0.5 flex">
                    <span className="w-4 h-4 rounded-full bg-white translate-x-4 transition-transform" />
                </span>
            </div>

            {/* Mensagens */}
            <div className="flex-1 overflow-y-auto px-3 py-3 flex flex-col gap-2 bg-gray-50/60">
                {MESSAGES.map((m, i) => {
                    if (m.type === 'day') return <div key={i} className="text-center text-[11px] text-gray-400 my-1">{m.text}</div>;
                    if (m.type === 'call-in') return (
                        <div key={i} className="self-stretch bg-emerald-500 text-white rounded-xl px-3 py-2.5 flex items-center justify-between text-sm font-semibold">
                            <span className="flex items-center gap-2"><PhoneIncoming size={16} /> {m.text}</span>
                            <span className="text-xs font-normal opacity-90">{m.time}</span>
                        </div>
                    );
                    if (m.type === 'call-end') return (
                        <div key={i} className="self-stretch bg-rose-400 text-white rounded-xl px-3 py-2.5 flex items-center justify-between text-sm font-semibold">
                            <span className="flex items-center gap-2"><PhoneOff size={16} /> {m.text}</span>
                            <span className="text-xs font-normal opacity-90">{m.time}</span>
                        </div>
                    );
                    const mine = m.type === 'out';
                    return (
                        <div key={i} className={`max-w-[80%] px-3 py-2 rounded-2xl text-sm ${mine ? 'self-end bg-[#407BFF] text-white rounded-br-md' : 'self-start bg-white border border-gray-100 text-gray-700 rounded-bl-md'}`}>
                            {m.text}
                            <span className={`block text-[10px] mt-0.5 ${mine ? 'text-white/70 text-right' : 'text-gray-400'}`}>{m.time}</span>
                        </div>
                    );
                })}
            </div>

            {/* Input */}
            <div className="flex items-center gap-2 p-2.5 border-t border-gray-100">
                <button className="text-gray-400 hover:text-[#407BFF] p-1"><Paperclip size={18} /></button>
                <input placeholder="Digite sua mensagem..." className="flex-1 bg-[#F3F4F6] rounded-full py-2 px-3 text-sm outline-none" />
                <button className="w-9 h-9 rounded-full bg-[#407BFF] text-white flex items-center justify-center hover:bg-blue-600"><Send size={16} /></button>
            </div>
        </div>
    );
}
