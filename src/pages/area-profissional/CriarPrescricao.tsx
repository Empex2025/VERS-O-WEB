import { useState } from 'react';
import { Plus, Pill, Trash2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { AppShell } from '../../components/layout/AppShell';
import { PageHeader } from '../../components/layout/PageHeader';

interface Med { nome: string; posologia: string }

export function CriarPrescricao() {
    const navigate = useNavigate();
    const [meds, setMeds] = useState<Med[]>([
        { nome: 'Dipirona 500mg', posologia: '1 comprimido de 8 em 8 horas por 3 dias' },
    ]);
    const [nome, setNome] = useState('');
    const [posologia, setPosologia] = useState('');

    const add = () => {
        if (!nome.trim()) return;
        setMeds((m) => [...m, { nome: nome.trim(), posologia: posologia.trim() }]);
        setNome(''); setPosologia('');
    };
    const remove = (i: number) => setMeds((m) => m.filter((_, idx) => idx !== i));

    return (
        <AppShell rightRail={null}>
            <div className="max-w-4xl mx-auto flex flex-col min-h-[calc(100vh-8rem)]">
                <PageHeader title="Criar Prescrição" to="/area-profissional/atendimento/pos" />

                <div className="flex-1 flex flex-col gap-5">
                    {/* Medicamentos adicionados */}
                    <div className="flex flex-col gap-2">
                        {meds.map((m, i) => (
                            <div key={i} className="flex items-start gap-3 bg-white rounded-xl border border-gray-100 px-4 py-3">
                                <Pill size={18} className="text-[#407BFF] mt-0.5" />
                                <div className="flex-1">
                                    <p className="text-sm font-bold text-gray-900">{m.nome}</p>
                                    {m.posologia && <p className="text-xs text-gray-400">{m.posologia}</p>}
                                </div>
                                <button onClick={() => remove(i)} className="text-rose-400 hover:text-rose-500"><Trash2 size={16} /></button>
                            </div>
                        ))}
                    </div>

                    {/* Adicionar medicamento */}
                    <div className="bg-[#F9FAFB] rounded-xl p-4 flex flex-col gap-3">
                        <p className="text-sm font-bold text-gray-900">Adicionar Medicamento</p>
                        <input value={nome} onChange={(e) => setNome(e.target.value)} placeholder="Nome e dosagem (ex.: Amoxicilina 500mg)" className="w-full bg-white rounded-lg px-4 h-11 text-sm text-gray-800 outline-none border border-gray-100" />
                        <input value={posologia} onChange={(e) => setPosologia(e.target.value)} placeholder="Posologia (ex.: 1 comprimido de 12/12h por 7 dias)" className="w-full bg-white rounded-lg px-4 h-11 text-sm text-gray-800 outline-none border border-gray-100" />
                        <button onClick={add} className="flex items-center gap-1.5 text-sm font-bold text-[#407BFF] self-start">
                            Adicionar Medicamento <Plus size={16} />
                        </button>
                    </div>
                </div>

                <div className="flex justify-end border-t border-gray-100 pt-4 mt-4">
                    <button
                        onClick={() => navigate('/area-profissional/atendimento/pos')}
                        className="bg-[#407BFF] hover:bg-blue-600 text-white text-sm font-bold px-6 py-2.5 rounded-full transition-colors"
                    >
                        Gerar Prescrição
                    </button>
                </div>
            </div>
        </AppShell>
    );
}
