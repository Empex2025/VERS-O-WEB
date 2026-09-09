import { useState } from 'react';
import { Search, Check, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { AppShell } from '../../components/layout/AppShell';
import { PageHeader } from '../../components/layout/PageHeader';

const DISPONIVEIS = [
    'Hemograma Completo', 'Glicemia em Jejum', 'Colesterol Total e Frações',
    'TGO / TGP', 'Ureia e Creatinina', 'TSH', 'Urina Tipo I', 'Vitamina D',
];

export function SolicitarExames() {
    const navigate = useNavigate();
    const [busca, setBusca] = useState('');
    const [sel, setSel] = useState<string[]>(['Hemograma Completo', 'Glicemia em Jejum']);

    const toggle = (e: string) => setSel((s) => (s.includes(e) ? s.filter((x) => x !== e) : [...s, e]));
    const lista = DISPONIVEIS.filter((e) => e.toLowerCase().includes(busca.toLowerCase()));

    return (
        <AppShell rightRail={null}>
            <div className="max-w-4xl mx-auto flex flex-col min-h-[calc(100vh-8rem)]">
                <PageHeader title="Solicitar Exames" to="/area-profissional/atendimento/pos" />

                <div className="flex-1 flex flex-col gap-5">
                    {/* Busca */}
                    <div className="flex items-center gap-2 bg-[#F3F4F6] rounded-xl px-4 h-12">
                        <Search size={16} className="text-gray-400" />
                        <input value={busca} onChange={(e) => setBusca(e.target.value)} placeholder="Buscar exame" className="flex-1 bg-transparent text-sm text-gray-800 outline-none placeholder:text-gray-400" />
                    </div>

                    {/* Selecionados */}
                    {sel.length > 0 && (
                        <div>
                            <p className="text-sm font-bold text-gray-900 mb-2">Exames Selecionados</p>
                            <div className="flex flex-col gap-2">
                                {sel.map((e) => (
                                    <div key={e} className="flex items-center justify-between bg-[#407BFF]/5 rounded-xl px-4 py-3">
                                        <span className="text-sm font-semibold text-gray-800">{e}</span>
                                        <button onClick={() => toggle(e)} className="text-rose-400 hover:text-rose-500"><X size={16} /></button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Disponíveis */}
                    <div>
                        <p className="text-sm font-bold text-gray-900 mb-2">Exames Disponíveis</p>
                        <div className="flex flex-col gap-2">
                            {lista.map((e) => {
                                const on = sel.includes(e);
                                return (
                                    <button key={e} onClick={() => toggle(e)} className="w-full flex items-center justify-between bg-white rounded-xl border border-gray-100 px-4 py-3 text-left hover:border-[#407BFF]/40 transition-colors">
                                        <span className="text-sm text-gray-800">{e}</span>
                                        <span className={`w-5 h-5 rounded-md flex items-center justify-center ${on ? 'bg-[#407BFF] text-white' : 'border border-gray-200'}`}>{on && <Check size={13} />}</span>
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                </div>

                <div className="flex justify-end border-t border-gray-100 pt-4 mt-4">
                    <button
                        onClick={() => navigate('/area-profissional/atendimento/pos')}
                        disabled={sel.length === 0}
                        className="text-sm font-bold px-6 py-2.5 rounded-full transition-colors disabled:bg-gray-200 disabled:text-gray-400 bg-[#407BFF] hover:bg-blue-600 text-white"
                    >
                        Solicitar Exames
                    </button>
                </div>
            </div>
        </AppShell>
    );
}
