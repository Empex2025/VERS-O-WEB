import { useState } from 'react';
import { BadgeCheck, Video, Copy, Menu, X, LifeBuoy, CalendarClock, Ban, CalendarDays, ChevronRight } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import { AppShell } from '../../components/layout/AppShell';
import { PageHeader } from '../../components/layout/PageHeader';
import { Avatar } from '../../components/ui/Avatar';
import { appointments } from '../../data/health';
import { teleconsultaService } from '../../services/teleconsultaService';

export function AgendamentoDetalhe() {
    const { id } = useParams();
    const navigate = useNavigate();
    const appt = appointments.find((a) => a.id === id) ?? appointments[0];
    const [menuOpen, setMenuOpen] = useState(false);
    const [confirmCancel, setConfirmCancel] = useState(false);
    const isTele = appt.channel === 'Teleconsulta';

    return (
        <AppShell>
            <div className="max-w-2xl mx-auto">
                <PageHeader
                    title="Atendimento Agendado"
                    to="/minha-saude/agendamentos"
                    right={
                        <div className="flex items-center gap-2">
                            <span className="bg-emerald-500 text-white text-[10px] font-bold px-2.5 py-1 rounded-full">Inicia em 3 min</span>
                            <button onClick={() => setMenuOpen(true)} className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 hover:bg-gray-200"><Menu size={16} /></button>
                        </div>
                    }
                />

                <div className="flex flex-col gap-3">
                    {/* Profissional + entrar na sala */}
                    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <Avatar name={appt.professional} size={44} />
                                <div>
                                    <p className="text-sm font-bold text-gray-900 flex items-center gap-1">{appt.professional} <BadgeCheck size={14} className="text-[#407BFF]" /></p>
                                    <p className="text-xs text-gray-400">{appt.role}</p>
                                </div>
                            </div>
                            <span className="text-xs font-semibold text-gray-500">{appt.channel}</span>
                        </div>
                        {isTele && (
                            <button onClick={() => navigate('/minha-saude/consulta')} className="w-full flex items-center justify-center gap-2 bg-[#407BFF] hover:bg-blue-600 text-white font-bold text-sm py-3 rounded-xl mt-4 transition-colors">
                                <Video size={16} /> Entrar na Sala de Atendimento
                            </button>
                        )}
                    </div>

                    {/* Data + lembrete */}
                    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
                        <div className="flex items-center gap-2">
                            <CalendarDays size={16} className="text-gray-400" />
                            <div>
                                <p className="text-[11px] text-gray-400">Data do Atendimento</p>
                                <p className="text-sm font-bold text-gray-900 capitalize">{appt.date}</p>
                            </div>
                        </div>
                        <label className="flex items-center gap-2 mt-4 text-xs text-gray-600 cursor-pointer">
                            <input type="checkbox" defaultChecked className="accent-[#407BFF] w-4 h-4 rounded" />
                            Lembrar 15 minutos antes do início do atendimento
                        </label>
                    </div>

                    {/* Código da sala */}
                    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
                        <p className="text-[11px] text-gray-400">Código da Sala</p>
                        <div className="flex items-center gap-2 mt-1">
                            <span className="text-sm font-bold text-[#407BFF] underline">4S59-BE2025</span>
                            <button className="text-gray-400 hover:text-[#407BFF]"><Copy size={14} /></button>
                        </div>
                        <p className="text-[11px] text-gray-400 mt-2">A sala estará disponível 10 minutos antes do início do atendimento.</p>
                    </div>

                    {/* Pré-consulta */}
                    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
                        <p className="text-xs text-gray-500">A profissional enviou perguntas Pré Consulta para você</p>
                        <button onClick={() => navigate('/minha-saude/pre-consulta')} className="w-full mt-2 bg-[#407BFF]/10 text-[#407BFF] text-sm font-bold py-3 rounded-xl hover:bg-[#407BFF]/15 transition-colors">
                            Responder Perguntas Pré Consulta
                        </button>
                    </div>

                    {/* Pagamentos */}
                    <h2 className="text-base font-bold text-gray-900 mt-2">Pagamentos</h2>
                    <div className="grid grid-cols-2 gap-3">
                        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
                            <p className="text-[11px] text-gray-400">Valor do Atendimento</p>
                            <p className="text-sm font-bold text-gray-900 mt-0.5">{appt.price || 'R$ 50,90'}</p>
                        </div>
                        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
                            <p className="text-[11px] text-gray-400">Parcelas</p>
                            <p className="text-sm font-bold text-gray-900 mt-0.5">2x de R$ 25,45</p>
                        </div>
                    </div>
                    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 flex items-center justify-between">
                        <div>
                            <p className="text-[11px] text-gray-400">Método de Pagamento</p>
                            <p className="text-sm font-bold text-gray-900 mt-0.5">Cartão de Crédito</p>
                            <p className="text-[11px] text-gray-400">**** **** **** 4567 · Cartão Inter</p>
                        </div>
                        <div className="flex -space-x-1.5">
                            <span className="w-6 h-6 rounded-full bg-red-500" />
                            <span className="w-6 h-6 rounded-full bg-amber-400" />
                        </div>
                    </div>
                </div>
            </div>

            {/* Menu */}
            {menuOpen && (
                <div className="fixed inset-0 z-50 bg-black/30 backdrop-blur-sm flex items-center justify-center p-4" onClick={() => setMenuOpen(false)}>
                    <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-5" onClick={(e) => e.stopPropagation()}>
                        <div className="flex items-start justify-between mb-4">
                            <div>
                                <p className="text-base font-bold text-gray-900">{appt.type} em {(appt.date.split(',')[1] ?? appt.date).trim()}</p>
                                <p className="text-xs text-gray-400">Agendada</p>
                            </div>
                            <button onClick={() => setMenuOpen(false)} className="text-gray-400 hover:text-gray-600"><X size={20} /></button>
                        </div>
                        <div className="flex flex-col gap-2">
                            <MenuRow icon={<LifeBuoy size={18} className="text-[#407BFF]" />} label="Ajuda e Suporte" onClick={() => setMenuOpen(false)} />
                            <MenuRow icon={<CalendarClock size={18} className="text-[#407BFF]" />} label="Reagendar Atendimento" onClick={() => navigate('/minha-saude/reagendar')} />
                            <MenuRow icon={<Ban size={18} className="text-rose-500" />} label="Cancelar Agendamento" danger onClick={() => { setMenuOpen(false); setConfirmCancel(true); }} />
                        </div>
                    </div>
                </div>
            )}

            {/* Confirmação de cancelamento */}
            {confirmCancel && (
                <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4">
                    <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6 text-center relative">
                        <button onClick={() => setConfirmCancel(false)} className="absolute top-4 right-4 text-gray-400"><X size={18} /></button>
                        <h3 className="text-base font-bold text-gray-900 mt-2">Você tem certeza que deseja cancelar o atendimento?</h3>
                        <p className="text-sm text-gray-500 mt-2">
                            O cancelamento com a Dra. Maria Glenda até 24 horas antes será reembolsado. Após esse período, será cobrada uma taxa de 15% do valor do atendimento.
                        </p>
                        <div className="grid grid-cols-2 gap-3 mt-6">
                            <button onClick={() => setConfirmCancel(false)} className="bg-rose-50 text-rose-500 font-bold text-sm py-3 rounded-full hover:bg-rose-100 transition-colors">Voltar</button>
                            <button
                                onClick={() => {
                                    if (id) teleconsultaService.agendamentos.cancelar(id).catch(() => {});
                                    setConfirmCancel(false);
                                    navigate('/minha-saude/agendamentos');
                                }}
                                className="bg-rose-500 hover:bg-rose-600 text-white font-bold text-sm py-3 rounded-full transition-colors"
                            >
                                Sim, Cancelar
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </AppShell>
    );
}

function MenuRow({ icon, label, danger, onClick }: { icon: React.ReactNode; label: string; danger?: boolean; onClick?: () => void }) {
    return (
        <button onClick={onClick} className={`w-full flex items-center gap-3 rounded-xl px-4 py-3.5 text-left transition-colors ${danger ? 'bg-rose-50 hover:bg-rose-100' : 'bg-[#F3F4F6] hover:bg-gray-200/70'}`}>
            {icon}
            <span className={`flex-1 text-sm font-bold ${danger ? 'text-rose-500' : 'text-gray-800'}`}>{label}</span>
            <ChevronRight size={16} className={danger ? 'text-rose-300' : 'text-gray-400'} />
        </button>
    );
}
