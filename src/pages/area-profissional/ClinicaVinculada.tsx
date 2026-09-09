import { useState } from 'react';
import { MoreHorizontal, BadgeCheck, FlaskConical, Star, ChevronLeft, ChevronRight } from 'lucide-react';
import { AppShell } from '../../components/layout/AppShell';
import { PageHeader } from '../../components/layout/PageHeader';
import { Avatar } from '../../components/ui/Avatar';

const WEEK = [
    { d: 'Sex', n: 25, dot: false }, { d: 'Sab', n: 26, dot: false }, { d: 'Dom', n: 27, dot: false },
    { d: 'Seg', n: 28, dot: false }, { d: 'Ter', n: 29, dot: true }, { d: 'Qua', n: 30, dot: true }, { d: 'Qui', n: 31, dot: true },
];
const ATEND = [
    { nome: 'Carlos Magno de Souza', tipo: 'Consulta Geral', hora: '8:30 às 9:00' },
    { nome: 'Carlos Magno de Souza', tipo: 'Consulta Geral', hora: '9:30 às 10:00' },
    { nome: 'Carlos Magno de Souza', tipo: 'Consulta Geral', hora: '16:30 às 17:00' },
];

export function ClinicaVinculada() {
    const [sel, setSel] = useState(28);

    return (
        <AppShell rightRail={null}>
            <div className="max-w-4xl mx-auto">
                <PageHeader
                    title="Clínica Vinculada"
                    to="/area-profissional/vinculos"
                    right={<button className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-500"><MoreHorizontal size={16} /></button>}
                />

                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 sm:p-6 flex flex-col gap-6">
                    {/* Cabeçalho da clínica */}
                    <div className="flex items-center gap-4">
                        <div className="w-16 h-16 rounded-2xl bg-violet-500 flex items-center justify-center">
                            <Avatar name="Clínica Mais Saúde" size={56} />
                        </div>
                        <div>
                            <p className="text-lg font-bold text-gray-900 flex items-center gap-1">Clínica Mais Saúde <BadgeCheck size={16} className="text-[#407BFF]" /></p>
                            <span className="inline-flex items-center gap-1 bg-violet-500 text-white text-[11px] font-bold px-2.5 py-1 rounded-full mt-1">
                                <FlaskConical size={11} /> Exames Laboratoriais
                            </span>
                        </div>
                    </div>

                    {/* Estatísticas */}
                    <div>
                        <h2 className="text-sm font-bold text-gray-900 mb-3">Estatísticas na Clínica</h2>
                        <div className="grid grid-cols-3 gap-3">
                            <StatCard label="Atendimentos" value="200" />
                            <StatCard label="Pacientes" value="157" />
                            <StatCard label="Avaliações" value="4.95" star />
                        </div>
                    </div>

                    {/* Próximos atendimentos */}
                    <div>
                        <h2 className="text-sm font-bold text-gray-900 mb-3">Próximos Atendimentos</h2>
                        <div className="flex items-center gap-2 bg-[#F9FAFB] rounded-xl p-2">
                            <button className="w-8 h-8 rounded-full bg-[#407BFF] text-white flex items-center justify-center shrink-0"><ChevronLeft size={16} /></button>
                            <div className="flex-1 grid grid-cols-7">
                                {WEEK.map((w) => (
                                    <button key={w.n} onClick={() => setSel(w.n)} className="flex flex-col items-center gap-1 py-1">
                                        <span className="text-[11px] text-gray-500 font-medium">{w.d}</span>
                                        <span className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold ${sel === w.n ? 'bg-[#407BFF] text-white' : 'text-gray-700 hover:bg-gray-100'}`}>{w.n}</span>
                                        <span className={`w-1 h-1 rounded-full ${w.dot ? 'bg-emerald-500' : 'bg-transparent'}`} />
                                    </button>
                                ))}
                            </div>
                            <button className="w-8 h-8 rounded-full bg-[#407BFF] text-white flex items-center justify-center shrink-0"><ChevronRight size={16} /></button>
                        </div>

                        <p className="text-xs text-gray-400 text-right mt-4 mb-2">Segunda, {sel} de Abril</p>
                        <div className="flex flex-col gap-2">
                            {ATEND.map((a, i) => (
                                <div key={i} className="flex items-center justify-between bg-[#F9FAFB] rounded-xl px-4 py-3">
                                    <div>
                                        <p className="text-sm font-bold text-gray-900">{a.nome}</p>
                                        <p className="text-xs text-gray-400">{a.tipo}</p>
                                    </div>
                                    <span className="text-sm font-semibold text-gray-700">{a.hora}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </AppShell>
    );
}

function StatCard({ label, value, star }: { label: string; value: string; star?: boolean }) {
    return (
        <div className="bg-[#F9FAFB] rounded-xl p-4">
            <p className="text-[10px] font-semibold text-gray-500">{label}</p>
            <p className="text-lg font-bold text-gray-900 mt-2 flex items-center gap-1">
                {star && <Star size={14} className="fill-amber-400 text-amber-400" />}{value}
            </p>
        </div>
    );
}
