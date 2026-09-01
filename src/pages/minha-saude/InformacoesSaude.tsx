import { BadgeCheck } from 'lucide-react';
import { AppShell } from '../../components/layout/AppShell';
import { PageHeader } from '../../components/layout/PageHeader';
import { HealthFields } from '../../components/health/HealthFields';
import { Avatar } from '../../components/ui/Avatar';

export function InformacoesSaude() {
    return (
        <AppShell>
            <div className="max-w-2xl mx-auto">
                <PageHeader title="Minhas Informações de Saúde" to="/minha-saude" />

                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 sm:p-6">
                    {/* Profissional responsável */}
                    <div className="flex items-center gap-3 pb-5 border-b border-gray-100">
                        <Avatar name="Dra. Maria Glenda" size={44} />
                        <div className="flex-1">
                            <p className="text-sm font-bold text-gray-900 flex items-center gap-1">
                                Dra. Maria Glenda <BadgeCheck size={14} className="text-emerald-500" />
                            </p>
                            <p className="text-xs text-gray-400">Clínico Geral</p>
                        </div>
                        <span className="text-xs font-semibold text-emerald-600 flex items-center gap-1">
                            Consulta Geral <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                        </span>
                    </div>

                    <div className="pt-5">
                        <HealthFields withSectionTitles />
                    </div>

                    <button className="w-full bg-[#407BFF] hover:bg-blue-600 text-white font-bold text-sm py-3 rounded-lg mt-6 transition-colors">
                        Salvar Dados
                    </button>
                </div>
            </div>
        </AppShell>
    );
}
