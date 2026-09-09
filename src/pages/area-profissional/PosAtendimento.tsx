import { MoreHorizontal, MapPin, MessageCircle, FileText, Pill, FlaskConical, ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { AppShell } from '../../components/layout/AppShell';
import { PageHeader } from '../../components/layout/PageHeader';
import { Avatar } from '../../components/ui/Avatar';

const ACOES = [
    { icon: MessageCircle, label: 'Comentário para o Paciente', to: '/area-profissional/atendimento/comentario' },
    { icon: FileText, label: 'Gerar Atestado', to: '/area-profissional/atendimento/atestado' },
    { icon: Pill, label: 'Criar Prescrição', to: '/area-profissional/atendimento/prescricao' },
    { icon: FlaskConical, label: 'Solicitar Exames', to: '/area-profissional/atendimento/exames' },
];

export function PosAtendimento() {
    const navigate = useNavigate();
    return (
        <AppShell rightRail={null}>
            <div className="max-w-4xl mx-auto">
                <PageHeader
                    title="Pós Atendimento"
                    to="/area-profissional/atendimento/concluido"
                    right={<button className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-500"><MoreHorizontal size={16} /></button>}
                />

                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 sm:p-6 flex flex-col gap-5">
                    {/* Tipo de atendimento */}
                    <div className="flex items-center gap-2 bg-[#F9FAFB] rounded-xl px-4 py-3">
                        <MapPin size={16} className="text-gray-400" />
                        <div>
                            <p className="text-[11px] text-gray-400">Tipo de Atendimento</p>
                            <p className="text-sm font-bold text-gray-900">Teleconsulta</p>
                        </div>
                    </div>

                    {/* Paciente */}
                    <div className="flex items-center gap-3">
                        <Avatar name="Carlos Magno de Souza" size={48} />
                        <div>
                            <p className="text-base font-bold text-gray-900">Carlos Magno de Souza</p>
                            <p className="text-xs text-gray-400">@carlosmagno</p>
                        </div>
                    </div>

                    {/* Stats */}
                    <div className="grid grid-cols-3 gap-3">
                        <Stat label="Idade" value="24 anos" />
                        <Stat label="Peso" value="84kg" />
                        <Stat label="Altura" value="173cm" />
                    </div>

                    {/* Ações */}
                    <div className="flex flex-col gap-2">
                        {ACOES.map(({ icon: Icon, label, to }) => (
                            <button
                                key={label}
                                onClick={() => navigate(to)}
                                className="w-full flex items-center gap-3 rounded-xl border border-gray-100 px-4 py-3.5 hover:border-[#407BFF]/40 transition-colors text-left"
                            >
                                <Icon size={18} className="text-[#407BFF]" />
                                <span className="flex-1 text-sm font-semibold text-gray-800">{label}</span>
                                <ChevronRight size={16} className="text-gray-300" />
                            </button>
                        ))}
                    </div>

                    <button
                        onClick={() => navigate('/area-profissional/atendimento/resumo')}
                        className="self-end bg-[#407BFF] hover:bg-blue-600 text-white text-sm font-bold px-6 py-2.5 rounded-full transition-colors"
                    >
                        Concluir
                    </button>
                </div>
            </div>
        </AppShell>
    );
}

function Stat({ label, value }: { label: string; value: string }) {
    return (
        <div className="bg-[#F9FAFB] rounded-xl p-3">
            <p className="text-[10px] text-gray-400">{label}</p>
            <p className="text-sm font-bold text-gray-900 mt-1">{value}</p>
        </div>
    );
}
