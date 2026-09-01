import { useState } from 'react';
import { ChevronLeft, Plus } from 'lucide-react';
import { AppShell } from '../../components/layout/AppShell';
import { FlashsRow } from '../../components/social/FlashsRow';
import { PostCard } from '../../components/social/PostCard';
import { Avatar } from '../../components/ui/Avatar';
import { feedPosts } from '../../data/social';
import { socialService } from '../../services/socialService';
import { useApiData } from '../../hooks/useApiData';
import { timeAgo } from '../../lib/format';

type Notif = {
    name: string;
    text: string;
    time: string;
    action?: 'follow' | 'mention';
    highlight?: boolean;
};

const TODAY: Notif[] = [
    { name: 'iSaúde', text: 'Consulta agendada para hoje. A consulta com a Dra. Maria Glenda...', time: 'Há 05 Minutos', highlight: true },
    { name: 'Nome de Usuário', text: 'curtiu sua publicação.', time: 'Há 05 Minutos' },
    { name: 'Nome de Usuário', text: 'curtiu sua publicação.', time: 'Há 05 Minutos' },
    { name: 'Nome de Usuário', text: 'curtiu sua publicação.', time: 'Há 05 Minutos' },
    { name: 'Nome de Usuário', text: 'curtiu sua publicação.', time: 'Há 05 Minutos' },
    { name: 'Nome de Usuário', text: 'começou a seguir você.', time: 'Há 05 Minutos', action: 'follow' },
    { name: 'Nome de Usuário', text: 'mencionou você em um comentário.', time: 'Há 05 Minutos', action: 'mention' },
];

const LAST_7: Notif[] = [
    { name: 'Nome de Usuário', text: 'quer seguir você.', time: 'Há 05 Minutos', action: 'follow' },
    { name: 'Nome de Usuário', text: 'que você conhece está no iSaúde.', time: 'Há 05 Minutos' },
    { name: 'Nome de Usuário', text: 'comentou na sua publicação.', time: 'Há 05 Minutos' },
    { name: 'Nome de Usuário', text: 'comentou na sua publicação.', time: 'Há 05 Minutos' },
    { name: 'iSaúde', text: 'Consulta agendada. Você agendou uma consulta para dia...', time: 'Há 05 Minutos', highlight: true },
];

const TABS = ['Principal', 'Arquivadas', 'Solicitações'] as const;

interface RawNotif {
    id_notificacao: number;
    tipo_notificacao?: string;
    created_at: string;
}

function mapNotif(n: RawNotif): Notif {
    const tipo = (n.tipo_notificacao || '').toLowerCase();
    let text = 'interagiu com você.';
    let name = 'Nome de Usuário';
    let action: Notif['action'];
    let highlight = false;
    if (tipo.includes('curt')) text = 'curtiu sua publicação.';
    else if (tipo.includes('coment')) text = 'comentou na sua publicação.';
    else if (tipo.includes('segu')) { text = 'começou a seguir você.'; action = 'follow'; }
    else if (tipo.includes('menc')) text = 'mencionou você em um comentário.';
    else if (tipo.includes('consult') || tipo.includes('agend')) { text = 'Consulta agendada.'; highlight = true; name = 'iSaúde'; }
    return { name, text, time: timeAgo(n.created_at), action, highlight };
}

async function fetchNotifs(): Promise<{ today: Notif[]; last7: Notif[] }> {
    const raw = await socialService.notificacoes.list<RawNotif[] | { results: RawNotif[] }>();
    const list = Array.isArray(raw) ? raw : raw?.results ?? [];
    const dayMs = 24 * 60 * 60 * 1000;
    const today: Notif[] = [];
    const last7: Notif[] = [];
    for (const n of list) {
        const isToday = Date.now() - new Date(n.created_at).getTime() < dayMs;
        (isToday ? today : last7).push(mapNotif(n));
    }
    return { today, last7 };
}

export function Notificacoes() {
    const [tab, setTab] = useState<(typeof TABS)[number]>('Principal');
    const { data: notifs } = useApiData(fetchNotifs, { today: TODAY, last7: LAST_7 }, []);

    return (
        <AppShell rightRail={null}>
            <div className="flex gap-6">
                {/* Lista de notificações */}
                <div className="w-full max-w-sm shrink-0">
                    <div className="flex items-center gap-2 mb-4">
                        <ChevronLeft size={20} className="text-gray-700" />
                        <h1 className="text-lg font-bold text-gray-900">Notificações</h1>
                    </div>

                    {/* Abas */}
                    <div className="flex gap-2 mb-5">
                        {TABS.map((t) => (
                            <button
                                key={t}
                                onClick={() => setTab(t)}
                                className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-colors ${
                                    tab === t ? 'bg-[#407BFF] text-white' : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                                }`}
                            >
                                {t}
                            </button>
                        ))}
                    </div>

                    <NotifGroup title="Hoje" items={notifs.today} />
                    <NotifGroup title="7 dias" items={notifs.last7} />
                </div>

                {/* Painel de conteúdo */}
                <div className="hidden xl:flex flex-1 flex-col gap-4 max-w-xl">
                    <FlashsRow />
                    <PostCard post={feedPosts[0]} />
                </div>
            </div>

            {/* FAB */}
            <button className="fixed bottom-6 left-6 w-12 h-12 rounded-full bg-[#407BFF] hover:bg-blue-600 text-white shadow-lg flex items-center justify-center transition-colors">
                <Plus size={24} />
            </button>
        </AppShell>
    );
}

function NotifGroup({ title, items }: { title: string; items: Notif[] }) {
    return (
        <div className="mb-6">
            <h2 className="text-xs font-bold text-gray-400 uppercase mb-2">{title}</h2>
            <div className="flex flex-col">
                {items.map((n, i) => (
                    <div key={i} className={`flex items-center gap-3 py-2.5 px-2 rounded-lg ${n.highlight ? 'bg-[#407BFF]/5' : ''}`}>
                        <Avatar name={n.name} size={40} />
                        <p className="flex-1 text-sm text-gray-700 leading-snug">
                            <span className="font-bold text-gray-900">{n.name}</span> {n.text}
                            <span className="block text-[11px] text-gray-400 mt-0.5">{n.time}</span>
                        </p>
                        {n.action === 'follow' && (
                            <div className="flex gap-1.5">
                                <button className="text-xs font-bold text-white bg-[#407BFF] hover:bg-blue-600 px-3 py-1.5 rounded-full">Seguir</button>
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}
