import { useState } from 'react';
import { Search, ChevronDown, BadgeCheck, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { AppShell } from '../../components/layout/AppShell';
import { PageHeader } from '../../components/layout/PageHeader';
import { Avatar } from '../../components/ui/Avatar';

type Status = 'Concluído' | 'Cancelado' | 'Reagendado';
interface Item { nome: string; tipo: string; status: Status }

const GRUPOS: { data: string; itens: Item[] }[] = [
    { data: 'Quarta, 23 de Abril', itens: [{ nome: 'Dra. Maria Glenda', tipo: 'Consulta Geral', status: 'Concluído' }] },
    { data: 'Segunda, 21 de Abril', itens: [
        { nome: 'Dra. Maria Glenda', tipo: 'Consulta Geral', status: 'Cancelado' },
        { nome: 'Clínica Mais Saúde', tipo: 'Raio-X e Hemograma', status: 'Concluído' },
    ] },
    { data: 'Sexta, 18 de Abril', itens: [
        { nome: 'Dra. Maria Glenda', tipo: 'Consulta Geral', status: 'Reagendado' },
        { nome: 'Dra. Maria Glenda', tipo: 'Consulta Geral', status: 'Cancelado' },
    ] },
];

const BADGE: Record<Status, string> = {
    'Concluído': 'bg-emerald-50 text-emerald-600',
    'Cancelado': 'bg-rose-50 text-rose-500',
    'Reagendado': 'bg-amber-50 text-amber-600',
};

export function HistoricoAtendimentos() {
    const navigate = useNavigate();
    const [busca, setBusca] = useState('');

    return (
        <AppShell>
            <div className="max-w-3xl mx-auto">
                <PageHeader title="Histórico de Atendimento" to="/minha-saude" />

                {/* Busca */}
                <div className="flex items-center gap-2 bg-[#F3F4F6] rounded-xl px-4 h-12 mb-3">
                    <Search size={18} className="text-gray-400" />
                    <input value={busca} onChange={(e) => setBusca(e.target.value)} placeholder="Busque por profissional, tipo de atendimento..." className="flex-1 bg-transparent text-sm text-gray-800 outline-none placeholder:text-gray-400" />
                    {busca && <button onClick={() => setBusca('')}><X size={16} className="text-gray-400" /></button>}
                </div>

                {/* Filtros */}
                <div className="flex gap-2 mb-5">
                    <Filtro label="Todos os Atendimentos" />
                    <Filtro label="De recentes a mais antigos" />
                </div>

                {/* Grupos */}
                <div className="flex flex-col gap-4">
                    {GRUPOS.map((g) => (
                        <div key={g.data}>
                            <p className="text-xs text-gray-400 mb-2">{g.data}</p>
                            <div className="flex flex-col gap-2">
                                {g.itens.map((it, i) => (
                                    <button
                                        key={i}
                                        onClick={() => navigate('/minha-saude/historico/1')}
                                        className="w-full bg-white rounded-2xl border border-gray-100 shadow-sm px-4 py-4 text-left hover:border-[#407BFF]/40 transition-colors"
                                    >
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-2.5">
                                                <Avatar name={it.nome} size={36} />
                                                <span className="text-sm font-bold text-gray-900 flex items-center gap-1">{it.nome} <BadgeCheck size={14} className="text-[#407BFF]" /></span>
                                            </div>
                                            <span className={`text-[11px] font-bold px-2.5 py-1 rounded-full ${BADGE[it.status]}`}>{it.status}</span>
                                        </div>
                                        <p className="text-sm font-bold text-gray-900 mt-3">{it.tipo}</p>
                                    </button>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </AppShell>
    );
}

function Filtro({ label }: { label: string }) {
    return (
        <button className="flex items-center gap-1.5 text-xs font-semibold text-gray-500 bg-gray-100 rounded-lg px-3 py-1.5 hover:bg-gray-200 transition-colors">
            {label} <ChevronDown size={13} />
        </button>
    );
}
