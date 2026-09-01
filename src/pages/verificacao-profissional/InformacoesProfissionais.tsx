import { BadgeCheck, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { AppShell } from '../../components/layout/AppShell';
import { PageHeader } from '../../components/layout/PageHeader';

export function InformacoesProfissionais() {
    const navigate = useNavigate();
    return (
        <AppShell rightRail={null}>
            <div className="max-w-2xl mx-auto flex flex-col min-h-[calc(100vh-8rem)]">
                <PageHeader title="Informações Profissionais" to="/inicio" />

                {/* Card de destaque */}
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 flex flex-col sm:flex-row items-center gap-6">
                    {/* Ilustração */}
                    <div className="w-40 h-40 rounded-2xl bg-[#407BFF]/5 flex items-center justify-center shrink-0">
                        <BadgeCheck size={64} className="text-[#407BFF]" />
                    </div>
                    <div className="flex-1">
                        <h2 className="text-lg font-bold text-gray-900 mb-2">Pronto para atender no iSaúde?</h2>
                        <p className="text-sm text-gray-500 leading-relaxed mb-4">
                            Adicione suas informações profissionais como Horário de Funcionamento, Endereço, Certificados e
                            Chave Pix para que suas consultas e atendimentos possam ser realizados.
                        </p>
                        <button
                            onClick={() => navigate('/verificacao/horario')}
                            className="inline-flex items-center gap-2 bg-[#407BFF] hover:bg-blue-600 text-white font-bold text-sm px-5 py-2.5 rounded-full transition-colors"
                        >
                            Adicionar Informações <ArrowRight size={16} />
                        </button>
                        <button className="block text-xs font-semibold text-[#407BFF] mt-3 hover:underline">Saiba mais</button>
                    </div>
                </div>

                {/* Rodapé */}
                <div className="flex items-center justify-end gap-3 mt-auto pt-6">
                    <button onClick={() => navigate('/inicio')} className="text-sm font-semibold text-gray-500 hover:text-gray-700 px-4 py-2">
                        Fazer isso depois
                    </button>
                    <button
                        onClick={() => navigate('/verificacao/horario')}
                        className="text-sm font-bold px-6 py-2.5 rounded-full bg-[#407BFF] hover:bg-blue-600 text-white transition-colors"
                    >
                        Iniciar Verificação
                    </button>
                </div>
            </div>
        </AppShell>
    );
}
