import { useState } from 'react';
import { X, ChevronLeft, ChevronRight, BadgeCheck } from 'lucide-react';
import { Avatar } from '../ui/Avatar';
import { timeSlots, professional } from '../../data/health';

const WEEKDAYS = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
// Abril 2025 começa numa terça-feira (offset 2)
const MONTH_OFFSET = 2;
const DAYS_IN_MONTH = 30;

export function SchedulePicker({ open, onClose, onConfirm }: { open: boolean; onClose: () => void; onConfirm: (date: number, time: string) => void }) {
    const [day, setDay] = useState(28);
    const [time, setTime] = useState<string | null>(null);
    if (!open) return null;

    return (
        <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg overflow-hidden">
                {/* Cabeçalho */}
                <div className="flex items-center justify-between p-4 border-b border-gray-100">
                    <h3 className="font-bold text-gray-900 flex items-center gap-1"><ChevronLeft size={18} /> Selecione o Horário</h3>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600"><X size={18} /></button>
                </div>

                {/* Stepper */}
                <div className="flex items-center px-6 pt-4">
                    {[1, 2, 3, 4, 5].map((s, i) => (
                        <div key={s} className="flex items-center flex-1 last:flex-none">
                            <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold ${s <= 2 ? 'bg-[#407BFF] text-white' : 'bg-gray-100 text-gray-400'}`}>
                                {s <= 2 ? <BadgeCheck size={13} /> : s}
                            </div>
                            {i < 4 && <div className={`h-0.5 flex-1 mx-1 ${s < 2 ? 'bg-[#407BFF]' : 'bg-gray-100'}`} />}
                        </div>
                    ))}
                </div>

                <div className="grid sm:grid-cols-2 gap-4 p-6">
                    {/* Calendário */}
                    <div>
                        <div className="flex items-center justify-between mb-3">
                            <button className="text-gray-400"><ChevronLeft size={16} /></button>
                            <span className="text-sm font-bold text-gray-900">Abril, 2025</span>
                            <button className="text-gray-400"><ChevronRight size={16} /></button>
                        </div>
                        <div className="grid grid-cols-7 gap-1 text-center">
                            {WEEKDAYS.map((w) => (
                                <span key={w} className="text-[10px] text-gray-400 py-1">{w}</span>
                            ))}
                            {Array.from({ length: MONTH_OFFSET }).map((_, i) => <span key={`e${i}`} />)}
                            {Array.from({ length: DAYS_IN_MONTH }).map((_, i) => {
                                const d = i + 1;
                                const selected = d === day;
                                return (
                                    <button
                                        key={d}
                                        onClick={() => setDay(d)}
                                        className={`w-7 h-7 rounded-full text-xs mx-auto flex items-center justify-center transition-colors ${
                                            selected ? 'bg-[#407BFF] text-white font-bold' : 'text-gray-600 hover:bg-gray-100'
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
                        <div className="flex items-center gap-2 mb-3">
                            <Avatar name={professional.name} size={32} />
                            <div>
                                <p className="text-xs font-bold text-gray-900 flex items-center gap-1">{professional.name} <BadgeCheck size={12} className="text-emerald-500" /></p>
                                <p className="text-[10px] text-gray-400">{professional.role}</p>
                            </div>
                        </div>
                        <p className="text-xs font-semibold text-gray-700 mb-2">Horários Disponíveis</p>
                        <div className="grid grid-cols-3 gap-2">
                            {timeSlots.map((slot) => (
                                <button
                                    key={slot.time}
                                    disabled={!slot.available}
                                    onClick={() => setTime(slot.time)}
                                    className={`text-xs font-semibold py-1.5 rounded-md transition-colors ${
                                        !slot.available
                                            ? 'bg-gray-100 text-gray-300 cursor-not-allowed line-through'
                                            : time === slot.time
                                                ? 'bg-emerald-500 text-white'
                                                : 'bg-emerald-50 text-emerald-600 hover:bg-emerald-100'
                                    }`}
                                >
                                    {slot.time}
                                </button>
                            ))}
                        </div>
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
