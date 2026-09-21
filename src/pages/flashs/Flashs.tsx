import { useState } from 'react';
import { X, Volume2, MoreHorizontal, Send, ChevronLeft, ChevronRight, BadgeCheck } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { AppShell } from '../../components/layout/AppShell';
import { Avatar } from '../../components/ui/Avatar';

interface Flash { nome: string; handle: string; grad: string; texto?: string }

const FLASHS: Flash[] = [
    { nome: 'Dra. Maria Glenda', handle: '@dra.mariaglen', grad: 'from-[#407BFF] to-violet-500', texto: 'médico\nMÉDICO\nmedico' },
    { nome: 'Dr. Walter Alencar', handle: '@dr.walter.alencar', grad: 'from-slate-600 to-slate-800' },
    { nome: 'Dr. Marcos Toledo', handle: '@dr.marcos.toledo', grad: 'from-amber-200 to-emerald-200', texto: 'Olá\nBOM DIA' },
];

export function Flashs() {
    const navigate = useNavigate();
    const [idx, setIdx] = useState(1);
    const flash = FLASHS[idx];
    const prev = FLASHS[(idx - 1 + FLASHS.length) % FLASHS.length];
    const next = FLASHS[(idx + 1) % FLASHS.length];
    const go = (d: number) => setIdx((i) => (i + d + FLASHS.length) % FLASHS.length);

    return (
        <AppShell rightRail={null}>
            <div className="relative flex items-center justify-center gap-4 min-h-[calc(100vh-8rem)]">
                <button onClick={() => navigate('/inicio')} className="absolute top-0 right-0 w-9 h-9 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 hover:bg-gray-200 z-10">
                    <X size={18} />
                </button>

                {/* Anterior (esmaecido) */}
                <SideStory flash={prev} onClick={() => go(-1)} side="left" />

                {/* Ativo */}
                <div className="relative w-[300px] sm:w-[340px] aspect-[9/16] rounded-2xl overflow-hidden shadow-xl shrink-0">
                    <div className={`absolute inset-0 bg-gradient-to-br ${flash.grad}`} />
                    {flash.texto && (
                        <div className="absolute inset-0 flex items-center justify-center text-center">
                            <p className="text-white/90 text-3xl font-black leading-tight whitespace-pre-line drop-shadow">{flash.texto}</p>
                        </div>
                    )}

                    {/* Barras de progresso */}
                    <div className="absolute top-3 left-3 right-3 flex gap-1">
                        {FLASHS.map((_, i) => (
                            <span key={i} className="flex-1 h-0.5 rounded-full bg-white/40 overflow-hidden">
                                <span className={`block h-full bg-white ${i < idx ? 'w-full' : i === idx ? 'w-1/2' : 'w-0'}`} />
                            </span>
                        ))}
                    </div>

                    {/* Cabeçalho */}
                    <div className="absolute top-6 left-3 right-3 flex items-center gap-2">
                        <Avatar name={flash.nome} size={32} />
                        <div className="flex-1 min-w-0">
                            <p className="text-white text-xs font-bold flex items-center gap-1 truncate">{flash.nome} <BadgeCheck size={12} className="text-white" /></p>
                            <p className="text-white/70 text-[10px] truncate">{flash.handle}</p>
                        </div>
                        <button className="text-white/90"><Volume2 size={16} /></button>
                        <button className="text-white/90"><MoreHorizontal size={16} /></button>
                    </div>

                    {/* Mensagem privada */}
                    <div className="absolute bottom-3 left-3 right-3 flex items-center gap-2 bg-white/95 rounded-full pl-4 pr-1.5 h-11">
                        <input placeholder={`Envie uma mensagem privada para ${flash.handle}`} className="flex-1 bg-transparent text-xs text-gray-700 outline-none placeholder:text-gray-400" />
                        <button className="w-8 h-8 rounded-full bg-[#407BFF] text-white flex items-center justify-center shrink-0"><Send size={14} /></button>
                    </div>
                </div>

                {/* Próximo (esmaecido) */}
                <SideStory flash={next} onClick={() => go(1)} side="right" />
            </div>
        </AppShell>
    );
}

function SideStory({ flash, onClick, side }: { flash: Flash; onClick: () => void; side: 'left' | 'right' }) {
    return (
        <div className="relative hidden md:block shrink-0">
            <button onClick={onClick} className="block w-[150px] aspect-[9/16] rounded-xl overflow-hidden opacity-25 hover:opacity-40 transition-opacity">
                <div className={`w-full h-full bg-gradient-to-br ${flash.grad}`} />
            </button>
            <p className="text-center text-[11px] text-gray-500 mt-2">{flash.handle}</p>
            <button
                onClick={onClick}
                className={`absolute top-1/2 -translate-y-1/2 ${side === 'left' ? '-right-3' : '-left-3'} w-7 h-7 rounded-full bg-white shadow flex items-center justify-center text-gray-600 hover:text-[#407BFF]`}
            >
                {side === 'left' ? <ChevronLeft size={16} /> : <ChevronRight size={16} />}
            </button>
        </div>
    );
}
