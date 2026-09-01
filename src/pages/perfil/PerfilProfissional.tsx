import { useState } from 'react';
import {
    Bookmark, MoreHorizontal, BadgeCheck, Video, Share2, Star, ChevronRight,
    Stethoscope, MapPin, ImageIcon,
} from 'lucide-react';
import { AppShell } from '../../components/layout/AppShell';
import { PageHeader } from '../../components/layout/PageHeader';
import { Avatar } from '../../components/ui/Avatar';
import { SchedulePicker } from '../../components/health/SchedulePicker';
import { suggestions } from '../../data/social';
import { professional as pro } from '../../data/health';
import { useNavigate, useParams } from 'react-router-dom';
import { teleconsultaService } from '../../services/teleconsultaService';
import { profileService } from '../../services/profileService';
import { useApiData } from '../../hooks/useApiData';
import { useAuthStore } from '../../store/useAuthStore';

const REVIEWS_FALLBACK = [
    { name: 'Roberto', stars: 5, text: 'Excelente atendimento, muito atenciosa e didática.' },
    { name: 'Amanda', stars: 5, text: 'Resolveu meu problema rapidamente. Recomendo!' },
    { name: 'Ariana', stars: 4, text: 'Ótima médica, só demorou um pouco para começar.' },
];

interface ProfDisplay {
    name: string; handle: string; bio: string; crm: string; ratingAverage: number;
    stats: { followers: string; posts: string; ratings: string };
    services: { label: string; desc: string; price: string }[];
    reviews: { name: string; stars: number; text: string }[];
}

const PROF_FALLBACK: ProfDisplay = {
    name: pro.name, handle: pro.handle, bio: pro.bio, crm: pro.crm,
    ratingAverage: pro.ratingAverage, stats: pro.stats, services: pro.services, reviews: REVIEWS_FALLBACK,
};

/** Carrega o profissional real (`:id`) de teleconsulta + user, com fallback ao mock. */
async function fetchProf(id?: string): Promise<ProfDisplay> {
    if (!id) throw new Error('sem id');
    const [profRes, userRes] = await Promise.all([
        teleconsultaService.profissionais.get<{ results?: any[] } | any[]>(id).catch(() => null),
        profileService.getPublicUser<any>(id).catch(() => null),
    ]);
    const profList = Array.isArray(profRes) ? profRes : profRes?.results ?? [];
    const prof = profList[0] ?? ((profRes as any)?.id ? profRes : undefined);
    const user = userRes;
    if (!prof && !user) throw new Error('não encontrado');

    let reviews = REVIEWS_FALLBACK;
    try {
        const av = await teleconsultaService.avaliacoes.list<{ results?: any[] } | any[]>({ profissional_id: id });
        const avl = Array.isArray(av) ? av : av?.results ?? [];
        if (avl.length) reviews = avl.map((a: any) => ({ name: a.autor_nome || `Usuário ${a.autor_id ?? a.paciente_id ?? ''}`, stars: Number(a.nota ?? a.estrelas ?? 5), text: a.comentario ?? a.texto ?? '' }));
    } catch { /* usa fallback */ }

    const especialidade = prof?.especialidade || 'Profissional de saúde';
    const preco = prof?.preco != null ? `R$ ${prof.preco}` : (pro.services[0]?.price ?? '');
    const modalidades = (prof?.modalidades || prof?.tipos || []).join(' · ') || 'Atendimento';
    return {
        name: prof?.nome || user?.nome || pro.name,
        handle: user?.username ? `@${user.username}` : pro.handle,
        bio: user?.descricao_bio || especialidade,
        crm: especialidade,
        ratingAverage: pro.ratingAverage,
        stats: pro.stats,
        services: [{ label: especialidade, desc: modalidades, price: preco }],
        reviews,
    };
}

export function PerfilProfissional() {
    const navigate = useNavigate();
    const { id } = useParams();
    const selfId = useAuthStore((s) => s.user?.id) ?? 0;
    const [picking, setPicking] = useState(false);
    const { data: dp } = useApiData(() => fetchProf(id), PROF_FALLBACK, [id]);

    // Cria o agendamento de verdade e segue para o pagamento.
    const agendar = async (day: number, time: string) => {
        let consultaId: number | undefined;
        if (selfId && id) {
            const now = new Date();
            const [h, m] = time.split(':').map((n) => parseInt(n, 10));
            const inicio = new Date(now.getFullYear(), now.getMonth() + 1, day, h || 9, m || 0, 0);
            const fim = new Date(inicio.getTime() + 30 * 60 * 1000);
            try {
                const res: any = await teleconsultaService.agendamentos.create({
                    id_usuario_paciente: selfId,
                    id_usuario_profissional: Number(id),
                    data_hora_inicio: inicio.toISOString(),
                    data_hora_fim: fim.toISOString(),
                    tipo_consulta: 'teleconsulta',
                    motivo: 'Consulta agendada pelo app',
                    comentarios: `Atendimento com ${dp.name}`,
                });
                consultaId = res?.result?.id_consulta ?? res?.id_consulta ?? res?.results?.id_consulta;
            } catch { /* otimista: segue para o pagamento mesmo se falhar */ }
        }
        const valor = parseFloat((dp.services[0]?.price ?? '').replace(/[^\d,.-]/g, '').replace(',', '.')) || undefined;
        navigate('/minha-saude/pagamento', {
            state: { title: 'Seu atendimento foi agendado com sucesso.', consultaId, valor, profNome: dp.name, profId: Number(id) },
        });
    };

    return (
        <AppShell rightRail={null}>
            <div className="max-w-2xl mx-auto">
                <PageHeader
                    title={dp.handle}
                    to="/inicio"
                    right={
                        <div className="flex items-center gap-3 text-gray-600">
                            <button className="hover:text-[#407BFF]"><Bookmark size={18} /></button>
                            <button className="hover:text-[#407BFF]"><MoreHorizontal size={18} /></button>
                        </div>
                    }
                />

                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
                    {/* Topo */}
                    <div className="flex items-start gap-4">
                        <Avatar name={dp.name} size={80} ring />
                        <div className="flex-1">
                            <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full mb-1">
                                <Video size={11} /> Teleconsulta
                            </span>
                            <p className="text-lg font-bold text-gray-900 flex items-center gap-1">{dp.name} <BadgeCheck size={16} className="text-[#407BFF]" /></p>
                            <div className="flex gap-2 mt-2">
                                <button className="text-xs font-bold text-white bg-[#407BFF] hover:bg-blue-600 px-4 py-1.5 rounded-full">Ver Perfil</button>
                                <button className="text-xs font-bold text-gray-700 border border-gray-200 px-4 py-1.5 rounded-full flex items-center gap-1"><Share2 size={13} /> Compartilhar</button>
                            </div>
                        </div>
                    </div>

                    {/* Stats */}
                    <div className="flex gap-8 mt-4 border-y border-gray-100 py-3">
                        <Stat value={dp.stats.followers} label="Seguidores" />
                        <Stat value={dp.stats.posts} label="Publicações" />
                        <Stat value={dp.stats.ratings} label="Avaliações" />
                    </div>

                    {/* Descrição */}
                    <div className="mt-4">
                        <p className="text-sm font-bold text-gray-900 mb-1">Descrição</p>
                        <p className="text-sm text-gray-600 leading-relaxed">
                            {dp.bio} <button className="text-[#407BFF] font-semibold">Ver mais</button>
                        </p>
                        <p className="text-xs text-[#407BFF] mt-2">{dp.crm}</p>
                        <div className="flex flex-wrap gap-2 mt-2">
                            <Tag>UNIMED-RJ</Tag><Tag>UNIFESP-RJ</Tag><Tag>Especialista</Tag>
                        </div>
                    </div>

                    <button
                        onClick={() => setPicking(true)}
                        className="w-full flex items-center justify-center gap-2 bg-[#407BFF] hover:bg-blue-600 text-white font-bold text-sm py-3 rounded-full mt-4 transition-colors"
                    >
                        Agendar Atendimento <ChevronRight size={16} />
                    </button>
                </div>

                {/* Avaliações */}
                <Section title="Avaliações" action="Ver todos comentários">
                    <div className="flex items-center gap-2 mb-3">
                        <span className="text-2xl font-bold text-gray-900">{dp.ratingAverage.toFixed(1)}</span>
                        <div className="flex text-amber-400">
                            {[1, 2, 3, 4, 5].map((s) => <Star key={s} size={14} className="fill-amber-400" />)}
                        </div>
                        <span className="text-xs text-gray-400">· 23 mil avaliações</span>
                    </div>
                    <div className="grid sm:grid-cols-3 gap-3">
                        {dp.reviews.map((r) => (
                            <div key={r.name} className="border border-gray-100 rounded-xl p-3">
                                <p className="text-sm font-bold text-gray-900">{r.name}</p>
                                <div className="flex text-amber-400 my-1">
                                    {Array.from({ length: r.stars }).map((_, i) => <Star key={i} size={12} className="fill-amber-400" />)}
                                </div>
                                <p className="text-xs text-gray-500 leading-snug">{r.text}</p>
                            </div>
                        ))}
                    </div>
                </Section>

                {/* Serviços oferecidos */}
                <Section title="Serviços Oferecidos">
                    <div className="flex flex-col gap-2">
                        {dp.services.map((s) => (
                            <button key={s.label} className="flex items-center gap-3 border border-gray-100 rounded-xl p-3 hover:border-[#407BFF] transition-colors text-left">
                                <span className="w-9 h-9 rounded-lg bg-[#407BFF]/10 text-[#407BFF] flex items-center justify-center"><Stethoscope size={18} /></span>
                                <div className="flex-1">
                                    <p className="text-sm font-bold text-gray-900">{s.label}</p>
                                    <p className="text-[11px] text-gray-400">{s.desc}</p>
                                </div>
                                <span className="text-xs font-semibold text-emerald-600">{s.price}</span>
                                <ChevronRight size={16} className="text-gray-300" />
                            </button>
                        ))}
                    </div>
                </Section>

                {/* Instituições vinculadas */}
                <Section title="Instituições Vinculadas" action="Ver todas as instituições">
                    <div className="flex gap-4">
                        {suggestions.slice(0, 4).map((p) => (
                            <div key={p.handle} className="flex flex-col items-center gap-1 w-16">
                                <Avatar name={p.name} size={48} />
                                <span className="text-[10px] text-gray-500 text-center truncate w-full">{p.name.split(' ')[0]}</span>
                            </div>
                        ))}
                    </div>
                </Section>

                {/* Locais de atendimento */}
                <Section title="Locais de Atendimento">
                    <div className="rounded-xl bg-gray-100 h-40 flex items-center justify-center text-gray-300 relative">
                        <MapPin size={32} className="text-[#407BFF]" />
                    </div>
                </Section>

                {/* Publicações em destaque */}
                <Section title="Publicações em destaque">
                    <div className="grid grid-cols-5 gap-2">
                        {Array.from({ length: 5 }).map((_, i) => (
                            <div key={i} className="aspect-square rounded-lg bg-gray-100 flex items-center justify-center text-gray-300">
                                <ImageIcon size={22} />
                            </div>
                        ))}
                    </div>
                </Section>
            </div>

            <SchedulePicker
                open={picking}
                onClose={() => setPicking(false)}
                onConfirm={(day, time) => agendar(day, time)}
            />
        </AppShell>
    );
}

function Stat({ value, label }: { value: string; label: string }) {
    return (
        <div>
            <p className="text-base font-bold text-gray-900">{value}</p>
            <p className="text-xs text-gray-400">{label}</p>
        </div>
    );
}

function Tag({ children }: { children: React.ReactNode }) {
    return <span className="text-[10px] font-semibold text-gray-600 bg-gray-100 px-2 py-1 rounded-full">{children}</span>;
}

function Section({ title, action, children }: { title: string; action?: string; children: React.ReactNode }) {
    return (
        <section className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 mt-3">
            <div className="flex items-center justify-between mb-3">
                <h2 className="text-sm font-bold text-gray-900">{title}</h2>
                {action && <button className="text-xs font-semibold text-[#407BFF]">{action}</button>}
            </div>
            {children}
        </section>
    );
}
