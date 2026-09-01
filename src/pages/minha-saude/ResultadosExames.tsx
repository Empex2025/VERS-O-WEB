import { useState } from 'react';
import { Search, Plus, ChevronDown, X, FileText, BadgeCheck } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { AppShell } from '../../components/layout/AppShell';
import { PageHeader } from '../../components/layout/PageHeader';
import { exams, type Exam } from '../../data/health';
import { teleconsultaService } from '../../services/teleconsultaService';
import { useApiData } from '../../hooks/useApiData';

interface RawExam {
    id_agendamento: number;
    data_hora: string;
    status_pagamento?: string;
    exame?: { nome?: string; clinic?: { nome?: string } };
}

async function fetchExames(): Promise<Exam[]> {
    const raw = await teleconsultaService.exames.list<RawExam[] | { results: RawExam[] }>();
    const list = Array.isArray(raw) ? raw : raw?.results ?? [];
    return list.map((e): Exam => {
        const liberado = String(e.status_pagamento || '').toLowerCase().includes('pag');
        return {
            id: String(e.id_agendamento),
            date: `Exames de ${new Date(e.data_hora).toLocaleDateString('pt-BR', { day: 'numeric', month: 'long' })}`,
            status: liberado ? 'Liberado' : 'Em Liberação',
            detail: liberado ? 'Liberado' : 'Parcialmente Liberado',
            lab: e.exame?.clinic?.nome || e.exame?.nome || 'Laboratório',
        };
    });
}

export function ResultadosExames() {
    const navigate = useNavigate();
    const [showUpload, setShowUpload] = useState(false);
    const { data: examsData } = useApiData(fetchExames, exams, []);

    return (
        <AppShell>
            <div className="max-w-2xl mx-auto">
                <PageHeader title="Resultados de Exames" to="/minha-saude" />

                {/* Busca */}
                <div className="relative mb-3">
                    <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                        placeholder="Busque por profissional, tipo de atendimento..."
                        className="w-full bg-white border border-gray-200 rounded-xl py-3 pl-11 pr-10 text-sm outline-none focus:ring-2 focus:ring-[#407BFF]/20"
                    />
                    <X size={16} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400" />
                </div>
                <button className="flex items-center gap-1 text-xs text-gray-500 border border-gray-200 rounded-lg px-3 py-1.5 mb-4">
                    Do recentes a mais antigos <ChevronDown size={14} />
                </button>

                {/* Upload */}
                <button
                    onClick={() => setShowUpload(true)}
                    className="w-full flex items-center justify-center gap-2 bg-[#407BFF]/10 hover:bg-[#407BFF]/15 text-[#407BFF] font-bold text-sm py-3 rounded-xl transition-colors mb-4"
                >
                    Fazer Upload de Exame <Plus size={18} />
                </button>

                {/* Lista */}
                <div className="flex flex-col gap-3">
                    {examsData.map((e) => (
                        <button
                            key={e.id}
                            onClick={() => navigate('/minha-saude/documento')}
                            className="bg-white border border-gray-100 shadow-sm rounded-2xl p-4 text-left hover:border-[#407BFF] transition-colors"
                        >
                            {/* Dados do paciente */}
                            <div className="grid grid-cols-4 gap-2 pb-3 border-b border-gray-100">
                                <Field label="Paciente" value="Nome do Paciente" />
                                <Field label="CPF" value="000.000.000-00" />
                                <Field label="Nascimento" value="00/00/0000" />
                                <Field label="Sexo" value="Masculino" />
                            </div>
                            {/* Status */}
                            <div className="pt-3">
                                <span className={`inline-block text-[11px] font-bold px-2 py-0.5 rounded-full ${
                                    e.status === 'Liberado' ? 'bg-emerald-100 text-emerald-600' : 'bg-amber-100 text-amber-600'
                                }`}>
                                    {e.status}
                                </span>
                                <p className="text-sm font-bold text-gray-900 mt-1.5">{e.date}</p>
                                <p className="text-xs text-gray-400">{e.detail}</p>
                                <p className="text-xs text-gray-500 mt-1 flex items-center gap-1">
                                    Examinado por <span className="font-bold text-gray-700">{e.lab}</span>
                                    <BadgeCheck size={13} className="text-[#407BFF]" />
                                </p>
                            </div>
                        </button>
                    ))}
                </div>
            </div>

            {showUpload && <AnexarModal onClose={() => setShowUpload(false)} />}
        </AppShell>
    );
}

function Field({ label, value }: { label: string; value: string }) {
    return (
        <div>
            <p className="text-[10px] text-gray-400">{label}</p>
            <p className="text-xs font-bold text-gray-800 truncate">{value}</p>
        </div>
    );
}

function AnexarModal({ onClose }: { onClose: () => void }) {
    const [files, setFiles] = useState(['resultado2.pdf', 'resultado1.pdf']);
    return (
        <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm p-5">
                <div className="flex items-center justify-between mb-4">
                    <h3 className="font-bold text-gray-900">Anexar Resultado de Exames</h3>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600"><X size={18} /></button>
                </div>

                <div className="flex flex-col gap-2">
                    {files.map((f) => (
                        <div key={f} className="flex items-center gap-2 bg-[#F3F4F6] rounded-lg px-3 py-2.5 text-sm text-gray-700">
                            <FileText size={16} className="text-[#407BFF]" />
                            <span className="flex-1 truncate">{f}</span>
                            <button onClick={() => setFiles((prev) => prev.filter((x) => x !== f))} className="text-gray-400 hover:text-gray-600">
                                <X size={14} />
                            </button>
                        </div>
                    ))}
                </div>

                <button className="w-full flex items-center justify-center gap-1 text-[#407BFF] font-bold text-sm py-2.5 mt-2 border border-dashed border-[#407BFF]/40 rounded-lg hover:bg-[#407BFF]/5">
                    Novo Documento <Plus size={16} />
                </button>

                <button onClick={onClose} className="w-full bg-[#407BFF] hover:bg-blue-600 text-white font-bold text-sm py-3 rounded-lg mt-3 transition-colors">
                    Concluir
                </button>
            </div>
        </div>
    );
}
