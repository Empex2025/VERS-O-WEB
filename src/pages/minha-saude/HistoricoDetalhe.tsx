import { useState } from 'react';
import { Menu, BadgeCheck, Stethoscope, CalendarDays, Clock, X, Star, Headset, RotateCcw, ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { AppShell } from '../../components/layout/AppShell';
import { PageHeader } from '../../components/layout/PageHeader';
import { Avatar } from '../../components/ui/Avatar';

export function HistoricoDetalhe() {
    const navigate = useNavigate();
    const [menu, setMenu] = useState(false);

    return (
        <AppShell>
            <div className="max-w-2xl mx-auto">
                <PageHeader
                    title="Atendimento Concluído"
                    to="/minha-saude/historico"
                    right={<button onClick={() => setMenu(true)} className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 hover:bg-gray-200"><Menu size={16} /></button>}
                />

                <div className="flex flex-col gap-3">
                    {/* Profissional */}
                    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <Avatar name="Dra. Maria Glenda" size={40} />
                                <div>
                                    <p className="text-sm font-bold text-gray-900 flex items-center gap-1">Dra. Maria Glenda <BadgeCheck size={14} className="text-[#407BFF]" /></p>
                                    <p className="text-xs text-gray-400 flex items-center gap-1"><Stethoscope size={11} /> Clínico Geral</p>
                                </div>
                            </div>
                            <span className="text-xs font-semibold text-gray-500 flex items-center gap-1">Retorno Disponível <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" /></span>
                        </div>
                        <div className="flex items-center justify-between mt-4 pt-3 border-t border-gray-100">
                            <span className="text-sm font-bold text-gray-900">Consulta Geral</span>
                            <span className="text-[11px] font-bold px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-600">Concluído</span>
                        </div>
                    </div>

                    <button onClick={() => navigate('/minha-saude/agendar-retorno')} className="w-full bg-[#407BFF] hover:bg-blue-600 text-white text-sm font-bold py-3.5 rounded-xl transition-colors">
                        Agendar Retorno
                    </button>

                    <Info label="Código do Atendimento" value="4S59-BE2025" />
                    <Info label="Data do Atendimento" value="Quarta, 23 de Abril" icon={<CalendarDays size={16} className="text-gray-400" />} />
                    <div className="grid grid-cols-2 gap-3">
                        <Info label="Início do Atendimento" value="8:31:17" icon={<Clock size={16} className="text-gray-400" />} />
                        <Info label="Duração" value="1:35:42" />
                    </div>

                    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
                        <p className="text-[11px] text-gray-400">Comentários do Profissional</p>
                        <p className="text-sm font-bold text-gray-900 mt-0.5">Sem comentários</p>
                        <p className="text-xs text-gray-400 mt-4">Há 02 documentos disponíveis neste Atendimentos</p>
                        <button onClick={() => navigate('/minha-saude/documentos')} className="w-full mt-2 bg-[#407BFF]/10 text-[#407BFF] text-sm font-bold py-3 rounded-xl hover:bg-[#407BFF]/15 transition-colors">
                            Ver Documentos Disponíveis
                        </button>
                    </div>

                    {/* Pagamentos */}
                    <h2 className="text-base font-bold text-gray-900 mt-2">Pagamentos</h2>
                    <div className="grid grid-cols-2 gap-3">
                        <Info label="Valor do Atendimento" value="R$ 50,90" />
                        <Info label="Parcelas" value="2x de R$ 25,45" />
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

            {/* Menu do atendimento */}
            {menu && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm px-4" onClick={() => setMenu(false)}>
                    <div onClick={(e) => e.stopPropagation()} className="bg-white rounded-2xl w-full max-w-md p-5 shadow-xl">
                        <div className="flex items-start justify-between mb-4">
                            <div>
                                <p className="text-base font-bold text-gray-900">Consulta Geral em 23 de Abril</p>
                                <p className="text-xs text-gray-400">Concluída</p>
                            </div>
                            <button onClick={() => setMenu(false)} className="text-gray-400 hover:text-gray-600"><X size={20} /></button>
                        </div>
                        <div className="flex flex-col gap-2">
                            <MenuRow icon={<Star size={18} className="text-[#407BFF]" />} label="Avaliação" onClick={() => { setMenu(false); navigate('/minha-saude/pos-consulta'); }} />
                            <MenuRow icon={<Headset size={18} className="text-[#407BFF]" />} label="Ajuda e Suporte" onClick={() => setMenu(false)} />
                            <MenuRow icon={<RotateCcw size={18} className="text-rose-500" />} label="Retomar Atendimento" danger onClick={() => setMenu(false)} />
                        </div>
                        <button onClick={() => { setMenu(false); navigate('/minha-saude/pre-consulta'); }} className="w-full mt-4 bg-[#407BFF] hover:bg-blue-600 text-white text-sm font-bold py-3 rounded-full transition-colors">
                            Responder Perguntas Pré Consulta
                        </button>
                    </div>
                </div>
            )}
        </AppShell>
    );
}

function Info({ label, value, icon }: { label: string; value: string; icon?: React.ReactNode }) {
    return (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 flex items-center gap-2">
            {icon}
            <div>
                <p className="text-[11px] text-gray-400">{label}</p>
                <p className="text-sm font-bold text-gray-900 mt-0.5">{value}</p>
            </div>
        </div>
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
