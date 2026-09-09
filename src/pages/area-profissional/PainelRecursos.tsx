import { TrendingUp, Megaphone, ChevronRight } from 'lucide-react';
import { AppShell } from '../../components/layout/AppShell';
import { PageHeader } from '../../components/layout/PageHeader';

interface Stat { label: string; value: string }
const STATS_ROW1: Stat[] = [
    { label: 'Atendimentos', value: '2.000' },
    { label: 'Pacientes', value: '1.253' },
];
const STATS_ROW2: Stat[] = [
    { label: 'Novos Seguidores', value: '2.000' },
    { label: 'Interações', value: '1.253' },
    { label: 'Visualizações', value: '1.253' },
];

const CHART = [
    { dia: 'Dom', v: 0 }, { dia: 'Seg', v: 30 }, { dia: 'Ter', v: 32 },
    { dia: 'Qua', v: 52 }, { dia: 'Qui', v: 60 }, { dia: 'Sex', v: 40 }, { dia: 'Sáb', v: 0 },
];
const CHART_MAX = 60;
const CHART_AVG = 30;
const BARS_H = 140; // altura útil da área de barras (px)

export function PainelRecursos() {
    return (
        <AppShell rightRail={null}>
            <div className="max-w-4xl mx-auto">
                <PageHeader title="Painel de Recursos" to="/meu-perfil" />

                <div className="flex flex-col gap-6 pt-2 pb-6">
                    {/* Estatísticas */}
                    <div className="flex flex-col gap-3.5">
                        <div className="flex gap-3.5">
                            {STATS_ROW1.map((s) => <StatCard key={s.label} {...s} />)}
                        </div>
                        <div className="flex gap-3.5">
                            {STATS_ROW2.map((s) => <StatCard key={s.label} {...s} />)}
                        </div>
                        <button className="self-end text-sm font-bold text-[#6F7288] underline hover:text-gray-700">
                            Ver todas as Estatísticas
                        </button>
                    </div>

                    {/* Suas Ferramentas */}
                    <div className="flex flex-col gap-4">
                        <h2 className="text-base font-bold text-gray-900">Suas Ferramentas</h2>
                        <div className="flex gap-2">
                            <ToolCard icon={<TrendingUp size={20} className="text-[#407BFF]" />} label="Trilhas de Conhecimento" />
                            <ToolCard icon={<Megaphone size={20} className="text-[#407BFF]" />} label="Ferramentas para Anúncios" />
                        </div>
                    </div>

                    {/* Gráfico: Atendimentos no mês */}
                    <div className="bg-white rounded-xl p-4 border border-gray-100">
                        <div className="flex items-center justify-between">
                            <p className="text-xs font-bold text-gray-900">Atendimentos no mês</p>
                            <p className="text-sm text-[#6F7288]">Maio</p>
                        </div>

                        <div className="relative h-[180px] mt-6">
                            {/* Linha de média (tracejada) */}
                            <div
                                className="absolute left-0 right-0 border-t-2 border-dashed border-[#A9BEF4]"
                                style={{ bottom: `${20 + (CHART_AVG / CHART_MAX) * BARS_H}px` }}
                            >
                                <span className="absolute -top-4 left-1/2 -translate-x-1/2 text-[10px] font-bold text-gray-800">{CHART_AVG}</span>
                            </div>

                            {/* Barras */}
                            <div className="absolute inset-x-0 bottom-5 flex items-end justify-between px-2" style={{ height: `${BARS_H}px` }}>
                                {CHART.map((c) => (
                                    <div key={c.dia} className="flex flex-col items-center justify-end" style={{ width: 34 }}>
                                        <div
                                            className="w-full bg-[#407BFF] rounded-t-lg flex items-start justify-center pt-1"
                                            style={{ height: `${Math.max((c.v / CHART_MAX) * BARS_H, c.v > 0 ? 16 : 0)}px` }}
                                        >
                                            {c.v > 0 && <span className="text-[8px] font-bold text-white">{c.v}</span>}
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Base */}
                            <div className="absolute left-0 right-0 bottom-5 h-0.5 bg-[#BAC2D5]" />

                            {/* Dias */}
                            <div className="absolute inset-x-0 bottom-0 flex justify-between px-2 text-[9px] font-bold text-[#6F7288]">
                                {CHART.map((c) => <span key={c.dia} className="w-[34px] text-center">{c.dia}</span>)}
                            </div>
                        </div>

                        {/* Legenda */}
                        <div className="flex items-center justify-center gap-4 mt-3">
                            <div className="flex items-center gap-2">
                                <span className="w-3 border-t-2 border-dashed border-[#A9BEF4]" />
                                <span className="text-xs font-semibold text-[#6F7288]">Média mensal</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <span className="w-3 h-1.5 rounded bg-[#407BFF]" />
                                <span className="text-xs font-semibold text-[#6F7288]">Atendimentos por dia</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AppShell>
    );
}

function StatCard({ label, value }: Stat) {
    return (
        <div className="flex-1 bg-white rounded-xl p-4 border border-gray-100 flex flex-col gap-3">
            <p className="text-[10px] font-semibold text-[#6F7288]">{label}</p>
            <p className="text-lg font-bold text-gray-900">{value}</p>
        </div>
    );
}

function ToolCard({ icon, label }: { icon: React.ReactNode; label: string }) {
    return (
        <button className="flex-1 bg-white rounded-xl px-4 py-6 border border-gray-100 flex items-center gap-4 hover:border-[#407BFF] transition-colors text-left">
            {icon}
            <span className="flex-1 text-sm font-bold text-gray-900">{label}</span>
            <ChevronRight size={16} className="text-gray-300" />
        </button>
    );
}
