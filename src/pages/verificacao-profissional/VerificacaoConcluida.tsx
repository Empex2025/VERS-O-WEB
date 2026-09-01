import { Home, PartyPopper } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { AppShell } from '../../components/layout/AppShell';
import { PageHeader } from '../../components/layout/PageHeader';
import { Stepper } from '../../components/layout/Stepper';

export function VerificacaoConcluida() {
    const navigate = useNavigate();
    return (
        <AppShell rightRail={null}>
            <div className="max-w-2xl mx-auto flex flex-col min-h-[calc(100vh-8rem)]">
                <PageHeader title="Adicionar um Endereço" to="/verificacao/pix" right={<Home size={18} className="text-gray-400" />} />
                <Stepper current={5} />

                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 flex flex-col sm:flex-row items-center gap-6">
                    <div className="w-40 h-40 rounded-2xl bg-emerald-50 flex items-center justify-center shrink-0">
                        <PartyPopper size={64} className="text-emerald-500" />
                    </div>
                    <div className="flex-1">
                        <h2 className="text-lg font-bold text-gray-900 mb-2">Tudo certo!</h2>
                        <p className="text-sm text-gray-500 leading-relaxed">
                            Suas informações profissionais foram adicionadas ao seu perfil. Agora pacientes já podem agendar
                            atendimentos com você diretamente pelo app.
                        </p>
                    </div>
                </div>

                <div className="flex items-center justify-end mt-auto pt-6">
                    <button
                        onClick={() => navigate('/inicio')}
                        className="text-sm font-bold px-6 py-2.5 rounded-full bg-[#407BFF] hover:bg-blue-600 text-white transition-colors"
                    >
                        Voltar para o início
                    </button>
                </div>
            </div>
        </AppShell>
    );
}
