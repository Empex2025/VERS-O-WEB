import { MoreHorizontal, BadgeCheck } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { AppShell } from '../../components/layout/AppShell';
import { PageHeader } from '../../components/layout/PageHeader';
import { InstituicaoCard, TipoAtendimentoCard, ValorCard, InfoCard } from './vinculoParts';

export function VinculoConfirmado() {
    const navigate = useNavigate();
    return (
        <AppShell rightRail={null}>
            <div className="max-w-4xl mx-auto flex flex-col min-h-[calc(100vh-8rem)]">
                <PageHeader
                    title="Vínculo Confirmado"
                    to="/area-profissional/vinculos"
                    right={<button className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-500"><MoreHorizontal size={16} /></button>}
                />

                <div className="flex-1 flex flex-col gap-3 pt-2">
                    {/* Sucesso */}
                    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm px-6 py-6 flex items-center gap-5">
                        <BadgeCheck size={56} className="text-[#01AEA4] shrink-0" strokeWidth={1.5} />
                        <div>
                            <p className="text-base font-bold text-gray-900">Parabéns!</p>
                            <p className="text-base font-bold text-gray-900">Seu vínculo com a Clínica Patinhas está confirmado.</p>
                            <p className="text-sm text-gray-500 mt-1">Agora seus serviços podem ser agendados diretamente pelo perfil da instituição.</p>
                        </div>
                    </div>

                    <div className="grid sm:grid-cols-2 gap-3">
                        <InstituicaoCard />
                        <TipoAtendimentoCard />
                    </div>
                    <ValorCard />
                    <InfoCard label="Descrição">
                        Segunda, Terça e Sexta<br />
                        de 08:00 ás 12:00 e de 14:00 ás 18:00
                    </InfoCard>
                </div>

                <div className="flex justify-end border-t border-gray-100 pt-4 mt-4">
                    <button
                        onClick={() => navigate('/area-profissional')}
                        className="bg-[#407BFF] hover:bg-blue-600 text-white text-sm font-bold px-6 py-2.5 rounded-full transition-colors"
                    >
                        Voltar para o início
                    </button>
                </div>
            </div>
        </AppShell>
    );
}
