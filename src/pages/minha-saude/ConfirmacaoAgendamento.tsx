import { BadgeCheck, Copy, Check } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';
import { AppShell } from '../../components/layout/AppShell';
import { PageHeader } from '../../components/layout/PageHeader';
import { Avatar } from '../../components/ui/Avatar';

export function ConfirmacaoAgendamento() {
    const navigate = useNavigate();
    const location = useLocation();
    const title: string = location.state?.title ?? 'Seu atendimento foi agendado com sucesso.';

    return (
        <AppShell>
            <div className="max-w-md mx-auto">
                <PageHeader title="Agendamento concluído" to="/minha-saude/agendamentos" />

                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 text-center">
                    <div className="w-14 h-14 rounded-full bg-emerald-500 flex items-center justify-center mx-auto mb-4">
                        <Check size={28} className="text-white" strokeWidth={3} />
                    </div>
                    <h2 className="text-base font-bold text-gray-900">{title}</h2>

                    {/* Card do atendimento */}
                    <div className="mt-5 text-left border border-gray-100 rounded-xl p-4">
                        <div className="flex items-center gap-3">
                            <Avatar name="Dra. Maria Glenda" size={40} />
                            <div>
                                <p className="text-sm font-bold text-gray-900 flex items-center gap-1">Dra. Maria Glenda <BadgeCheck size={13} className="text-emerald-500" /></p>
                                <p className="text-xs text-gray-400">Consulta Geral</p>
                            </div>
                        </div>

                        <div className="mt-3 bg-[#F3F4F6] rounded-lg p-3">
                            <p className="text-xs text-gray-400">Data e Horário</p>
                            <p className="text-sm font-bold text-gray-900">Segunda, 28 de Abril às 9:30</p>
                        </div>

                        <label className="flex items-center gap-2 mt-3 text-xs text-gray-500">
                            <input type="checkbox" defaultChecked className="accent-[#407BFF]" /> Lembre-me 15 minutos antes
                        </label>

                        <div className="mt-3">
                            <p className="text-xs text-gray-400">Código do Atendimento</p>
                            <div className="flex items-center gap-2 mt-1">
                                <span className="text-sm font-bold text-gray-800">4009-BE2025</span>
                                <button className="text-gray-400 hover:text-[#407BFF]"><Copy size={14} /></button>
                            </div>
                        </div>
                    </div>

                    <button
                        onClick={() => navigate('/inicio')}
                        className="w-full bg-[#407BFF] hover:bg-blue-600 text-white font-bold text-sm py-3 rounded-full mt-5 transition-colors"
                    >
                        Voltar para o Início
                    </button>
                </div>
            </div>
        </AppShell>
    );
}
