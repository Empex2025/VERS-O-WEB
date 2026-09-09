import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronRight, Trash2, Plus } from 'lucide-react';
import { AppShell } from '../../components/layout/AppShell';
import { PageHeader } from '../../components/layout/PageHeader';

export function NovaPergunta() {
    const navigate = useNavigate();
    const [titulo, setTitulo] = useState('');
    const [tipo] = useState('Seleção');
    const [opcoes, setOpcoes] = useState(['Opção 1', 'Opção 2', 'Opção 3']);

    const setOpcao = (i: number, v: string) => setOpcoes((o) => o.map((x, idx) => (idx === i ? v : x)));

    return (
        <AppShell rightRail={null}>
            <div className="max-w-4xl mx-auto flex flex-col min-h-[calc(100vh-8rem)]">
                <PageHeader title="Nova Pergunta" to="/area-profissional/pre-consulta" />

                <div className="flex-1 flex flex-col gap-5 pt-2">
                    <div>
                        <label className="text-sm font-bold text-gray-900">Título da Pergunta</label>
                        <input
                            value={titulo}
                            onChange={(e) => setTitulo(e.target.value)}
                            placeholder="Consulta Geral"
                            className="w-full mt-1.5 bg-white border border-gray-100 rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-[#407BFF]/20"
                        />
                    </div>

                    <div>
                        <label className="text-sm font-bold text-gray-900">Tipo de Resposta</label>
                        <button className="w-full mt-1.5 bg-white border border-gray-100 rounded-xl px-4 py-3 flex items-center justify-between text-sm text-gray-700">
                            {tipo}
                            <ChevronRight size={16} className="text-gray-300" />
                        </button>
                    </div>

                    <div>
                        <label className="text-sm font-bold text-gray-900">Opções</label>
                        <div className="flex flex-col gap-2 mt-1.5">
                            {opcoes.map((o, i) => (
                                <div key={i} className="flex items-center bg-white border border-gray-100 rounded-xl px-4 py-3">
                                    <input value={o} onChange={(e) => setOpcao(i, e.target.value)} className="flex-1 bg-transparent text-sm text-gray-700 outline-none" />
                                    <button onClick={() => setOpcoes((p) => p.filter((_, idx) => idx !== i))} className="text-rose-400 hover:text-rose-500"><Trash2 size={16} /></button>
                                </div>
                            ))}
                            <button
                                onClick={() => setOpcoes((p) => [...p, `Opção ${p.length + 1}`])}
                                className="w-full flex items-center justify-center gap-1.5 text-sm font-bold text-[#407BFF] bg-[#407BFF]/10 hover:bg-[#407BFF]/15 py-3 rounded-xl transition-colors"
                            >
                                Adicionar Opção <Plus size={16} />
                            </button>
                        </div>
                    </div>
                </div>

                {/* Rodapé */}
                <div className="flex justify-end border-t border-gray-100 pt-4 mt-4">
                    <button
                        onClick={() => navigate('/area-profissional/pre-consulta')}
                        disabled={!titulo.trim()}
                        className="bg-[#407BFF] hover:bg-blue-600 text-white text-sm font-bold px-6 py-2.5 rounded-full transition-colors disabled:bg-gray-200 disabled:text-gray-400"
                    >
                        Criar Pergunta
                    </button>
                </div>
            </div>
        </AppShell>
    );
}
