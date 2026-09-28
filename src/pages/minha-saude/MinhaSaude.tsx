import { useMemo, useState } from 'react';
import {
    CalendarDays, History, FileText, FileCheck2, HeartPulse,
    Search, Menu, MapPin, ChevronDown, Mic, Stethoscope, FlaskConical, HeartHandshake,
    BadgeCheck, Star, ChevronRight, Crown,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { AppShell } from '../../components/layout/AppShell';
import { PageHeader } from '../../components/layout/PageHeader';
import { Avatar } from '../../components/ui/Avatar';
import { PatrocinadoRail } from '../../components/health/PatrocinadoRail';
import { useProfissionais, money, type Prof } from '../../hooks/useProfissionais';

/* ─── Tiles de acesso rápido às sub-seções de saúde ─── */
const TILES = [
    { to: '/minha-saude/agendamentos', icon: CalendarDays, label: 'Agenda', bg: 'bg-[#DDE3FB]', fg: 'text-[#3A56C4]' },
    { to: '/minha-saude/historico', icon: History, label: 'Histórico', bg: 'bg-[#CFEDE7]', fg: 'text-[#127C68]' },
    { to: '/minha-saude/exames', icon: FileText, label: 'Resultados', bg: 'bg-[#FBDADE]', fg: 'text-[#C0344B]' },
    { to: '/minha-saude/documentos', icon: FileCheck2, label: 'Prescrições e atestados', bg: 'bg-[#FBEFC8]', fg: 'text-[#A9822A]' },
    { to: '/minha-saude/informacoes', icon: HeartPulse, label: 'Dados Saúde', bg: 'bg-[#E5DCFB]', fg: 'text-[#6E45C4]' },
] as const;

const CATEGORIES = [
    { key: 'consultas', label: 'Consultas', icon: Stethoscope },
    { key: 'exames', label: 'Exames', icon: FlaskConical },
    { key: 'cuidadores', label: 'Cuidadores', icon: HeartHandshake },
] as const;

export function MinhaSaude() {
    const navigate = useNavigate();
    const [cat, setCat] = useState<(typeof CATEGORIES)[number]['key']>('consultas');
    const [term, setTerm] = useState('');
    const { data: profs } = useProfissionais();

    const filtered = useMemo(() => {
        const q = term.trim().toLowerCase();
        if (!q) return profs;
        return profs.filter((p) => p.nome.toLowerCase().includes(q) || p.especialidade.toLowerCase().includes(q));
    }, [profs, term]);

    const featured = filtered[0];
    const destaque = filtered.slice(0, 4);

    // Agrupa por especialidade para as trilhas por categoria.
    const groups = useMemo(() => {
        const map = new Map<string, Prof[]>();
        for (const p of filtered) {
            const k = p.especialidade || 'Outros';
            (map.get(k) ?? map.set(k, []).get(k)!).push(p);
        }
        return Array.from(map.entries());
    }, [filtered]);

    return (
        <AppShell rightRail={<PatrocinadoRail />}>
            <div className="max-w-3xl mx-auto">
                <PageHeader
                    title="Minha Saúde"
                    to="/inicio"
                    right={
                        <button className="w-9 h-9 rounded-full border border-gray-200 flex items-center justify-center text-gray-500 hover:bg-gray-50">
                            <Menu size={18} />
                        </button>
                    }
                />

                {/* Tiles de acesso rápido */}
                <div className="grid grid-cols-3 sm:grid-cols-5 gap-3">
                    {TILES.map(({ to, icon: Icon, label, bg, fg }) => (
                        <button
                            key={to}
                            onClick={() => navigate(to)}
                            className={`${bg} rounded-2xl p-3 h-24 flex flex-col justify-between text-left hover:brightness-95 transition`}
                        >
                            <Icon size={22} className={fg} />
                            <span className={`text-xs font-bold leading-tight ${fg}`}>{label}</span>
                        </button>
                    ))}
                </div>

                {/* Buscar Atendimentos */}
                <h2 className="text-base font-bold text-gray-900 mt-6 mb-3">Buscar Atendimentos</h2>
                <div className="flex gap-2 mb-3">
                    {CATEGORIES.map(({ key, label, icon: Icon }) => (
                        <button
                            key={key}
                            onClick={() => setCat(key)}
                            className={`flex items-center gap-1.5 text-sm font-semibold px-4 py-2 rounded-full border transition-colors ${
                                cat === key
                                    ? 'bg-emerald-500 text-white border-emerald-500'
                                    : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50'
                            }`}
                        >
                            <Icon size={15} /> {label}
                        </button>
                    ))}
                </div>

                <div className="flex items-center gap-2 bg-white border border-gray-200 rounded-xl px-2 py-1.5 mb-6">
                    <button className="flex items-center gap-1 text-sm text-gray-600 font-medium px-2 py-1.5 shrink-0">
                        <MapPin size={15} className="text-[#407BFF]" /> Belém- PA <ChevronDown size={14} className="text-gray-400" />
                    </button>
                    <span className="w-px h-6 bg-gray-200" />
                    <div className="flex items-center gap-2 flex-1 min-w-0 px-1">
                        <Search size={16} className="text-gray-400 shrink-0" />
                        <input
                            value={term}
                            onChange={(e) => setTerm(e.target.value)}
                            placeholder="Busque por especialidade, profissional..."
                            className="flex-1 min-w-0 bg-transparent text-sm outline-none placeholder:text-gray-400"
                        />
                    </div>
                    <button className="text-gray-400 hover:text-[#407BFF] shrink-0 px-1"><Mic size={16} /></button>
                </div>

                {/* Profissional em destaque (patrocinado) */}
                {featured ? (
                    <>
                        <p className="text-[11px] text-gray-400 mb-1">Patrocinado</p>
                        <FeaturedCard prof={featured} onOpen={() => navigate(`/perfil-profissional/${featured.id}`)} />
                    </>
                ) : (
                    <div className="bg-white border border-gray-100 rounded-2xl p-8 text-center text-sm text-gray-400">
                        Nenhum profissional disponível no momento.
                    </div>
                )}

                {/* Profissionais em destaque */}
                {destaque.length > 0 && (
                    <section className="mt-6">
                        <div className="flex items-end justify-between mb-3">
                            <div>
                                <h3 className="text-base font-bold text-gray-900">Profissionais em destaque</h3>
                                <p className="text-xs text-gray-400">{featured?.especialidade ?? 'Clínica Geral'}</p>
                            </div>
                            <button className="text-xs font-semibold text-[#407BFF] flex items-center gap-0.5 hover:underline">
                                Ver lista completa <ChevronRight size={13} />
                            </button>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            {destaque.map((p) => (
                                <ProfCard key={p.id} prof={p} onOpen={() => navigate(`/perfil-profissional/${p.id}`)} />
                            ))}
                        </div>
                    </section>
                )}

                {/* Trilhas por especialidade */}
                {groups.slice(0, 4).map(([esp, list]) => (
                    <section key={esp} className="mt-6">
                        <h3 className="text-base font-bold text-gray-900">{esp}</h3>
                        <p className="text-xs text-gray-400 mb-3">Profissionais e clínicas de {esp}.</p>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            {list.slice(0, 4).map((p) => (
                                <ProfCard key={p.id} prof={p} onOpen={() => navigate(`/perfil-profissional/${p.id}`)} />
                            ))}
                        </div>
                    </section>
                ))}
            </div>
        </AppShell>
    );
}

/* ─── Card do profissional em destaque (borda verde + patrocínio) ─── */
function FeaturedCard({ prof, onOpen }: { prof: Prof; onOpen: () => void }) {
    return (
        <button
            onClick={onOpen}
            className="w-full text-left bg-white rounded-2xl border-2 border-emerald-400 shadow-sm p-4 pt-6 relative hover:shadow-md transition-shadow"
        >
            <span className="absolute -top-3 left-1/2 -translate-x-1/2 flex items-center gap-1 bg-emerald-500 text-white text-[10px] font-bold px-3 py-1 rounded-full whitespace-nowrap">
                <Crown size={11} /> Profissional em Destaque
            </span>
            <div className="flex items-start justify-between gap-3">
                <div className="flex items-start gap-3 min-w-0">
                    <Avatar name={prof.nome} size={52} ring />
                    <div className="min-w-0">
                        <p className="text-sm font-bold text-gray-900 flex items-center gap-1 truncate">
                            {prof.nome} <BadgeCheck size={14} className="text-[#407BFF] shrink-0" />
                        </p>
                        <p className="text-xs text-gray-500 flex items-center gap-1"><Stethoscope size={12} /> {prof.especialidade}</p>
                        <p className="text-xs text-gray-500 flex items-center gap-1 mt-0.5">
                            <Star size={12} className="fill-amber-400 text-amber-400" /> 4.8 <span className="text-gray-400">4.876 Avaliações</span>
                        </p>
                        <div className="flex flex-wrap gap-1.5 mt-2">
                            {prof.modalidades.map((m) => (
                                <span key={m} className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${/tele/i.test(m) ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-500'}`}>{m}</span>
                            ))}
                        </div>
                    </div>
                </div>
                <div className="text-right shrink-0">
                    <p className="text-[11px] text-gray-400">A partir de</p>
                    <p className="text-lg font-extrabold text-gray-900">{prof.preco ? money(prof.preco) : '—'}</p>
                </div>
            </div>
        </button>
    );
}

/* ─── Card compacto de profissional ─── */
function ProfCard({ prof, onOpen }: { prof: Prof; onOpen: () => void }) {
    return (
        <button
            onClick={onOpen}
            className="flex items-center gap-3 bg-white border border-gray-100 shadow-sm rounded-2xl p-3 text-left hover:border-[#407BFF] transition-colors"
        >
            <Avatar name={prof.nome} size={48} />
            <div className="flex-1 min-w-0">
                <p className="text-sm font-bold text-gray-900 flex items-center gap-1 truncate">
                    {prof.nome} <BadgeCheck size={13} className="text-[#407BFF] shrink-0" />
                </p>
                <p className="text-[11px] text-gray-500 flex items-center gap-1 truncate"><Stethoscope size={11} /> {prof.especialidade}</p>
                <div className="flex flex-wrap gap-1 mt-1.5">
                    {prof.modalidades.map((m) => (
                        <span key={m} className={`text-[9px] font-semibold px-1.5 py-0.5 rounded-full ${/tele/i.test(m) ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-500'}`}>{m}</span>
                    ))}
                </div>
            </div>
            <div className="text-right shrink-0">
                <p className="text-[10px] text-gray-400">A partir de</p>
                <p className="text-sm font-bold text-gray-900">{prof.preco ? money(prof.preco) : '—'}</p>
            </div>
        </button>
    );
}
