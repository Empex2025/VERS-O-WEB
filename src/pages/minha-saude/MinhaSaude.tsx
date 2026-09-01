import { FileText, ClipboardList, CalendarCheck, HeartPulse, ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { AppShell } from '../../components/layout/AppShell';
import { PageHeader } from '../../components/layout/PageHeader';

const ITEMS = [
    { to: '/minha-saude/agendamentos', icon: CalendarCheck, color: 'text-[#407BFF]', bg: 'bg-[#407BFF]/10', title: 'Meus Agendamentos', desc: 'Consultas e exames marcados' },
    { to: '/minha-saude/exames', icon: FileText, color: 'text-emerald-500', bg: 'bg-emerald-50', title: 'Resultados de Exames', desc: 'Acompanhe e anexe seus exames' },
    { to: '/minha-saude/informacoes', icon: HeartPulse, color: 'text-rose-500', bg: 'bg-rose-50', title: 'Minhas Informações de Saúde', desc: 'Seu prontuário e histórico' },
    { to: '/minha-saude/pre-consulta', icon: ClipboardList, color: 'text-violet-500', bg: 'bg-violet-50', title: 'Perguntas Pré-Consulta', desc: 'Responda antes do atendimento' },
];

export function MinhaSaude() {
    const navigate = useNavigate();
    return (
        <AppShell>
            <div className="max-w-2xl mx-auto">
                <PageHeader title="Minha Saúde" to="/inicio" />
                <div className="grid sm:grid-cols-2 gap-3">
                    {ITEMS.map(({ to, icon: Icon, color, bg, title, desc }) => (
                        <button
                            key={to}
                            onClick={() => navigate(to)}
                            className="flex items-center gap-3 bg-white border border-gray-100 shadow-sm rounded-2xl p-4 text-left hover:border-[#407BFF] transition-colors"
                        >
                            <span className={`w-11 h-11 rounded-xl flex items-center justify-center ${bg} ${color} shrink-0`}>
                                <Icon size={22} />
                            </span>
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-bold text-gray-900">{title}</p>
                                <p className="text-xs text-gray-400">{desc}</p>
                            </div>
                            <ChevronRight size={18} className="text-gray-300" />
                        </button>
                    ))}
                </div>
            </div>
        </AppShell>
    );
}
