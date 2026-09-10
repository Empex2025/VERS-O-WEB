import { BadgeCheck } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { AppShell } from '../../components/layout/AppShell';
import { PageHeader } from '../../components/layout/PageHeader';

export function ProntoParaAtender() {
    const navigate = useNavigate();
    return (
        <AppShell rightRail={null}>
            <div className="max-w-5xl mx-auto flex flex-col min-h-[calc(100vh-8rem)]">
                <PageHeader title="Informações Profissionais" to="/meu-perfil" />

                <div className="flex-1">
                    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8 flex flex-col sm:flex-row items-center gap-6">
                        <div className="flex-1">
                            <h2 className="text-2xl font-bold text-gray-900 mb-3">Pronto para atender no iSaúde?</h2>
                            <p className="text-sm text-gray-500 leading-relaxed">
                                Adicione suas informações profissionais como Horário de Funcionamento, Consultas, Endereço e Chave Pix para iniciar seus atendimento em nossa comunidade.
                            </p>
                        </div>
                        <div className="w-56 h-40 rounded-2xl bg-[#407BFF]/5 flex items-center justify-center shrink-0">
                            <BadgeCheck size={80} className="text-[#407BFF]" strokeWidth={1.5} />
                        </div>
                    </div>
                </div>

                <div className="flex items-center justify-end gap-6 border-t border-gray-100 pt-4 mt-4">
                    <button onClick={() => navigate('/inicio')} className="text-sm font-bold text-[#407BFF] underline">Pular por enquanto!</button>
                    <button onClick={() => navigate('/verificacao')} className="bg-[#407BFF] hover:bg-blue-600 text-white text-sm font-bold px-6 py-2.5 rounded-full transition-colors">
                        Adicionar Informações
                    </button>
                </div>
            </div>
        </AppShell>
    );
}
