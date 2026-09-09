import { Video, Star, Headset, RotateCcw, ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { AppShell } from '../../components/layout/AppShell';
import { PageHeader } from '../../components/layout/PageHeader';

export function AtendimentoConcluido() {
    const navigate = useNavigate();
    return (
        <AppShell rightRail={null}>
            <div className="max-w-5xl mx-auto">
                <PageHeader title="Atendimento Concluído" to="/area-profissional/agenda" />

                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 sm:p-8">
                    <div className="flex flex-col md:flex-row items-center gap-8">
                        {/* Ilustração */}
                        <div className="w-full md:w-1/2 h-56 rounded-2xl bg-[#407BFF]/5 flex items-center justify-center shrink-0">
                            <div className="flex items-end gap-3">
                                <div className="w-16 h-16 rounded-full bg-[#407BFF]/20 flex items-center justify-center">
                                    <Video size={28} className="text-[#407BFF]" />
                                </div>
                                <div className="w-24 h-32 rounded-xl bg-[#407BFF]/10" />
                                <div className="w-16 h-16 rounded-full bg-emerald-200 flex items-center justify-center">
                                    <Star size={26} className="text-emerald-500" />
                                </div>
                            </div>
                        </div>

                        {/* Texto + ações */}
                        <div className="w-full md:w-1/2 flex flex-col gap-4">
                            <div>
                                <h2 className="text-xl font-bold text-gray-900">Consulta Finalizada com Sucesso.</h2>
                                <p className="text-xs text-gray-400 mt-1">Você encerrou o atendimento.</p>
                                <p className="text-sm text-gray-500 mt-3 leading-relaxed">
                                    Este <span className="font-semibold text-gray-700">atendimento pôde retornar mais tarde</span>. Você pode finalizar
                                    e enviar para o paciente agendar uma data de retorno.
                                </p>
                            </div>

                            <button
                                onClick={() => navigate('/area-profissional/atendimento/pos')}
                                className="w-full bg-[#407BFF] hover:bg-blue-600 text-white text-sm font-bold px-5 py-3.5 rounded-full flex items-center justify-between transition-colors"
                            >
                                <span className="flex items-center gap-2"><Video size={16} /> Pós Atendimento</span>
                                <ChevronRight size={18} />
                            </button>
                        </div>
                    </div>

                    {/* Pills */}
                    <div className="grid sm:grid-cols-3 gap-3 mt-5">
                        <Pill icon={<Star size={16} className="text-[#407BFF]" />} label="Avaliar" onClick={() => navigate('/area-profissional/atendimento/resumo')} />
                        <Pill icon={<Headset size={16} className="text-[#407BFF]" />} label="Ajuda e Suporte" onClick={() => navigate('/area-profissional/financeiro')} />
                        <Pill icon={<RotateCcw size={16} className="text-rose-500" />} label="Retomar Atendimento" danger onClick={() => navigate('/area-profissional/agenda')} />
                    </div>
                </div>
            </div>
        </AppShell>
    );
}

function Pill({ icon, label, danger, onClick }: { icon: React.ReactNode; label: string; danger?: boolean; onClick?: () => void }) {
    return (
        <button
            onClick={onClick}
            className={`flex items-center justify-between gap-2 rounded-xl px-4 py-3 text-sm font-semibold transition-colors ${danger ? 'bg-rose-50 text-rose-500 hover:bg-rose-100' : 'bg-[#F9FAFB] text-gray-700 hover:bg-gray-100'}`}
        >
            <span className="flex items-center gap-2">{icon}{label}</span>
            <ChevronRight size={16} className={danger ? 'text-rose-300' : 'text-gray-300'} />
        </button>
    );
}
