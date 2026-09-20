import { BadgeCheck, Video, MapPin } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { AppShell } from '../../components/layout/AppShell';
import { PageHeader } from '../../components/layout/PageHeader';
import { Avatar } from '../../components/ui/Avatar';
import { appointments, type Appointment } from '../../data/health';
import { teleconsultaService } from '../../services/teleconsultaService';
import { profileService } from '../../services/profileService';
import { useApiData } from '../../hooks/useApiData';

interface RawAppt {
    id_consulta: number;
    id_usuario_profissional: number;
    data_hora_inicio: string;
    tipo_consulta?: string;
    link_sala?: string;
    status?: string;
}

function fmtDate(d: string) {
    try { return new Date(d).toLocaleDateString('pt-BR', { weekday: 'long', day: 'numeric', month: 'long' }); } catch { return ''; }
}
function fmtTime(d: string) {
    try { return new Date(d).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }); } catch { return ''; }
}

async function fetchAgendamentos(): Promise<Appointment[]> {
    const raw = await teleconsultaService.agendamentos.list<RawAppt[] | { results: RawAppt[] }>();
    const list = Array.isArray(raw) ? raw : raw?.results ?? [];
    const proIds = [...new Set(list.map((a) => a.id_usuario_profissional).filter(Boolean))];
    const pros = new Map<number, { nome?: string; tipo_usuario?: string }>();
    await Promise.all(proIds.map(async (id) => {
        try {
            const u = await profileService.getUser<{ nome?: string; tipo_usuario?: string } | Array<{ nome?: string }>>(id);
            const user = Array.isArray(u) ? u[0] : u;
            if (user) pros.set(id, user);
        } catch { /* sem dados do profissional */ }
    }));
    return list.map((a) => ({
        id: String(a.id_consulta),
        professional: pros.get(a.id_usuario_profissional)?.nome || `Profissional ${a.id_usuario_profissional}`,
        role: 'Clínico Geral',
        type: a.tipo_consulta || 'Consulta',
        channel: a.link_sala ? 'Teleconsulta' : 'Presencial',
        date: fmtDate(a.data_hora_inicio),
        time: fmtTime(a.data_hora_inicio),
        price: '',
        status: a.status?.toLowerCase().includes('confirm') ? 'Confirmado' : 'Pendente',
    }));
}

export function MeusAgendamentos() {
    const navigate = useNavigate();
    const { data: appointmentsData } = useApiData(fetchAgendamentos, appointments, []);
    return (
        <AppShell>
            <div className="max-w-2xl mx-auto">
                <PageHeader title="Meus Agendamentos" to="/minha-saude" />

                <div className="flex flex-col gap-3">
                    {appointmentsData.map((a, i) => {
                        const isExame = /exame|raio|hemograma/i.test(a.type);
                        return (
                            <button
                                key={a.id}
                                onClick={() => navigate(`/minha-saude/agendamentos/${a.id}`)}
                                className="relative bg-white border border-gray-100 shadow-sm rounded-2xl p-4 text-left hover:border-[#407BFF] transition-colors"
                            >
                                {i === 0 && (
                                    <span className="absolute -top-2 right-4 bg-emerald-500 text-white text-[10px] font-bold px-2.5 py-1 rounded-full">Inicia em 3 min</span>
                                )}
                                <div className="flex items-center justify-between gap-3">
                                    <div className="flex items-center gap-3 min-w-0">
                                        <Avatar name={a.professional} size={40} />
                                        <p className="text-sm font-bold text-gray-900 flex items-center gap-1 truncate">
                                            {a.professional} <BadgeCheck size={14} className="text-[#407BFF] shrink-0" />
                                        </p>
                                    </div>
                                    <div className="text-right shrink-0">
                                        <p className="text-[11px] text-gray-400 capitalize">{a.date}</p>
                                        <p className="text-sm font-bold text-gray-900">{a.time}</p>
                                    </div>
                                </div>

                                <div className="mt-3 pt-3 border-t border-gray-100">
                                    <p className="text-[11px] text-gray-400">{isExame ? 'Exames' : 'Tipo de Atendimento'}</p>
                                    <p className="text-sm font-bold text-gray-900 mt-0.5 flex items-center gap-1.5">
                                        {!isExame && (a.channel === 'Teleconsulta' ? <Video size={14} className="text-gray-400" /> : <MapPin size={14} className="text-gray-400" />)}
                                        {isExame ? a.type : a.channel}
                                    </p>
                                </div>
                            </button>
                        );
                    })}
                </div>
            </div>
        </AppShell>
    );
}
