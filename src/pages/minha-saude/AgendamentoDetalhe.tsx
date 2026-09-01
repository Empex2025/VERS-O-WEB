import { useState } from 'react';
import { BadgeCheck, Video, Copy, MoreHorizontal, X, HelpCircle, CalendarClock, Ban } from 'lucide-react';
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
                    right={<button onClick={() => setMenuOpen(true)} className="text-gray-600 hover:text-[#407BFF]"><MoreHorizontal size={20} /></button>}
                />

                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
                    {/* Profissional */}
                    <div className="flex items-center gap-3">
                        <Avatar name={appt.professional} size={48} />
                        <div className="flex-1">
                            <p className="text-sm font-bold text-gray-900 flex items-center gap-1">
                                {appt.professional} <BadgeCheck size={14} className="text-emerald-500" />
                            </p>
                            <p className="text-xs text-gray-400">{appt.role}</p>
                        </div>
                        <span className="text-xs font-semibold text-emerald-600 flex items-center gap-1">
                            {appt.channel}
                        </span>
                    </div>

                    {/* Entrar na sala (teleconsulta) */}
                    {isTele && (
                        <button
                            onClick={() => navigate('/minha-saude/consulta')}
                            className="w-full flex items-center justify-center gap-2 bg-[#407BFF] hover:bg-blue-600 text-white font-bold text-sm py-3 rounded-xl mt-4 transition-colors"
                        >
                            <Video size={18} /> Entrar na Sala de Atendimento
                        </button>
                    )}

                    {/* Data */}
                    <div className="mt-4 bg-[#F3F4F6] rounded-xl p-3">
                        <p className="text-xs text-gray-400">Data e Horário</p>
                        <p className="text-sm font-bold text-gray-900">{appt.date} às {appt.time}</p>
                    </div>

                    <label className="flex items-center gap-2 mt-3 text-xs text-gray-500">
                        <input type="checkbox" defaultChecked className="accent-[#407BFF]" />
                        Lembre-me 15 minutos antes
                    </label>

                    {/* Código */}
                    <div className="mt-4">
                        <p className="text-xs text-gray-400">Código do Atendimento</p>
                        <div className="flex items-center gap-2 mt-1">
                            <span className="text-sm font-bold text-gray-800">4009-BE2025</span>
                            <button className="text-gray-400 hover:text-[#407BFF]"><Copy size={14} /></button>
                        </div>
                    </div>

                    {/* Pagamento */}
                    <div className="mt-5 pt-4 border-t border-gray-100">
                        <p className="text-sm font-bold text-gray-900 mb-2">Pagamentos</p>
                        <div className="flex items-center justify-between text-xs">
                            <span className="text-gray-500">Valor do atendimento</span>
                            <span className="font-bold text-gray-900">{appt.price}</span>
                        </div>
                        <div className="flex items-center justify-between text-xs mt-1">
                            <span className="text-gray-500">Parcelas</span>
                            <span className="text-gray-700">2x de R$ 25,45</span>
                        </div>
                        <div className="flex items-center gap-2 mt-3">
                            <span className="w-7 h-5 rounded bg-gradient-to-r from-red-500 to-amber-400" />
                            <span className="text-xs text-gray-500">Cartão de Crédito · final 4321</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Menu */}
            {menuOpen && (
                <div className="fixed inset-0 z-40 bg-black/30 flex items-center justify-center p-4" onClick={() => setMenuOpen(false)}>
                    <div className="bg-white rounded-2xl shadow-xl w-full max-w-xs overflow-hidden" onClick={(e) => e.stopPropagation()}>
                        <div className="flex items-center justify-between p-4 border-b border-gray-100">
                            <h3 className="font-bold text-gray-900 text-sm">{appt.type} em {appt.date.split(',')[1] ?? appt.date}</h3>
                            <button onClick={() => setMenuOpen(false)} className="text-gray-400"><X size={18} /></button>
                        </div>
                        <MenuRow icon={<HelpCircle size={18} />} label="Ajuda e Suporte" />
                        <MenuRow icon={<CalendarClock size={18} />} label="Reagendar atendimento" onClick={() => navigate('/minha-saude/reagendar')} />
                        <MenuRow icon={<Ban size={18} />} label="Cancelar Agendamento" danger onClick={() => { setMenuOpen(false); setConfirmCancel(true); }} />
                    </div>
                </div>
            )}

            {/* Confirmação de cancelamento */}
            {confirmCancel && (
                <div className="fixed inset-0 z-40 bg-black/40 flex items-center justify-center p-4">
                    <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm p-6 text-center relative">
                        <button onClick={() => setConfirmCancel(false)} className="absolute top-4 right-4 text-gray-400"><X size={18} /></button>
                        <h3 className="text-base font-bold text-gray-900 mt-2">Você tem certeza que deseja cancelar o atendimento?</h3>
                        <p className="text-sm text-gray-500 mt-2">
                            O cancelamento com a Dra. Maria Glenda até 24 horas antes será reembolsado. Após esse período, será cobrada uma taxa de 15% do valor do atendimento.
                        </p>
                        <button
                            onClick={() => {
                                if (id) teleconsultaService.agendamentos.cancelar(id).catch(() => {});
                                setConfirmCancel(false);
                                navigate('/minha-saude/agendamentos');
                            }}
                            className="w-full mt-5 bg-rose-500 hover:bg-rose-600 text-white font-bold text-sm py-3 rounded-full transition-colors"
                        >
                            Sim, Cancelar
                        </button>
                        <button onClick={() => setConfirmCancel(false)} className="w-full mt-2 text-gray-500 font-semibold text-sm py-2">Voltar</button>
                    </div>
                </div>
            )}
        </AppShell>
    );
}

function MenuRow({ icon, label, danger, onClick }: { icon: React.ReactNode; label: string; danger?: boolean; onClick?: () => void }) {
    return (
        <button onClick={onClick} className={`w-full flex items-center gap-3 px-4 py-3.5 text-sm font-medium hover:bg-gray-50 transition-colors ${danger ? 'text-rose-500' : 'text-gray-700'}`}>
            {icon} {label}
        </button>
    );
}
