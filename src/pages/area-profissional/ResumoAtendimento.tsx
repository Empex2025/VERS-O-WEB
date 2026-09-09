import { MoreHorizontal, MapPin, CalendarDays, Clock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { AppShell } from '../../components/layout/AppShell';
import { PageHeader } from '../../components/layout/PageHeader';
import { Avatar } from '../../components/ui/Avatar';

export function ResumoAtendimento() {
    const navigate = useNavigate();
    return (
        <AppShell rightRail={null}>
            <div className="max-w-4xl mx-auto">
                <PageHeader
                    title="Atendimento Concluído"
                    to="/area-profissional/atendimento/pos"
                    right={<button className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-500"><MoreHorizontal size={16} /></button>}
                />

                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 sm:p-6 flex flex-col gap-3">
                    {/* Paciente */}
                    <div className="flex items-center gap-3 bg-[#F9FAFB] rounded-xl px-4 py-3">
                        <Avatar name="Carlos Magno de Souza" size={40} />
                        <div>
                            <p className="text-[11px] text-gray-400">Paciente</p>
                            <p className="text-sm font-bold text-gray-900">Carlos Magno de Souza</p>
                        </div>
                    </div>

                    {/* Tipo */}
                    <div className="flex items-center gap-2 bg-[#F9FAFB] rounded-xl px-4 py-3">
                        <MapPin size={16} className="text-gray-400" />
                        <div>
                            <p className="text-[11px] text-gray-400">Tipo de Atendimento</p>
                            <p className="text-sm font-bold text-gray-900">Teleconsulta</p>
                        </div>
                    </div>

                    {/* Código */}
                    <div className="bg-[#F9FAFB] rounded-xl px-4 py-3">
                        <p className="text-[11px] text-gray-400">Código de Identificação</p>
                        <p className="text-sm font-bold text-gray-900 tracking-wide">4SVM8365N</p>
                    </div>

                    {/* Data / Hora / Duração */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        <div className="flex items-center gap-2 bg-[#F9FAFB] rounded-xl px-4 py-3">
                            <CalendarDays size={16} className="text-gray-400 shrink-0" />
                            <div>
                                <p className="text-[11px] text-gray-400">Data do atendimento</p>
                                <p className="text-sm font-bold text-gray-900">Segunda, 30 de Abril</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-2 bg-[#F9FAFB] rounded-xl px-4 py-3">
                            <Clock size={16} className="text-gray-400 shrink-0" />
                            <div>
                                <p className="text-[11px] text-gray-400">Hora do atendimento</p>
                                <p className="text-sm font-bold text-gray-900">8:30 - 11:00</p>
                            </div>
                        </div>
                        <div className="bg-[#F9FAFB] rounded-xl px-4 py-3">
                            <p className="text-[11px] text-gray-400">Duração</p>
                            <p className="text-sm font-bold text-gray-900">1:55:43</p>
                        </div>
                    </div>

                    <button
                        onClick={() => navigate('/area-profissional/agenda')}
                        className="self-end mt-2 bg-[#407BFF] hover:bg-blue-600 text-white text-sm font-bold px-6 py-2.5 rounded-full transition-colors"
                    >
                        Voltar à Agenda
                    </button>
                </div>
            </div>
        </AppShell>
    );
}
