import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MoreHorizontal, Info, Clock, Plus, CalendarDays, Settings2, Check, X, Star } from 'lucide-react';
import { AppShell } from '../../components/layout/AppShell';
import { PageHeader } from '../../components/layout/PageHeader';
import { Avatar } from '../../components/ui/Avatar';

const DAYS = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sab'];
const ATEND_HOJE = [
    { nome: 'Carlos Magno', tipo: 'Consulta Geral', hora: '9:30 às 10:00', badge: 'Inicia em 3 min' },
    { nome: 'Carlos Magno', tipo: 'Consulta Geral', hora: '10:30 às 11:00' },
    { nome: 'Carlos Magno', tipo: 'Consulta Geral', hora: '16:30 às 17:00' },
];

export function DiasHorariosAtendimento() {
    const navigate = useNavigate();
    const [selected, setSelected] = useState<Set<number>>(new Set([1, 2, 3, 4, 5]));
    const [active, setActive] = useState(1);
    const [ranges, setRanges] = useState([{ de: '08:00', ate: '12:00' }, { de: '14:00', ate: '18:00' }]);
    const setRange = (i: number, k: 'de' | 'ate', v: string) => setRanges((r) => r.map((x, idx) => (idx === i ? { ...x, [k]: v } : x)));
    const toggleDay = (i: number) => { setActive(i); setSelected((p) => { const n = new Set(p); n.has(i) ? n.delete(i) : n.add(i); return n; }); };

    return (
        <AppShell rightRail={null}>
            <div className="max-w-6xl mx-auto flex flex-col min-h-[calc(100vh-8rem)]">
                <PageHeader
                    title="Dias e Horários do Atendimento"
                    to="/area-profissional"
                    right={<button className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-500"><MoreHorizontal size={16} /></button>}
                />

                <div className="flex-1 grid lg:grid-cols-[1fr_360px] gap-4 pt-2">
                    {/* Coluna esquerda */}
                    <div className="flex flex-col gap-5">
                        <div className="bg-white rounded-xl border border-gray-100 px-4 py-4 flex items-center gap-3">
                            <Avatar name="Clínica Patinhas" size={40} />
                            <div><p className="text-[11px] text-gray-400">Instituição</p><p className="text-sm font-bold text-gray-900">Clínica Patinhas</p></div>
                        </div>

                        <div>
                            <div className="flex items-center gap-1.5 mb-2">
                                <span className="text-sm font-bold text-gray-900">Selecione os Dias de Atendimento</span>
                                <Info size={14} className="text-gray-300" />
                            </div>
                            <div className="flex gap-1.5">
                                {DAYS.map((d, i) => {
                                    const isSel = selected.has(i); const isAct = active === i;
                                    return (
                                        <button key={d} onClick={() => toggleDay(i)} className={`w-12 py-1.5 rounded-lg text-xs font-bold transition-colors ${isSel ? (isAct ? 'bg-[#407BFF] text-white' : 'bg-[#407BFF]/15 text-[#407BFF]') : 'bg-gray-100 text-gray-400'}`}>{d}</button>
                                    );
                                })}
                            </div>
                        </div>

                        <div>
                            <span className="text-sm font-bold text-gray-900">Selecione os Horários de Atendimento</span>
                            <div className="flex flex-col gap-3 mt-2">
                                {ranges.map((r, i) => (
                                    <div key={i} className="flex items-center gap-3">
                                        <TimeField value={r.de} onChange={(v) => setRange(i, 'de', v)} />
                                        <span className="text-gray-400">-</span>
                                        <TimeField value={r.ate} onChange={(v) => setRange(i, 'ate', v)} />
                                    </div>
                                ))}
                                <button onClick={() => setRanges((r) => [...r, { de: '08:00', ate: '12:00' }])} className="flex items-center gap-1.5 text-sm font-bold text-[#407BFF] self-start">
                                    Adicionar Horário <Plus size={16} />
                                </button>
                            </div>
                        </div>

                        <button onClick={() => navigate('/area-profissional')} className="bg-white rounded-xl border border-gray-100 px-4 py-4 flex items-center justify-between text-left hover:border-[#407BFF]/40 transition-colors">
                            <div>
                                <p className="text-sm font-bold text-gray-900">Painel de Recursos</p>
                                <p className="text-xs text-gray-400">Ferramentas e Recursos exclusivos para profissionais.</p>
                            </div>
                            <span className="w-6 h-6 rounded-full bg-[#d86161] text-white text-[10px] font-bold flex items-center justify-center">3</span>
                        </button>

                        <div>
                            <span className="text-sm font-bold text-gray-900">Atendimentos Hoje</span>
                            <div className="grid grid-cols-3 gap-3 mt-2">
                                <MiniStat value="2" label="Atendidos" icon={<Check size={12} className="text-emerald-500" />} />
                                <MiniStat value="5" label="Agendados" icon={<CalendarDays size={12} className="text-[#407BFF]" />} />
                                <MiniStat value="1" label="Cancelados" icon={<X size={12} className="text-rose-500" />} />
                            </div>
                        </div>
                    </div>

                    {/* Coluna direita — painel do profissional */}
                    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 flex flex-col gap-4 h-fit">
                        <div>
                            <p className="text-base font-bold text-gray-900">Olá, Dra. Maria Glenda.</p>
                            <p className="text-xs text-gray-500 mt-1">Vinculado a 2 Instituições</p>
                            <button className="text-xs font-semibold text-[#407BFF] underline">Ver vínculos ›</button>
                        </div>
                        <div className="grid grid-cols-3 gap-2">
                            <MiniStat value="2.000" label="Atendimentos" />
                            <MiniStat value="1.253" label="Pacientes" />
                            <MiniStat value="4.95" label="Avaliações" icon={<Star size={12} className="fill-amber-400 text-amber-400" />} />
                        </div>
                        <div className="grid grid-cols-2 gap-2">
                            <button onClick={() => navigate('/area-profissional/agenda')} className="bg-violet-500 hover:bg-violet-600 text-white rounded-xl px-3 py-4 flex flex-col items-start gap-2 transition-colors">
                                <CalendarDays size={18} /><span className="text-xs font-bold text-left">Agenda de Atendimentos</span>
                            </button>
                            <button className="bg-[#01AEA4] hover:bg-teal-600 text-white rounded-xl px-3 py-4 flex flex-col items-start gap-2 transition-colors">
                                <Settings2 size={18} /><span className="text-xs font-bold text-left">Serviços que Ofereço</span>
                            </button>
                        </div>
                        <div className="flex flex-col gap-2">
                            {ATEND_HOJE.map((a, i) => (
                                <div key={i} className="relative border border-gray-100 rounded-xl px-3 py-2.5">
                                    {a.badge && <span className="absolute -top-2 right-3 bg-emerald-500 text-white text-[9px] font-bold px-2 py-0.5 rounded-full">{a.badge}</span>}
                                    <div className="flex items-center justify-between">
                                        <div><p className="text-xs font-bold text-gray-900">{a.nome}</p><p className="text-[11px] text-gray-400">{a.tipo}</p></div>
                                        <span className="text-[11px] text-gray-500"><span className="text-gray-400">Hoje</span> {a.hora}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="flex justify-end border-t border-gray-100 pt-4 mt-4">
                    <button onClick={() => navigate('/area-profissional')} className="bg-[#407BFF] hover:bg-blue-600 text-white text-sm font-bold px-6 py-2.5 rounded-full transition-colors">
                        Confirmar Horários
                    </button>
                </div>
            </div>
        </AppShell>
    );
}

function TimeField({ value, onChange }: { value: string; onChange: (v: string) => void }) {
    return (
        <div className="flex-1 flex items-center bg-[#F3F4F6] rounded-lg px-3 h-11">
            <input value={value} onChange={(e) => onChange(e.target.value)} className="flex-1 bg-transparent text-sm text-gray-800 outline-none" />
            <Clock size={16} className="text-gray-400" />
        </div>
    );
}

function MiniStat({ value, label, icon }: { value: string; label: string; icon?: React.ReactNode }) {
    return (
        <div className="bg-[#F9FAFB] rounded-xl p-3 text-center">
            <p className="text-base font-bold text-gray-900 flex items-center justify-center gap-1">{icon}{value}</p>
            <p className="text-[10px] text-gray-400 mt-0.5">{label}</p>
        </div>
    );
}
