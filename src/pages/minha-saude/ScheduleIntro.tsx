import { useState } from 'react';
import { Menu, CalendarDays, Heart, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { AppShell } from '../../components/layout/AppShell';
import { PageHeader } from '../../components/layout/PageHeader';
import { SchedulePicker } from '../../components/health/SchedulePicker';

interface ScheduleIntroProps {
    header: string;
    title: string;
    subtitle: string;
    button: string;
    showDontRepeat?: boolean;
    successTitle: string;
}

export function ScheduleIntro({ header, title, subtitle, button, showDontRepeat, successTitle }: ScheduleIntroProps) {
    const navigate = useNavigate();
    const [picking, setPicking] = useState(false);

    return (
        <AppShell>
            <div className="max-w-2xl mx-auto">
                <PageHeader title={header} to="/minha-saude/agendamentos" right={<Menu size={20} className="text-gray-500" />} />

                <h2 className="text-lg font-bold text-gray-900">{title}</h2>
                <p className="text-sm text-gray-500 mt-1 mb-6">{subtitle}</p>

                <div className="flex flex-col gap-3">
                    <StepCard icon={<CalendarDays size={20} />} title="Selecione uma Data" desc="Escolha o melhor momento para sua consulta." />
                    <StepCard icon={<Heart size={20} />} title="Finalize seu Agendamento" desc="Confirme seus dados." />
                </div>

                <p className="text-sm font-bold text-gray-800 mt-6">Viu como é fácil? Vamos lá!</p>
                {showDontRepeat && (
                    <label className="flex items-center gap-2 mt-2 text-xs text-gray-500">
                        <input type="checkbox" className="accent-[#407BFF]" /> Não mostrar novamente!
                    </label>
                )}

                <button
                    onClick={() => setPicking(true)}
                    className="w-full flex items-center justify-center gap-2 bg-[#407BFF] hover:bg-blue-600 text-white font-bold text-sm py-3.5 rounded-xl mt-4 transition-colors"
                >
                    {button} <ArrowRight size={18} />
                </button>
            </div>

            <SchedulePicker
                open={picking}
                onClose={() => setPicking(false)}
                onConfirm={() => navigate('/minha-saude/pagamento', { state: { title: successTitle } })}
            />
        </AppShell>
    );
}

function StepCard({ icon, title, desc }: { icon: React.ReactNode; title: string; desc: string }) {
    return (
        <div className="flex items-center gap-3 bg-white border border-gray-100 shadow-sm rounded-xl p-4">
            <span className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center text-gray-700">{icon}</span>
            <div>
                <p className="text-sm font-bold text-gray-900">{title}</p>
                <p className="text-xs text-gray-400">{desc}</p>
            </div>
        </div>
    );
}

export function Reagendar() {
    return (
        <ScheduleIntro
            header="Reagendar Atendimento"
            title="Vamos Reagendar esse Atendimento em poucos passos."
            subtitle="Selecione um dia e um horário para reagendar o atendimento de forma gratuita."
            button="Reagendar Atendimento"
            successTitle="O Atendimento foi reagendado com sucesso."
        />
    );
}

export function AgendarRetorno() {
    return (
        <ScheduleIntro
            header="Agendar Retorno"
            title="Este atendimento possui um retorno incluso."
            subtitle="Selecione um dia e um horário para realizar o retorno da consulta de forma gratuita."
            button="Agendar Retorno"
            showDontRepeat
            successTitle="O Retorno do Atendimento foi agendado com sucesso."
        />
    );
}
