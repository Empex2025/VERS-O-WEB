import { Plus, BadgeCheck } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { AppShell } from '../../components/layout/AppShell';
import { PageHeader } from '../../components/layout/PageHeader';
import { HealthFields } from '../../components/health/HealthFields';
import { Avatar } from '../../components/ui/Avatar';

export function PreConsulta() {
    const navigate = useNavigate();
    return (
        <AppShell>
            <div className="max-w-2xl mx-auto">
                <PageHeader title="Perguntas Pré-Consulta" to="/minha-saude" />

                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 sm:p-6">
                    <button className="w-full flex items-center justify-center gap-2 bg-[#407BFF]/10 hover:bg-[#407BFF]/15 text-[#407BFF] font-bold text-sm py-3 rounded-xl transition-colors mb-5">
                        Fazer Upload de Exame <Plus size={18} />
                    </button>

                    {/* Profissional */}
                    <div className="flex items-center gap-3 pb-5 border-b border-gray-100">
                        <Avatar name="Dra. Maria Glenda" size={44} />
                        <div className="flex-1">
                            <p className="text-sm font-bold text-gray-900 flex items-center gap-1">Dra. Maria Glenda <BadgeCheck size={14} className="text-emerald-500" /></p>
                            <p className="text-xs text-gray-400">Clínico Geral</p>
                        </div>
                        <span className="text-xs font-semibold text-emerald-600 flex items-center gap-1">Consulta Geral <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" /></span>
                    </div>

                    <div className="pt-5">
                        <HealthFields />
                    </div>

                    <button
                        onClick={() => navigate('/minha-saude/agendamentos')}
                        className="w-full bg-[#407BFF] hover:bg-blue-600 text-white font-bold text-sm py-3 rounded-lg mt-6 transition-colors"
                    >
                        Enviar
                    </button>
                </div>
            </div>
        </AppShell>
    );
}
