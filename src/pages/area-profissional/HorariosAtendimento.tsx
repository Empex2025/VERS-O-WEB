import { useState } from 'react';
import { Clock, Plus, Info } from 'lucide-react';
import { AppShell } from '../../components/layout/AppShell';
import { PageHeader } from '../../components/layout/PageHeader';

const DAYS = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sab'];
const FULL = ['Domingo', 'Segunda-Feira', 'Terça-Feira', 'Quarta-Feira', 'Quinta-Feira', 'Sexta-Feira', 'Sábado'];

export function HorariosAtendimento() {
    const [selected, setSelected] = useState<Set<number>>(new Set([1, 2, 3, 4, 5]));
    const [active, setActive] = useState(1);
    const [closed, setClosed] = useState(false);
    const [ranges, setRanges] = useState([{ de: '08:00', ate: '12:00' }, { de: '14:00', ate: '18:00' }]);

    const toggleDay = (i: number) => {
        setActive(i);
        setSelected((prev) => {
            const next = new Set(prev);
            next.has(i) ? next.delete(i) : next.add(i);
            return next;
        });
    };
    const setRange = (idx: number, key: 'de' | 'ate', value: string) =>
        setRanges((r) => r.map((x, i) => (i === idx ? { ...x, [key]: value } : x)));

    return (
        <AppShell rightRail={null}>
            <div className="max-w-4xl mx-auto">
                <PageHeader title="Horário de Atendimento" to="/area-profissional" />

                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 sm:p-6 flex flex-col gap-6">
                    {/* Dias */}
                    <div className="flex items-center justify-between gap-4">
                        <div className="flex items-center gap-1.5">
                            <span className="text-sm font-bold text-gray-900">Selecione os Dias de Atendimento</span>
                            <Info size={14} className="text-gray-300" />
                        </div>
                        <div className="flex gap-1.5">
                            {DAYS.map((d, i) => {
                                const isSel = selected.has(i);
                                const isActive = active === i;
                                return (
                                    <button
                                        key={d}
                                        onClick={() => toggleDay(i)}
                                        className={`w-12 py-1.5 rounded-lg text-xs font-bold transition-colors ${
                                            isSel
                                                ? isActive ? 'bg-[#407BFF] text-white' : 'bg-[#407BFF]/15 text-[#407BFF]'
                                                : 'bg-gray-100 text-gray-400'
                                        }`}
                                    >
                                        {d}
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    {/* Dia ativo + aberto/fechado */}
                    <div className="flex items-center justify-between border-t border-gray-100 pt-5">
                        <span className="text-sm font-bold text-gray-900">{FULL[active]}</span>
                        <div className="flex items-center gap-2">
                            <button
                                onClick={() => setClosed((v) => !v)}
                                className={`w-9 h-5 rounded-full p-0.5 transition-colors ${closed ? 'bg-gray-300' : 'bg-[#407BFF]'}`}
                            >
                                <span className={`block w-4 h-4 rounded-full bg-white transition-transform ${closed ? '' : 'translate-x-4'}`} />
                            </button>
                            <span className="text-sm text-gray-500">{closed ? 'Fechado' : 'Aberto'}</span>
                        </div>
                    </div>

                    {/* Faixas de horário */}
                    {!closed && (
                        <div className="flex flex-col gap-3 border-t border-gray-100 pt-5">
                            <span className="text-sm font-bold text-gray-900">Selecione os Horários de Atendimento</span>
                            {ranges.map((r, i) => (
                                <div key={i} className="flex items-center gap-3">
                                    <TimeField value={r.de} onChange={(v) => setRange(i, 'de', v)} />
                                    <span className="text-gray-400">-</span>
                                    <TimeField value={r.ate} onChange={(v) => setRange(i, 'ate', v)} />
                                </div>
                            ))}
                            <button
                                onClick={() => setRanges((r) => [...r, { de: '08:00', ate: '12:00' }])}
                                className="flex items-center gap-1.5 text-sm font-bold text-[#407BFF] self-start mt-1"
                            >
                                Adicionar Horário <Plus size={16} />
                            </button>
                        </div>
                    )}
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
