import { useState } from 'react';
import { Eye, ChevronRight, MoreHorizontal, Headset, X } from 'lucide-react';
import { AppShell } from '../../components/layout/AppShell';
import { PageHeader } from '../../components/layout/PageHeader';

const HISTORICO = Array.from({ length: 5 }).map(() => ({ tipo: 'Teleconsulta', data: '04 de junho às 16:53', valor: '50,90' }));

export function Financeiro() {
    const [pixOpen, setPixOpen] = useState(false);

    return (
        <AppShell rightRail={null}>
            <div className="max-w-4xl mx-auto">
                <PageHeader
                    title="Financeiro"
                    to="/area-profissional"
                    right={<button className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-500"><MoreHorizontal size={16} /></button>}
                />

                <div className="flex flex-col gap-6 pt-2">
                    {/* Faturamento */}
                    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
                        <div className="flex items-start justify-between">
                            <div>
                                <div className="flex items-center gap-1.5 text-[#6F7288]">
                                    <span className="text-sm font-semibold">Seu Faturamento</span>
                                    <Eye size={14} />
                                </div>
                                <p className="text-2xl font-bold text-gray-900 mt-1">
                                    <span className="text-sm align-top">R$ </span>10.265,32
                                </p>
                            </div>
                            <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full">+15% este mês</span>
                        </div>
                        <button onClick={() => setPixOpen(true)} className="text-sm font-bold text-gray-800 underline flex items-center gap-1 mt-4">
                            Gerenciar Chave PIX <ChevronRight size={14} />
                        </button>
                    </div>

                    {/* Histórico */}
                    <div>
                        <h2 className="text-sm font-bold text-gray-900 mb-3">Histórico de Faturamento</h2>
                        <div className="flex flex-col gap-2">
                            {HISTORICO.map((h, i) => (
                                <div key={i} className="flex items-center justify-between bg-white rounded-xl border border-gray-100 px-4 py-3">
                                    <div>
                                        <p className="text-sm font-bold text-gray-900">{h.tipo}</p>
                                        <p className="text-xs text-gray-400">{h.data}</p>
                                    </div>
                                    <span className="text-sm font-bold text-gray-900"><span className="text-[10px] text-gray-400">R$ </span>{h.valor}</span>
                                </div>
                            ))}
                        </div>
                        <div className="flex justify-end mt-2">
                            <button className="text-xs font-semibold text-gray-400 underline">Ver mais</button>
                        </div>
                    </div>

                    {/* Suporte */}
                    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
                        <h3 className="text-sm font-bold text-gray-900">Algum problema?</h3>
                        <p className="text-xs text-gray-400 mt-1 mb-4">Entre em contato com nosso Serviço de Atendimento ao Cliente 24h.</p>
                        <button className="inline-flex items-center gap-2 bg-[#407BFF] hover:bg-blue-600 text-white text-sm font-bold px-5 py-2.5 rounded-full transition-colors">
                            Falar com o Suporte <Headset size={16} />
                        </button>
                    </div>
                </div>
            </div>

            {/* Modal: Chave Pix */}
            {pixOpen && <ChavePixModal onClose={() => setPixOpen(false)} />}
        </AppShell>
    );
}

function ChavePixModal({ onClose }: { onClose: () => void }) {
    const [chave, setChave] = useState('');
    return (
        <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4" onClick={onClose}>
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm p-5" onClick={(e) => e.stopPropagation()}>
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-base font-bold text-gray-900">Chave Pix</h3>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600"><X size={18} /></button>
                </div>
                <input
                    value={chave}
                    onChange={(e) => setChave(e.target.value)}
                    placeholder="012.345.678-10"
                    inputMode="numeric"
                    className="w-full bg-[#F3F4F6] rounded-lg px-3 py-3 text-sm outline-none"
                />
                <p className="text-xs text-gray-500 leading-relaxed mt-3">
                    Adicione uma chave Pix para receber os valores de seus atendimentos.
                </p>
                <p className="text-xs text-gray-500 leading-relaxed mt-2">
                    Para sua segurança, a chave deve estar vinculada ao CPF cadastrado na plataforma.
                </p>
                <button onClick={onClose} className="w-full mt-4 bg-[#407BFF] hover:bg-blue-600 text-white text-sm font-bold py-3 rounded-full transition-colors">
                    Salvar Chave Pix
                </button>
            </div>
        </div>
    );
}
