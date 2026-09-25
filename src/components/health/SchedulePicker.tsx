import { useEffect, useMemo, useState } from 'react';
import { X, ChevronLeft, ChevronRight, BadgeCheck } from 'lucide-react';
import { Avatar } from '../ui/Avatar';
import { teleconsultaService } from '../../services/teleconsultaService';

const WEEKDAYS = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
const MESES = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'];

interface Janela { id_usuario_profissional?: number; dia_semana: number; hora_inicio: string; hora_fim: string }

/** Gera horários (passo de 30min) dentro de uma janela "HH:MM"–"HH:MM". */
function gerarSlots(inicio: string, fim: string, passo = 30): string[] {
    const [hi, mi] = inicio.split(':').map(Number);
    const [hf, mf] = fim.split(':').map(Number);
    const out: string[] = [];
    let cur = hi * 60 + mi;
    const end = hf * 60 + mf;
    while (cur < end) {
        out.push(`${String(Math.floor(cur / 60)).padStart(2, '0')}:${String(cur % 60).padStart(2, '0')}`);
        cur += passo;
    }
    return out;
}

/** Grade padrão (quando não há profissional/agenda específica). */
const SLOTS_PADRAO = gerarSlots('09:00', '18:00');

interface Props {
    open: boolean;
    onClose: () => void;
    onConfirm: (date: number, time: string) => void;
    professionalId?: number;
    professionalName?: string;
    professionalRole?: string;
}

export function SchedulePicker({ open, onClose, onConfirm, professionalId, professionalName, professionalRole }: Props) {
    const hoje = new Date();
    const [view, setView] = useState({ ano: hoje.getFullYear(), mes: hoje.getMonth() });
    const [day, setDay] = useState(hoje.getDate());
    const [time, setTime] = useState<string | null>(null);
    const [janelas, setJanelas] = useState<Janela[] | null>(null);

    // Disponibilidade real do profissional (janelas por dia da semana).
    useEffect(() => {
        if (!open || !professionalId) { setJanelas(null); return; }
        let alive = true;
        (async () => {
            try {
                const raw = await teleconsultaService.disponibilidade.list<{ results: Janela[] } | Janela[]>();
                const list = Array.isArray(raw) ? raw : raw?.results ?? [];
                if (alive) setJanelas(list.filter((j) => !j.id_usuario_profissional || j.id_usuario_profissional === professionalId));
            } catch {
                if (alive) setJanelas([]);
            }
        })();
        return () => { alive = false; };
    }, [open, professionalId]);

    const primeiroDiaSemana = new Date(view.ano, view.mes, 1).getDay();
    const diasNoMes = new Date(view.ano, view.mes + 1, 0).getDate();
    const diaSemanaSelecionado = new Date(view.ano, view.mes, day).getDay();

    // Horários do dia selecionado: da agenda real, senão grade padrão.
    const horarios = useMemo(() => {
        if (janelas === null) return SLOTS_PADRAO; // sem profissional específico
        const doDia = janelas.filter((j) => j.dia_semana === diaSemanaSelecionado);
        if (!doDia.length) return [];
        return [...new Set(doDia.flatMap((j) => gerarSlots(j.hora_inicio, j.hora_fim)))].sort();
    }, [janelas, diaSemanaSelecionado]);

    const mudarMes = (delta: number) => {
        setTime(null);
        setView((v) => {
            const d = new Date(v.ano, v.mes + delta, 1);
            return { ano: d.getFullYear(), mes: d.getMonth() };
        });
    };

    const ehPassado = (d: number) => {
        const data = new Date(view.ano, view.mes, d);
        const base = new Date(hoje.getFullYear(), hoje.getMonth(), hoje.getDate());
        return data < base;
    };

    if (!open) return null;

    return (
        <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg overflow-hidden">
                {/* Cabeçalho */}
                <div className="flex items-center justify-between p-4 border-b border-gray-100">
                    <h3 className="font-bold text-gray-900 flex items-center gap-1"><ChevronLeft size={18} /> Selecione o Horário</h3>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600"><X size={18} /></button>
                </div>

                <div className="grid sm:grid-cols-2 gap-4 p-6">
                    {/* Calendário */}
                    <div>
                        <div className="flex items-center justify-between mb-3">
                            <button onClick={() => mudarMes(-1)} className="text-gray-400 hover:text-[#407BFF]"><ChevronLeft size={16} /></button>
                            <span className="text-sm font-bold text-gray-900">{MESES[view.mes]}, {view.ano}</span>
                            <button onClick={() => mudarMes(1)} className="text-gray-400 hover:text-[#407BFF]"><ChevronRight size={16} /></button>
                        </div>
                        <div className="grid grid-cols-7 gap-1 text-center">
                            {WEEKDAYS.map((w) => (
                                <span key={w} className="text-[10px] text-gray-400 py-1">{w}</span>
                            ))}
                            {Array.from({ length: primeiroDiaSemana }).map((_, i) => <span key={`e${i}`} />)}
                            {Array.from({ length: diasNoMes }).map((_, i) => {
                                const d = i + 1;
                                const selected = d === day;
                                const passado = ehPassado(d);
                                return (
                                    <button
                                        key={d}
                                        disabled={passado}
                                        onClick={() => { setDay(d); setTime(null); }}
                                        className={`w-7 h-7 rounded-full text-xs mx-auto flex items-center justify-center transition-colors ${
                                            passado ? 'text-gray-300 cursor-not-allowed'
                                                : selected ? 'bg-[#407BFF] text-white font-bold' : 'text-gray-600 hover:bg-gray-100'
                                        }`}
                                    >
                                        {d}
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    {/* Horários */}
                    <div>
                        {professionalName && (
                            <div className="flex items-center gap-2 mb-3">
                                <Avatar name={professionalName} size={32} />
                                <div>
                                    <p className="text-xs font-bold text-gray-900 flex items-center gap-1">{professionalName} <BadgeCheck size={12} className="text-emerald-500" /></p>
                                    {professionalRole && <p className="text-[10px] text-gray-400">{professionalRole}</p>}
                                </div>
                            </div>
                        )}
                        <p className="text-xs font-semibold text-gray-700 mb-2">Horários Disponíveis</p>
                        {horarios.length === 0 ? (
                            <p className="text-xs text-gray-400 py-4">Sem horários disponíveis neste dia.</p>
                        ) : (
                            <div className="grid grid-cols-3 gap-2 max-h-52 overflow-y-auto">
                                {horarios.map((slot) => (
                                    <button
                                        key={slot}
                                        onClick={() => setTime(slot)}
                                        className={`text-xs font-semibold py-1.5 rounded-md transition-colors ${
                                            time === slot ? 'bg-emerald-500 text-white' : 'bg-emerald-50 text-emerald-600 hover:bg-emerald-100'
                                        }`}
                                    >
                                        {slot}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                <div className="p-4 border-t border-gray-100">
                    <button
                        disabled={!time}
                        onClick={() => time && onConfirm(day, time)}
                        className={`w-full flex items-center justify-center gap-2 font-bold text-sm py-3 rounded-full transition-colors ${
                            time ? 'bg-[#407BFF] hover:bg-blue-600 text-white' : 'bg-[#E5E7EB] text-gray-400 cursor-not-allowed'
                        }`}
                    >
                        Avançar <ChevronRight size={16} />
                    </button>
                </div>
            </div>
        </div>
    );
}
