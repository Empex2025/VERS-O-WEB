import { useState } from 'react';
import { CalendarDays, Minus, Plus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { AppShell } from '../../components/layout/AppShell';
import { PageHeader } from '../../components/layout/PageHeader';
import { PacienteCard } from './solicitacaoParts';

const MESES = ['janeiro', 'fevereiro', 'março', 'abril', 'maio', 'junho', 'julho', 'agosto', 'setembro', 'outubro', 'novembro', 'dezembro'];

export function GerarAtestado() {
    const navigate = useNavigate();
    const [inicio] = useState('30/05/2025');
    const [dias, setDias] = useState(1);
    const [motivo, setMotivo] = useState('');

    // "Valido até" a partir da data de início + dias
    const [d, m, y] = inicio.split('/').map(Number);
    const validoAte = new Date(y, m - 1, d + dias - 1);
    const validoLabel = `${validoAte.getDate()} de ${MESES[validoAte.getMonth()]}`;

    return (
        <AppShell rightRail={null}>
            <div className="max-w-5xl mx-auto flex flex-col min-h-[calc(100vh-8rem)]">
                <PageHeader title="Gerar Atestado" to="/area-profissional/atendimento/pos" />

                <div className="flex-1">
                    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 sm:p-6 flex flex-col gap-6">
                        <PacienteCard />

                        <div>
                            <label className="text-sm font-bold text-gray-900 block mb-2">Data de Início</label>
                            <div className="flex items-center bg-[#F9FAFB] rounded-xl px-4 h-12">
                                <span className="flex-1 text-sm text-gray-800">{inicio}</span>
                                <CalendarDays size={18} className="text-gray-400" />
                            </div>
                        </div>

                        <div>
                            <label className="text-sm font-bold text-gray-900 block mb-2">Duração do Atestado</label>
                            <div className="flex items-center gap-3">
                                <div className="flex-1 bg-[#F9FAFB] rounded-xl px-4 py-3">
                                    <p className="text-lg font-bold text-gray-900">{String(dias).padStart(2, '0')} <span className="text-sm font-normal text-gray-500">{dias === 1 ? 'dia' : 'dias'}</span></p>
                                    <div className="flex items-center justify-between mt-1">
                                        <span className="text-xs text-gray-400">Valido até</span>
                                        <span className="text-xs font-bold text-gray-900">{validoLabel}</span>
                                    </div>
                                </div>
                                <button onClick={() => setDias((v) => Math.max(1, v - 1))} className="w-10 h-10 rounded-full bg-gray-100 text-gray-400 flex items-center justify-center hover:bg-gray-200"><Minus size={16} /></button>
                                <button onClick={() => setDias((v) => v + 1)} className="w-10 h-10 rounded-full bg-[#407BFF] text-white flex items-center justify-center hover:bg-blue-600"><Plus size={16} /></button>
                            </div>
                        </div>

                        <div>
                            <label className="text-sm font-bold text-gray-900 block mb-2">Motivo de Afastamento ou CID-10</label>
                            <textarea
                                value={motivo}
                                onChange={(e) => setMotivo(e.target.value)}
                                placeholder="Ex: sintomas gripais intensos (CID J11.1)."
                                className="w-full h-24 bg-[#F9FAFB] rounded-xl p-4 text-sm text-gray-800 outline-none resize-none placeholder:text-gray-400"
                            />
                        </div>
                    </div>
                </div>

                <div className="flex justify-end border-t border-gray-100 pt-4 mt-4">
                    <button
                        onClick={() => navigate('/area-profissional/atendimento/atestado/assinar')}
                        className="bg-[#407BFF] hover:bg-blue-600 text-white text-sm font-bold px-6 py-2.5 rounded-full transition-colors"
                    >
                        Gerar Atestado
                    </button>
                </div>
            </div>
        </AppShell>
    );
}
