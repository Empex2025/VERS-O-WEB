import { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { AppShell } from '../../components/layout/AppShell';
import { PageHeader } from '../../components/layout/PageHeader';
import { Avatar } from '../../components/ui/Avatar';

export function GerarAtestado() {
    const navigate = useNavigate();
    const [tipo, setTipo] = useState('Atestado Médico');
    const [duracao, setDuracao] = useState('2');
    const [data, setData] = useState('30/04/2025');
    const [justificativa, setJustificativa] = useState('');

    return (
        <AppShell rightRail={null}>
            <div className="max-w-4xl mx-auto flex flex-col min-h-[calc(100vh-8rem)]">
                <PageHeader title="Gerar Atestado" to="/area-profissional/atendimento/pos" />

                <div className="flex-1 flex flex-col gap-4">
                    <div className="flex items-center gap-3 bg-white rounded-xl border border-gray-100 px-4 py-3">
                        <Avatar name="Carlos Magno de Souza" size={40} />
                        <div>
                            <p className="text-sm font-bold text-gray-900">Carlos Magno de Souza</p>
                            <p className="text-xs text-gray-400">@carlosmagno</p>
                        </div>
                    </div>

                    <Field label="Tipo do Atestado">
                        <Select value={tipo} onChange={setTipo} options={['Atestado Médico', 'Comparecimento', 'Afastamento']} />
                    </Field>

                    <div className="grid sm:grid-cols-2 gap-4">
                        <Field label="Duração">
                            <div className="flex items-center bg-[#F3F4F6] rounded-xl px-4 h-12">
                                <input value={duracao} onChange={(e) => setDuracao(e.target.value)} className="flex-1 bg-transparent text-sm text-gray-800 outline-none" />
                                <span className="text-sm text-gray-400">dias</span>
                            </div>
                        </Field>
                        <Field label="Data">
                            <input value={data} onChange={(e) => setData(e.target.value)} className="w-full bg-[#F3F4F6] rounded-xl px-4 h-12 text-sm text-gray-800 outline-none" />
                        </Field>
                    </div>

                    <Field label="Justificativa">
                        <textarea
                            value={justificativa}
                            onChange={(e) => setJustificativa(e.target.value)}
                            placeholder="Descreva a justificativa do atestado (CID opcional)."
                            className="w-full h-32 bg-[#F3F4F6] rounded-xl p-4 text-sm text-gray-800 outline-none resize-none placeholder:text-gray-400"
                        />
                    </Field>
                </div>

                <div className="flex justify-end border-t border-gray-100 pt-4 mt-4">
                    <button
                        onClick={() => navigate('/area-profissional/atendimento/pos')}
                        className="bg-[#407BFF] hover:bg-blue-600 text-white text-sm font-bold px-6 py-2.5 rounded-full transition-colors"
                    >
                        Gerar Atestado
                    </button>
                </div>
            </div>
        </AppShell>
    );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
    return (
        <div>
            <label className="text-sm font-bold text-gray-900 mb-2 block">{label}</label>
            {children}
        </div>
    );
}

function Select({ value, onChange, options }: { value: string; onChange: (v: string) => void; options: string[] }) {
    return (
        <div className="relative">
            <select value={value} onChange={(e) => onChange(e.target.value)} className="w-full appearance-none bg-[#F3F4F6] rounded-xl px-4 h-12 text-sm text-gray-800 outline-none">
                {options.map((o) => <option key={o}>{o}</option>)}
            </select>
            <ChevronDown size={16} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
        </div>
    );
}
