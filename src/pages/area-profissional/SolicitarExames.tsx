import { useState } from 'react';
import { Plus, Search, SlidersHorizontal, Check, Trash2, ChevronLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { AppShell } from '../../components/layout/AppShell';
import { PageHeader } from '../../components/layout/PageHeader';
import { PacienteCard } from './solicitacaoParts';

interface Exame { nome: string; desc: string }

const CATALOGO: Exame[] = [
    { nome: 'Raio-X', desc: 'Lorem ipsun sit a met a dolor.' },
    { nome: 'Hemograma', desc: 'Exame de sangue utilizado para avaliar os glóbulos vermelhos, brancos e plaquetas, auxiliando no diagnóstico de anemias, infecções e outras condições.' },
    { nome: 'Eletrocardiograma (ESG)', desc: 'Exame que registra a atividade elétrica do coração do paciente' },
    { nome: 'Consulta Geral', desc: 'Lorem ipsun sit a met a dolor.' },
    { nome: 'Glicemia em Jejum', desc: 'Exame de sangue que mede a taxa de glicose após período de jejum.' },
];

export function SolicitarExames() {
    const navigate = useNavigate();
    const [step, setStep] = useState<'lista' | 'picker'>('lista');
    const [exames, setExames] = useState<Exame[]>([]);
    const [busca, setBusca] = useState('');
    const [sel, setSel] = useState<string[]>([]);

    const filtrados = CATALOGO.filter((e) => e.nome.toLowerCase().includes(busca.toLowerCase()));
    const toggle = (n: string) => setSel((s) => (s.includes(n) ? s.filter((x) => x !== n) : [...s, n]));
    const confirmar = () => {
        const add = CATALOGO.filter((e) => sel.includes(e.nome) && !exames.some((x) => x.nome === e.nome));
        setExames((e) => [...e, ...add]); setSel([]); setBusca(''); setStep('lista');
    };
    const remover = (n: string) => setExames((e) => e.filter((x) => x.nome !== n));

    // ---- Picker (Adicionar Exames) ----
    if (step === 'picker') {
        return (
            <AppShell rightRail={null}>
                <div className="max-w-5xl mx-auto flex flex-col min-h-[calc(100vh-8rem)]">
                    <div className="flex items-center gap-2 mb-5">
                        <button onClick={() => setStep('lista')} className="text-gray-700 hover:text-[#407BFF] transition-colors"><ChevronLeft size={20} /></button>
                        <h1 className="text-base font-bold text-gray-900 flex-1">Adicionar Exames</h1>
                    </div>
                    <div className="flex-1">
                        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 sm:p-6">
                            <div className="flex items-center gap-3 mb-5">
                                <div className="flex-1 flex items-center gap-2 bg-[#F9FAFB] rounded-xl px-4 h-12">
                                    <Search size={18} className="text-gray-400" />
                                    <input value={busca} onChange={(e) => setBusca(e.target.value)} placeholder="busque por exames..." className="flex-1 bg-transparent text-sm text-gray-800 outline-none placeholder:text-gray-400" />
                                </div>
                                <button className="w-11 h-11 rounded-xl bg-[#F9FAFB] flex items-center justify-center text-gray-500"><SlidersHorizontal size={18} /></button>
                            </div>
                            <p className="text-base font-bold text-gray-900">Quais Exames você deseja adicionar?</p>
                            <p className="text-sm text-gray-500 mb-4">Você deve selecionar pelo menos um exame para avançar.</p>
                            <div className="flex flex-col gap-2">
                                {filtrados.map((e, i) => {
                                    const on = sel.includes(e.nome);
                                    return (
                                        <button key={i} onClick={() => toggle(e.nome)} className="w-full flex items-start gap-3 bg-[#F9FAFB] rounded-xl px-4 py-3 text-left hover:bg-gray-100 transition-colors">
                                            <span className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 mt-0.5 ${on ? 'bg-[#407BFF] text-white' : 'border border-gray-300'}`}>{on && <Check size={14} />}</span>
                                            <div>
                                                <p className="text-sm font-bold text-gray-900">{e.nome}</p>
                                                <p className="text-xs text-gray-400">{e.desc}</p>
                                            </div>
                                        </button>
                                    );
                                })}
                            </div>
                        </div>
                    </div>
                    <div className="flex justify-end border-t border-gray-100 pt-4 mt-4">
                        <button onClick={confirmar} disabled={sel.length === 0} className="text-sm font-bold px-6 py-2.5 rounded-full transition-colors disabled:bg-gray-200 disabled:text-gray-400 bg-[#407BFF] hover:bg-blue-600 text-white">
                            Adicionar Exames
                        </button>
                    </div>
                </div>
            </AppShell>
        );
    }

    // ---- Lista (vazio / com exames) ----
    return (
        <AppShell rightRail={null}>
            <div className="max-w-5xl mx-auto flex flex-col min-h-[calc(100vh-8rem)]">
                <PageHeader title="Solicitar Exames" to="/area-profissional/atendimento/pos" />

                <div className="flex-1">
                    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 sm:p-6 flex flex-col gap-4">
                        <PacienteCard />

                        {exames.length === 0 && (
                            <div>
                                <p className="text-base font-bold text-gray-900">Nenhum exame adicionado!</p>
                                <p className="text-sm text-gray-500 mt-0.5">Adicione os exames que solicitará para seu paciente.</p>
                            </div>
                        )}

                        <button onClick={() => setStep('picker')} className="w-full bg-[#407BFF]/10 text-[#407BFF] text-sm font-bold py-3.5 rounded-xl flex items-center justify-center gap-2 hover:bg-[#407BFF]/15 transition-colors">
                            Adicionar Exame <Plus size={16} />
                        </button>

                        {exames.length > 0 && (
                            <>
                                <p className="text-base font-bold text-gray-900">Exames Adicionados</p>
                                <div className="flex flex-col gap-2">
                                    {exames.map((e) => (
                                        <div key={e.nome} className="flex items-center justify-between bg-[#F9FAFB] rounded-xl px-4 py-3">
                                            <span className="text-sm font-bold text-gray-900">{e.nome}</span>
                                            <button onClick={() => remover(e.nome)} className="text-rose-400 hover:text-rose-500"><Trash2 size={16} /></button>
                                        </div>
                                    ))}
                                </div>
                            </>
                        )}
                    </div>
                </div>

                <div className="flex justify-end border-t border-gray-100 pt-4 mt-4">
                    <button
                        onClick={() => navigate('/area-profissional/atendimento/pos')}
                        disabled={exames.length === 0}
                        className="text-sm font-bold px-6 py-2.5 rounded-full transition-colors disabled:bg-gray-200 disabled:text-gray-400 bg-[#407BFF] hover:bg-blue-600 text-white"
                    >
                        Gerar Solicitação
                    </button>
                </div>
            </div>
        </AppShell>
    );
}
