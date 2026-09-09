import { useMemo, useState } from 'react';
import { ChevronLeft, ChevronRight, ChevronDown } from 'lucide-react';
import { AppShell } from '../../components/layout/AppShell';
import { PageHeader } from '../../components/layout/PageHeader';

interface Atendimento { nome: string; tipo: string; inicio: string; fim: string }

const WEEKDAYS = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sab'];

function isoKey(y: number, m: number, d: number) {
    return `${y}-${String(m + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
}

/** Amostra de atendimentos por dia (chave ISO). Trocar por API depois. */
function sampleAtendimentos(todayKey: string): Record<string, Atendimento[]> {
    return {
        [todayKey]: [
            { nome: 'Carlos Magno de Souza', tipo: 'Consulta Geral', inicio: '8:30', fim: '9:00' },
            { nome: 'Carlos Magno de Souza', tipo: 'Consulta Geral', inicio: '9:30', fim: '10:00' },
            { nome: 'Carlos Magno de Souza', tipo: 'Consulta Geral', inicio: '16:30', fim: '17:00' },
        ],
    };
}

export function AgendaAtendimentos() {
    const now = new Date();
    const [view, setView] = useState({ y: now.getFullYear(), m: now.getMonth() });
    const [selected, setSelected] = useState(isoKey(now.getFullYear(), now.getMonth(), now.getDate()));
    const todayKey = isoKey(now.getFullYear(), now.getMonth(), now.getDate());
    const byDay = useMemo(() => sampleAtendimentos(todayKey), [todayKey]);

    const monthLabel = new Date(view.y, view.m, 1).toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' })
        .replace(/^\w/, (c) => c.toUpperCase());
    const firstWeekday = new Date(view.y, view.m, 1).getDay();
    const daysInMonth = new Date(view.y, view.m + 1, 0).getDate();

    const move = (delta: number) => setView((v) => {
        const d = new Date(v.y, v.m + delta, 1);
        return { y: d.getFullYear(), m: d.getMonth() };
    });

    const selDate = new Date(selected + 'T00:00:00');
    const selLabel = selDate.toLocaleDateString('pt-BR', { weekday: 'long', day: 'numeric', month: 'long' })
        .replace(/^\w/, (c) => c.toUpperCase());
    const doDia = byDay[selected] ?? [];

    return (
        <AppShell rightRail={null}>
            <div className="max-w-5xl mx-auto">
                <PageHeader
                    title="Agenda de Atendimentos"
                    to="/area-profissional"
                    right={
                        <button className="flex items-center gap-1 text-xs font-semibold text-gray-500 bg-gray-100 rounded-lg px-3 py-1.5">
                            Mês <ChevronDown size={14} />
                        </button>
                    }
                />

                <div className="grid md:grid-cols-2 gap-4 pt-2">
                    {/* Calendário */}
                    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
                        <div className="flex items-center justify-between mb-4">
                            <button onClick={() => move(-1)} className="w-7 h-7 rounded-full bg-gray-100 text-gray-400 flex items-center justify-center hover:bg-gray-200">
                                <ChevronLeft size={16} />
                            </button>
                            <span className="text-sm font-bold text-gray-900">{monthLabel}</span>
                            <button onClick={() => move(1)} className="w-7 h-7 rounded-full bg-[#407BFF] text-white flex items-center justify-center hover:bg-blue-600">
                                <ChevronRight size={16} />
                            </button>
                        </div>

                        <div className="grid grid-cols-7 gap-y-2 text-center">
                            {WEEKDAYS.map((w) => (
                                <span key={w} className="text-[11px] text-gray-400 font-medium">{w}</span>
                            ))}
                            {Array.from({ length: firstWeekday }).map((_, i) => <span key={`e${i}`} />)}
                            {Array.from({ length: daysInMonth }).map((_, i) => {
                                const day = i + 1;
                                const key = isoKey(view.y, view.m, day);
                                const isSelected = key === selected;
                                const isToday = key === todayKey;
                                const hasAppt = (byDay[key]?.length ?? 0) > 0;
                                return (
                                    <button key={day} onClick={() => setSelected(key)} className="flex flex-col items-center gap-0.5 py-1">
                                        <span className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold transition-colors ${
                                            isSelected ? 'bg-[#407BFF] text-white' : isToday ? 'bg-gray-100 text-gray-700' : 'text-gray-700 hover:bg-gray-50'
                                        }`}>
                                            {day}
                                        </span>
                                        <span className={`w-1 h-1 rounded-full ${hasAppt ? 'bg-emerald-500' : 'bg-transparent'}`} />
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    {/* Atendimentos no dia */}
                    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
                        <div className="flex items-center justify-between mb-3">
                            <h2 className="text-sm font-bold text-gray-900">Atendimentos no Dia</h2>
                            <span className="text-xs text-gray-400">{selLabel}</span>
                        </div>

                        {doDia.length === 0 ? (
                            <p className="text-sm text-gray-400 py-10 text-center">Nenhum atendimento neste dia.</p>
                        ) : (
                            <div className="flex flex-col gap-2">
                                {doDia.map((a, i) => (
                                    <div key={i} className="flex items-center justify-between border border-gray-100 rounded-xl px-4 py-3">
                                        <div>
                                            <p className="text-sm font-bold text-gray-900">{a.nome}</p>
                                            <p className="text-xs text-gray-400">{a.tipo}</p>
                                        </div>
                                        <span className="text-xs font-semibold text-gray-600">{a.inicio} às {a.fim}</span>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </AppShell>
    );
}
