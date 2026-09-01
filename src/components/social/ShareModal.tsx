import { useState } from 'react';
import { X, Search, Link2, Mail, MessageCircle, Check } from 'lucide-react';
import { Avatar } from '../ui/Avatar';
import { suggestions } from '../../data/social';

// Alvos de compartilhamento. Ícones de marca são representados por glifos/ícones
// neutros para evitar dependência de brand icons.
const TARGETS: { label: string; icon?: React.ReactNode; glyph?: string; bg: string }[] = [
    { label: 'Copiar link', icon: <Link2 size={20} />, bg: 'bg-gray-700' },
    { label: 'Facebook', glyph: 'f', bg: 'bg-[#1877F2]' },
    { label: 'Messenger', icon: <MessageCircle size={20} />, bg: 'bg-[#0084FF]' },
    { label: 'WhatsApp', icon: <MessageCircle size={20} />, bg: 'bg-[#25D366]' },
    { label: 'Email', icon: <Mail size={20} />, bg: 'bg-gray-600' },
    { label: 'Threads', glyph: '@', bg: 'bg-black' },
    { label: 'X', glyph: '𝕏', bg: 'bg-black' },
];

export function ShareModal({ open, onClose }: { open: boolean; onClose: () => void }) {
    const [copied, setCopied] = useState(false);
    if (!open) return null;

    const handleTarget = (label: string) => {
        if (label === 'Copiar link') {
            navigator.clipboard?.writeText(window.location.href).catch(() => {});
            setCopied(true);
            setTimeout(() => setCopied(false), 1500);
        }
        // Demais alvos: abririam o app/rede correspondente
    };

    return (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4" onClick={onClose}>
            <div
                className="bg-[#1c1c1e] text-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Cabeçalho */}
                <div className="relative flex items-center justify-center p-4 border-b border-white/10">
                    <button onClick={onClose} className="absolute left-4 text-white/70 hover:text-white"><X size={20} /></button>
                    <h3 className="font-bold">Partilhar</h3>
                </div>

                {/* Busca */}
                <div className="p-4">
                    <div className="relative">
                        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40" />
                        <input
                            placeholder="Pesquisar"
                            className="w-full bg-white/10 rounded-lg py-2.5 pl-9 pr-3 text-sm text-white placeholder-white/40 outline-none"
                        />
                    </div>
                </div>

                {/* Contatos */}
                <div className="grid grid-cols-4 gap-3 px-4 pb-4 max-h-56 overflow-y-auto">
                    {[...suggestions, ...suggestions].map((p, i) => (
                        <button key={i} className="flex flex-col items-center gap-1.5">
                            <Avatar name={p.name} size={56} />
                            <span className="text-[11px] text-white/70 truncate w-full text-center">{p.name.split(' ')[0]}</span>
                        </button>
                    ))}
                </div>

                {/* Alvos */}
                <div className="flex gap-4 overflow-x-auto px-4 py-4 border-t border-white/10">
                    {TARGETS.map((t) => (
                        <button key={t.label} onClick={() => handleTarget(t.label)} className="flex flex-col items-center gap-1.5 shrink-0">
                            <span className={`w-11 h-11 rounded-full flex items-center justify-center text-white font-bold ${t.bg}`}>
                                {t.label === 'Copiar link' && copied ? <Check size={20} /> : (t.icon ?? <span className="text-lg">{t.glyph}</span>)}
                            </span>
                            <span className="text-[11px] text-white/70 whitespace-nowrap">
                                {t.label === 'Copiar link' && copied ? 'Copiado!' : t.label}
                            </span>
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
}
