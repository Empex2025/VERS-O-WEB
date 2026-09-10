import { MoreHorizontal } from 'lucide-react';
import { AppShell } from '../../components/layout/AppShell';
import { PageHeader } from '../../components/layout/PageHeader';
import { InstituicaoCard, TipoAtendimentoCard, ValorCard, InfoCard } from './vinculoParts';

export function TermosVinculacao() {
    return (
        <AppShell rightRail={null}>
            <div className="max-w-4xl mx-auto">
                <PageHeader
                    title="Proposta de Vínculo"
                    to="/area-profissional/vinculos/clinica"
                    right={<button className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-500"><MoreHorizontal size={16} /></button>}
                />

                <div className="flex flex-col gap-3 pt-2">
                    <InstituicaoCard />
                    <TipoAtendimentoCard />
                    <ValorCard />
                    <InfoCard label="Descrição">
                        Exame de sangue utilizado para avaliar os glóbulos vermelhos, brancos e plaquetas, auxiliando no diagnóstico de anemias, infecções e outras condições.
                    </InfoCard>
                    <InfoCard label="Dias e Horários de Atendimento">
                        Segunda, Terça e Sexta<br />
                        de 08:00 ás 12:00 e de 14:00 ás 18:00
                    </InfoCard>
                </div>
            </div>
        </AppShell>
    );
}
