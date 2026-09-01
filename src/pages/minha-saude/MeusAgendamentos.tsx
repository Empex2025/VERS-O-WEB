import { BadgeCheck, Video, MapPin, ChevronRight, Clock } from 'lucide-react';
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
                    {appointmentsData.map((a) => (
                        <button
                            key={a.id}
                            onClick={() => navigate(`/minha-saude/agendamentos/${a.id}`)}
                            className="bg-white border border-gray-100 shadow-sm rounded-2xl p-4 text-left hover:border-[#407BFF] transition-colors"
                        >
                            <div className="flex items-center gap-3">
                                <Avatar name={a.professional} size={44} />
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-bold text-gray-900 flex items-center gap-1">
                                        {a.professional} <BadgeCheck size={14} className="text-emerald-500" />
                                    </p>
                                    <p className="text-xs text-gray-400">{a.role}</p>
                                </div>
                                <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${
                                    a.status === 'Confirmado' ? 'bg-emerald-100 text-emerald-600' : 'bg-amber-100 text-amber-600'
                                }`}>
                                    {a.status}
                                </span>
                            </div>

                            <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-100">
                                <span className="flex items-center gap-1.5 text-xs text-gray-500">
                                    {a.channel === 'Teleconsulta' ? <Video size={14} /> : <MapPin size={14} />}
                                    {a.channel} · {a.type}
                                </span>
                                <span className="flex items-center gap-1.5 text-xs font-semibold text-gray-700">
                                    <Clock size={14} /> {a.time}
                                    <ChevronRight size={16} className="text-gray-300" />
                                </span>
                            </div>
                        </button>
                    ))}
                </div>
            </div>
        </AppShell>
    );
}
