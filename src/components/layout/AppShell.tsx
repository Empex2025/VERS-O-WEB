import { useState, type ReactNode } from 'react';
import {
    Home, HeartPulse, Zap, Clapperboard, MessageCircle,
    Search, Plus, Bell, User, ChevronDown,
} from 'lucide-react';
import { NavLink, Link } from 'react-router-dom';
import { cn } from '../../lib/utils';
import { Avatar } from '../ui/Avatar';
import { MiniConversas } from '../social/MiniConversas';
import { suggestions } from '../../data/social';
import logoImage from '../../assets/login/logo-login.png';

const NAV_ITEMS = [
    { to: '/inicio', label: 'Início', icon: Home },
    { to: '/minha-saude', label: 'Minha Saúde', icon: HeartPulse },
    { to: '/flashs', label: 'Flashs', icon: Zap },
    { to: '/pulses', label: 'Pulses', icon: Clapperboard },
    { to: '/conversas', label: 'Conversas', icon: MessageCircle },
    { to: '/explorar', label: 'Explorar', icon: Search },
    { to: '/criar-post', label: 'Criar post', icon: Plus },
    { to: '/notificacoes', label: 'Notificações', icon: Bell },
    { to: '/meu-perfil', label: 'Meu Perfil', icon: User },
];

/** Coluna direita padrão: sugestões para seguir + patrocinado */
export function SuggestionsRail() {
    return (
        <div className="flex flex-col gap-6">
            <div>
                <h3 className="text-sm font-bold text-gray-900 mb-4">Sugestões para seguir</h3>
                <div className="flex flex-col gap-3">
                    {suggestions.map((p) => (
                        <div key={p.handle} className="flex items-center gap-3">
                            <Avatar name={p.name} size={40} />
                            <div className="min-w-0 flex-1">
                                <p className="text-sm font-semibold text-gray-900 truncate flex items-center gap-1">
                                    {p.name}
                                    {p.verified && <span className="text-[#407BFF] text-xs">✔</span>}
                                </p>
                                <p className="text-xs text-gray-400 truncate">{p.role}</p>
                            </div>
                            <button className="text-xs font-bold text-white bg-[#407BFF] hover:bg-blue-600 px-4 py-1.5 rounded-full transition-colors">
                                Seguir
                            </button>
                        </div>
                    ))}
                </div>
            </div>

            <div>
                <h3 className="text-sm font-bold text-gray-900 mb-4">Patrocinado</h3>
                <div className="flex flex-col gap-3">
                    <div className="h-32 rounded-xl bg-gray-100" />
                    <div className="h-32 rounded-xl bg-gray-100" />
                </div>
            </div>
        </div>
    );
}

interface AppShellProps {
    children: ReactNode;
    /** Conteúdo da coluna direita. Passe `null` para ocultar. Padrão: sugestões. */
    rightRail?: ReactNode | null;
    /** Remove o padding/centralização do miolo (para telas full-bleed como Pulses). */
    bare?: boolean;
}

export function AppShell({ children, rightRail = <SuggestionsRail />, bare }: AppShellProps) {
    const [chatOpen, setChatOpen] = useState(false);
    return (
        <div className="min-h-screen bg-gray-50 font-sans">
            {/* Header */}
            <header className="sticky top-0 z-50 w-full bg-[#407BFF] h-16 flex items-center justify-between px-4 md:px-8 shadow-sm">
                <Link to="/inicio">
                    <img src={logoImage} alt="iSaúde" className="h-8 object-contain brightness-0 invert" />
                </Link>
                <button
                    onClick={() => setChatOpen((v) => !v)}
                    className="flex items-center gap-2 bg-white/95 hover:bg-white text-gray-800 font-semibold text-sm pl-3 pr-2 py-1.5 rounded-lg transition-colors"
                >
                    <span className="relative">
                        <MessageCircle size={18} className="text-[#407BFF]" />
                        <span className="absolute -top-2 -right-2 bg-red-500 text-white text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center">3</span>
                    </span>
                    Conversas
                    <ChevronDown size={16} className={cn('text-gray-500 transition-transform', chatOpen && 'rotate-180')} />
                </button>
            </header>

            {/* Mini chat (estilo Messenger) */}
            <MiniConversas open={chatOpen} onClose={() => setChatOpen(false)} />

            {/* Corpo */}
            <div className="max-w-[1400px] mx-auto flex">
                {/* Sidebar esquerda */}
                <aside className="hidden md:block w-56 shrink-0 sticky top-16 h-[calc(100vh-4rem)] overflow-y-auto py-6 px-3">
                    <nav className="flex flex-col gap-1">
                        {NAV_ITEMS.map(({ to, label, icon: Icon }) => (
                            <NavLink
                                key={to}
                                to={to}
                                className={({ isActive }) =>
                                    cn(
                                        'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors',
                                        isActive
                                            ? 'bg-[#407BFF]/10 text-[#407BFF] font-bold'
                                            : 'text-gray-700 hover:bg-gray-100 font-medium',
                                    )
                                }
                            >
                                <Icon size={20} />
                                {label}
                            </NavLink>
                        ))}
                    </nav>
                </aside>

                {/* Miolo */}
                <main className={cn('flex-1 min-w-0', bare ? '' : 'px-4 lg:px-6 py-6')}>
                    {children}
                </main>

                {/* Coluna direita */}
                {rightRail !== null && (
                    <aside className="hidden lg:block w-72 shrink-0 sticky top-16 h-[calc(100vh-4rem)] overflow-y-auto py-6 px-4">
                        {rightRail}
                    </aside>
                )}
            </div>
        </div>
    );
}
