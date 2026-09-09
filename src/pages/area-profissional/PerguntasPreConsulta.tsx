import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Trash2, Plus } from 'lucide-react';
import { AppShell } from '../../components/layout/AppShell';
import { PageHeader } from '../../components/layout/PageHeader';

const PADRAO = ['Altura', 'Peso', 'Pressão Arterial', 'Doenças Crônicas', 'Alergias', 'Cirurgias'];

export function PerguntasPreConsulta() {
    const navigate = useNavigate();
    const [padrao, setPadrao] = useState<string[]>(PADRAO);
    const [minhas, setMinhas] = useState<string[]>(['Altura']);

    return (
        <AppShell rightRail={null}>
            <div className="max-w-4xl mx-auto">
                <PageHeader title="Perguntas Pré-Consulta" to="/area-profissional" />

                <div className="flex flex-col gap-6 pt-2">
                    {/* Perguntas padrão */}
                    <section>
                        <div className="flex items-center justify-between mb-3">
                            <h2 className="text-sm font-bold text-gray-900">Perguntas Padrão</h2>
                            <span className="text-xs text-gray-400">{padrao.length} Perguntas</span>
                        </div>
                        <div className="grid sm:grid-cols-2 gap-3">
                            {padrao.map((q) => (
                                <QuestionCard key={q} label={q} onDelete={() => setPadrao((p) => p.filter((x) => x !== q))} />
                            ))}
                        </div>
                    </section>

                    {/* Suas perguntas */}
                    <section>
                        <div className="flex items-center justify-between mb-3">
                            <h2 className="text-sm font-bold text-gray-900">Suas Perguntas</h2>
                            <span className="text-xs text-gray-400">{minhas.length} Perguntas</span>
                        </div>
                        <div className="grid grid-cols-1 gap-3">
                            {minhas.map((q, i) => (
                                <QuestionCard key={`${q}-${i}`} label={q} onDelete={() => setMinhas((p) => p.filter((_, idx) => idx !== i))} />
                            ))}
                        </div>
                        <button
                            onClick={() => navigate('/area-profissional/pre-consulta/nova')}
                            className="w-full mt-3 flex items-center justify-center gap-1.5 text-sm font-bold text-[#407BFF] bg-[#407BFF]/10 hover:bg-[#407BFF]/15 py-3 rounded-xl transition-colors"
                        >
                            Criar Pergunta <Plus size={16} />
                        </button>
                    </section>
                </div>
            </div>
        </AppShell>
    );
}

function QuestionCard({ label, onDelete }: { label: string; onDelete: () => void }) {
    return (
        <div className="flex items-center justify-between bg-white rounded-xl border border-gray-100 px-4 py-3.5">
            <span className="text-sm font-bold text-gray-800">{label}</span>
            <button onClick={onDelete} className="text-rose-400 hover:text-rose-500"><Trash2 size={16} /></button>
        </div>
    );
}
