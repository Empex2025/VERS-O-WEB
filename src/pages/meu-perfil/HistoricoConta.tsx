import { ChevronDown, ChevronRight, Mail, FileText, Phone, Lock, UserRound, AtSign, ImageIcon } from 'lucide-react';
import { AppShell } from '../../components/layout/AppShell';
import { PageHeader } from '../../components/layout/PageHeader';
import { profileService } from '../../services/profileService';
import { useApiData } from '../../hooks/useApiData';
import { timeAgo } from '../../lib/format';

type Entry = { icon: typeof Mail; title: string; text: string; time: string };

interface RawHist { tipo_evento?: string; descricao?: string; created_at: string }

function iconFor(tipo?: string): { icon: typeof Mail; title: string } {
    const t = (tipo || '').toLowerCase();
    if (t.includes('email')) return { icon: Mail, title: 'Email' };
    if (t.includes('bio')) return { icon: FileText, title: 'Biografia' };
    if (t.includes('telefone') || t.includes('phone')) return { icon: Phone, title: 'Telefone' };
    if (t.includes('privac')) return { icon: Lock, title: 'Privacidade' };
    if (t.includes('username') || t.includes('usuário')) return { icon: AtSign, title: 'Nome de Usuário' };
    if (t.includes('nome')) return { icon: UserRound, title: 'Nome' };
    if (t.includes('foto')) return { icon: ImageIcon, title: 'Foto de Perfil' };
    return { icon: FileText, title: tipo || 'Alteração' };
}

async function fetchHistorico(): Promise<{ today: Entry[]; last7: Entry[] }> {
    const raw = await profileService.historicoConta.list<RawHist[] | { results: RawHist[] }>();
    const list = Array.isArray(raw) ? raw : raw?.results ?? [];
    const dayMs = 24 * 60 * 60 * 1000;
    const today: Entry[] = [];
    const last7: Entry[] = [];
    for (const h of list) {
        const { icon, title } = iconFor(h.tipo_evento);
        const entry: Entry = { icon, title, text: h.descricao || '', time: timeAgo(h.created_at) };
        (Date.now() - new Date(h.created_at).getTime() < dayMs ? today : last7).push(entry);
    }
    return { today, last7 };
}

const HOJE: Entry[] = [
    { icon: Mail, title: 'Email', text: 'Você alterou seu email para seuemail@exemplo.com', time: 'Há 05 Minutos' },
    { icon: FileText, title: 'Biografia', text: 'Você alterou sua biografia para "Momento de cuidar de você..."', time: 'Há 40 Minutos' },
    { icon: FileText, title: 'Biografia', text: 'Você alterou sua biografia para "Momento de bem-estar..."', time: 'Há 1 hora' },
    { icon: ImageIcon, title: 'Foto de Perfil', text: 'Você atualizou sua foto de perfil', time: 'Há 2 horas' },
];

const SETE_DIAS: Entry[] = [
    { icon: Phone, title: 'Telefone', text: 'Você alterou seu telefone para (00) 94002-8922', time: 'Há 3 dias' },
    { icon: Lock, title: 'Privacidade', text: 'Você tornou sua conta privada', time: 'Há 4 dias' },
    { icon: UserRound, title: 'Nome', text: 'Você alterou seu nome para Carlos Magno', time: 'Há 5 dias' },
    { icon: AtSign, title: 'Nome de Usuário', text: 'Você alterou seu nome de usuário para @carlos.magno', time: 'Há 6 dias' },
];

const FILTERS = ['De recentes a mais antigos', 'Todas as datas', 'Tipo de alteração'];

export function HistoricoConta() {
    const { data: hist } = useApiData(fetchHistorico, { today: HOJE, last7: SETE_DIAS }, []);
    return (
        <AppShell rightRail={null}>
            <div className="max-w-2xl mx-auto">
                <PageHeader title="Histórico da Conta" to="/meu-perfil/opcoes" />

                {/* Filtros */}
                <div className="flex flex-wrap gap-2 mb-5">
                    {FILTERS.map((f) => (
                        <button key={f} className="flex items-center gap-1 text-xs font-semibold text-gray-600 bg-white border border-gray-200 rounded-lg px-3 py-2 hover:border-[#407BFF]">
                            {f} <ChevronDown size={14} className="text-gray-400" />
                        </button>
                    ))}
                </div>

                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-2">
                    <Group title="Hoje" items={hist.today} />
                    <Group title="7 dias" items={hist.last7} />
                </div>
            </div>
        </AppShell>
    );
}

function Group({ title, items }: { title: string; items: Entry[] }) {
    return (
        <div className="mb-2">
            <p className="text-xs font-bold text-gray-400 uppercase px-3 py-2">{title}</p>
            {items.map((e, i) => (
                <button key={i} className="w-full flex items-center gap-3 px-3 py-3 rounded-lg hover:bg-gray-50 transition-colors text-left">
                    <span className="w-9 h-9 rounded-full bg-[#407BFF]/10 text-[#407BFF] flex items-center justify-center shrink-0">
                        <e.icon size={17} />
                    </span>
                    <div className="flex-1 min-w-0">
                        <p className="text-sm font-bold text-gray-800">{e.title}</p>
                        <p className="text-xs text-gray-500 truncate">{e.text}</p>
                        <p className="text-[11px] text-gray-400 mt-0.5">{e.time}</p>
                    </div>
                    <ChevronRight size={16} className="text-gray-300 shrink-0" />
                </button>
            ))}
        </div>
    );
}
