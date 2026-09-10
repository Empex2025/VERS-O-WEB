import { useState } from 'react';
import { Plus, ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { AppShell } from '../../components/layout/AppShell';
import { PageHeader } from '../../components/layout/PageHeader';
import { PacienteCard } from './solicitacaoParts';

interface Med { nome: string; posologia: string }

export function CriarPrescricao() {
    const navigate = useNavigate();
    const [meds, setMeds] = useState<Med[]>([{ nome: 'Dipirona 500g', posologia: '1 comprimido a cada 8 horas' }]);
    const [form, setForm] = useState(false);
    const [nome, setNome] = useState('');
    const [posologia, setPosologia] = useState('');

    const add = () => {
        if (!nome.trim()) return;
        setMeds((m) => [...m, { nome: nome.trim(), posologia: posologia.trim() }]);
        setNome(''); setPosologia(''); setForm(false);
    };

    return (
        <AppShell rightRail={null}>
            <div className="max-w-5xl mx-auto flex flex-col min-h-[calc(100vh-8rem)]">
                <PageHeader title="Gerar Prescrição" to="/area-profissional/atendimento/pos" />

                <div className="flex-1">
                    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 sm:p-6 flex flex-col gap-4">
                        <PacienteCard />

                        <div>
                            <p className="text-base font-bold text-gray-900">Nenhum medicamento adicionado!</p>
                            <p className="text-sm text-gray-500 mt-0.5">Adicione os medicamentos que prescreverá para seu paciente.</p>
                        </div>

                        <button onClick={() => setForm((v) => !v)} className="w-full bg-[#407BFF]/10 text-[#407BFF] text-sm font-bold py-3.5 rounded-xl flex items-center justify-center gap-2 hover:bg-[#407BFF]/15 transition-colors">
                            Adicionar Medicamento <Plus size={16} />
                        </button>

                        {form && (
                            <div className="bg-[#F9FAFB] rounded-xl p-4 flex flex-col gap-3">
                                <input value={nome} onChange={(e) => setNome(e.target.value)} placeholder="Nome e dosagem (ex.: Amoxicilina 500mg)" className="w-full bg-white rounded-lg px-4 h-11 text-sm text-gray-800 outline-none border border-gray-100" />
                                <input value={posologia} onChange={(e) => setPosologia(e.target.value)} placeholder="Posologia (ex.: 1 comprimido de 12/12h por 7 dias)" className="w-full bg-white rounded-lg px-4 h-11 text-sm text-gray-800 outline-none border border-gray-100" />
                                <button onClick={add} className="self-start bg-[#407BFF] text-white text-sm font-bold px-4 py-2 rounded-full hover:bg-blue-600 transition-colors">Adicionar</button>
                            </div>
                        )}

                        {meds.length > 0 && (
                            <>
                                <div className="border-t border-gray-100" />
                                <p className="text-base font-bold text-gray-900">Medicamentos Adicionados</p>
                                <div className="flex flex-col gap-2">
                                    {meds.map((m, i) => (
                                        <div key={i} className="flex items-center justify-between bg-[#F9FAFB] rounded-xl px-4 py-3">
                                            <div>
                                                <p className="text-sm font-bold text-gray-900">{m.nome}</p>
                                                {m.posologia && <p className="text-xs text-gray-400">{m.posologia}</p>}
                                            </div>
                                            <ChevronRight size={18} className="text-gray-300" />
                                        </div>
                                    ))}
                                </div>
                            </>
                        )}
                    </div>
                </div>

                <div className="flex justify-end border-t border-gray-100 pt-4 mt-4">
                    <button
                        onClick={() => navigate('/area-profissional/atendimento/prescricao/assinar')}
                        disabled={meds.length === 0}
                        className="text-sm font-bold px-6 py-2.5 rounded-full transition-colors disabled:bg-gray-200 disabled:text-gray-400 bg-[#407BFF] hover:bg-blue-600 text-white"
                    >
                        Gerar Prescrição
                    </button>
                </div>
            </div>
        </AppShell>
    );
}
