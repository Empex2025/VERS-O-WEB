import { useMemo, useState } from 'react';
import { ChevronLeft, ChevronRight, ChevronDown } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { AppShell } from '../../components/layout/AppShell';
import { PageHeader } from '../../components/layout/PageHeader';

interface Atendimento { nome: string; tipo: string; inicio: string; fim: string }

const WEEKDAYS = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sab'];
const MESES = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'];

/** Dias do mês (visualizado) que possuem atendimentos — dá os "pontinhos" do calendário. */
const DIAS_COM_ATENDIMENTO = new Set([1, 2, 3, 4, 7, 8, 10, 11, 13, 14, 16, 17, 18, 21, 22, 23, 24, 25, 28, 29, 30, 31]);

function isoKey(y: number, m: number, d: number) {
    return `${y}-${String(m + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
}

const ATEND_DIA: Atendimento[] = [
    { nome: 'Carlos Magno de Souza', tipo: 'Consulta Geral', inicio: '8:30', fim: '9:00' },
    { nome: 'Carlos Magno de Souza', tipo: 'Consulta Geral', inicio: '9:30', fim: '10:00' },
    { nome: 'Carlos Magno de Souza', tipo: 'Consulta Geral', inicio: '16:30', fim: '17:00' },
];

export function AgendaAtendimentos() {
    const navigate = useNavigate();
    const now = new Date();
    const [view, setView] = useState({ y: now.getFullYear(), m: now.getMonth() });
    const [selected, setSelected] = useState(isoKey(now.getFullYear(), now.getMonth(), now.getDate()));
    const todayKey = isoKey(now.getFullYear(), now.getMonth(), now.getDate());

    const monthLabel = `${MESES[view.m]}, ${view.y}`;
    const firstWeekday = new Date(view.y, view.m, 1).getDay();
    const daysInMonth = new Date(view.y, view.m + 1, 0).getDate();

    const move = (delta: number) => setView((v) => {
        const d = new Date(v.y, v.m + delta, 1);
        return { y: d.getFullYear(), m: d.getMonth() };
    });

    const selDate = new Date(selected + 'T00:00:00');
    const DIAS_SEM = ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'];
    const selLabel = `${DIAS_SEM[selDate.getDay()]}, ${selDate.getDate()} de ${MESES[selDate.getMonth()]}`;
    const selDay = selDate.getDate();
    // Amostra: atendimentos aparecem nos dias marcados. Trocar por API depois.
    const doDia = useMemo(() => (DIAS_COM_ATENDIMENTO.has(selDay) ? ATEND_DIA : []), [selDay]);

    return (
        <AppShell rightRail={null}>
            <div className="max-w-6xl mx-auto">
                <PageHeader
                    title="Agenda de Atendimentos"
                    to="/area-profissional"
                    right={
                        <button className="flex items-center gap-1.5 text-sm font-semibold text-gray-500 bg-gray-100 rounded-lg px-3 py-1.5 hover:bg-gray-200 transition-colors">
                            Mês <ChevronDown size={15} />
                        </button>
                    }
                />

                <div className="grid lg:grid-cols-[1fr_360px] gap-5 pt-2 items-start">
                    {/* Calendário */}
                    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 sm:p-6">
                        <div className="flex items-center justify-between mb-5">
                            <button onClick={() => move(-1)} className="w-9 h-9 rounded-full bg-gray-100 text-gray-400 flex items-center justify-center hover:bg-gray-200 transition-colors">
                                <ChevronLeft size={18} />
                            </button>
                            <span className="text-base font-bold text-gray-900">{monthLabel}</span>
                            <button onClick={() => move(1)} className="w-9 h-9 rounded-full bg-[#407BFF] text-white flex items-center justify-center hover:bg-blue-600 transition-colors">
                                <ChevronRight size={18} />
                            </button>
                        </div>

                        <div className="grid grid-cols-7 gap-y-3 text-center">
                            {WEEKDAYS.map((w) => (
                                <span key={w} className="text-xs text-gray-400 font-semibold pb-1">{w}</span>
                            ))}
                            {Array.from({ length: firstWeekday }).map((_, i) => <span key={`e${i}`} />)}
                            {Array.from({ length: daysInMonth }).map((_, i) => {
                                const day = i + 1;
                                const key = isoKey(view.y, view.m, day);
                                const isSelected = key === selected;
                                const isToday = key === todayKey;
                                const hasAppt = DIAS_COM_ATENDIMENTO.has(day);
                                return (
                                    <button key={day} onClick={() => setSelected(key)} className="flex flex-col items-center gap-1 py-0.5">
                                        <span className={`w-10 h-10 rounded-xl flex items-center justify-center text-sm font-semibold transition-colors ${
                                            isSelected ? 'bg-[#407BFF] text-white' : isToday ? 'bg-gray-100 text-gray-900' : 'text-gray-800 hover:bg-gray-50'
                                        }`}>
                                            {day}
                                        </span>
                                        <span className={`w-1.5 h-1.5 rounded-full ${hasAppt ? (isSelected ? 'bg-[#407BFF]' : 'bg-emerald-500') : 'bg-transparent'}`} />
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    {/* Atendimentos no dia */}
                    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 sm:p-6">
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-base font-bold text-gray-900">Atendimentos no Dia</h2>
                            <span className="text-xs font-semibold text-[#407BFF]">{selLabel}</span>
                        </div>

                        {doDia.length === 0 ? (
                            <p className="text-sm text-gray-400 py-10 text-center">Nenhum atendimento neste dia.</p>
                        ) : (
                            <div className="flex flex-col gap-3">
                                {doDia.map((a, i) => (
                                    <button
                                        key={i}
                                        onClick={() => navigate('/area-profissional/atendimento/concluido')}
                                        className="w-full flex items-center justify-between bg-[#F9FAFB] rounded-xl px-4 py-4 text-left hover:bg-gray-100 transition-colors"
                                    >
                                        <div>
                                            <p className="text-sm font-bold text-gray-900">{a.nome}</p>
                                            <p className="text-xs text-gray-400 mt-0.5">{a.tipo}</p>
                                        </div>
                                        <span className="text-sm font-semibold text-gray-700 shrink-0 ml-3">{a.inicio} às {a.fim}</span>
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </AppShell>
    );
}
