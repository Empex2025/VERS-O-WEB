import { MoreHorizontal, HeartPulse, Info } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { AppShell } from '../../components/layout/AppShell';
import { PageHeader } from '../../components/layout/PageHeader';
import { Avatar } from '../../components/ui/Avatar';

export function PropostaVinculo() {
    const navigate = useNavigate();
    return (
        <AppShell rightRail={null}>
            <div className="max-w-4xl mx-auto flex flex-col min-h-[calc(100vh-8rem)]">
                <PageHeader
                    title="Proposta de Vínculo"
                    to="/area-profissional/vinculos"
                    right={<button className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-500"><MoreHorizontal size={16} /></button>}
                />

                <div className="flex-1 flex flex-col gap-3 pt-2">
                    <div className="bg-white rounded-xl border border-gray-100 px-4 py-4 flex items-center gap-3">
                        <Avatar name="Clínica Patinhas" size={40} />
                        <div>
                            <p className="text-[11px] text-gray-400">Instituição</p>
                            <p className="text-sm font-bold text-gray-900">Clínica Patinhas</p>
                        </div>
                    </div>

                    <div className="bg-white rounded-xl border border-gray-100 px-4 py-4 flex items-center gap-3">
                        <HeartPulse size={22} className="text-gray-500" />
                        <div>
                            <p className="text-[11px] text-gray-400">Tipo de Atendimento</p>
                            <p className="text-sm font-bold text-gray-900">Teleconsulta</p>
                        </div>
                    </div>

                    <div className="bg-white rounded-xl border border-gray-100 px-4 py-4 flex items-center justify-between">
                        <div>
                            <p className="text-[11px] text-gray-400">Você Receberá</p>
                            <p className="text-sm font-bold text-gray-900"><span className="text-[10px] text-gray-400">R$ </span>23,80</p>
                        </div>
                        <div>
                            <p className="text-[11px] text-gray-400">Valor do Atendimento</p>
                            <p className="text-sm font-semibold text-gray-500"><span className="text-[10px] text-gray-400">R$ </span>54,90</p>
                        </div>
                        <Info size={16} className="text-gray-300" />
                    </div>

                    <div className="bg-white rounded-xl border border-gray-100 px-4 py-4">
                        <p className="text-[11px] text-gray-400 mb-1">Descrição</p>
                        <p className="text-sm font-bold text-gray-800 leading-relaxed">
                            Exame de sangue utilizado para avaliar os glóbulos vermelhos, brancos e plaquetas, auxiliando no diagnóstico de anemias, infecções e outras condições.
                        </p>
                    </div>
                </div>

                {/* Rodapé */}
                <div className="flex items-center justify-end gap-4 border-t border-gray-100 pt-4 mt-4">
                    <button onClick={() => navigate(-1)} className="text-sm font-semibold text-rose-500 px-4 py-2">Recusar Solicitação</button>
                    <button onClick={() => navigate('/area-profissional/vinculos/confirmado')} className="bg-[#407BFF] hover:bg-blue-600 text-white text-sm font-bold px-6 py-2.5 rounded-full transition-colors">
                        Aceitar Solicitação
                    </button>
                </div>
            </div>
        </AppShell>
    );
}
