import { useNavigate } from 'react-router-dom';
import { AppShell } from '../../components/layout/AppShell';
import { PageHeader } from '../../components/layout/PageHeader';
import { teleconsultaService } from '../../services/teleconsultaService';
import { useApiData } from '../../hooks/useApiData';

interface Doc {
    tipo: string;
    titulo: string;
    validade: string;
    accent: string;
    preview: React.ReactNode;
}

interface RawDoc { id?: number; tipo?: string; titulo?: string; cid?: string; validade?: string; valido_ate?: string }

function docFromTipo(tipo: string, validade: string, cid?: string): Doc {
    const t = tipo.toLowerCase();
    if (t.includes('atest')) return { tipo: 'atestado', titulo: 'Atestado Médico', validade, accent: 'bg-rose-400', preview: <>Atestado médico emitido pelo profissional responsável pelo seu atendimento.</> };
    if (t.includes('exam')) return { tipo: 'exames', titulo: 'Solicitação de Exames', validade, accent: 'bg-[#407BFF]', preview: <>CID-10: <span className="font-bold text-gray-700">{cid || 'R53'}</span></> };
    return { tipo: 'prescricao', titulo: 'Prescrição de Medicamentos', validade, accent: 'bg-[#407BFF]', preview: <>CID-10: <span className="font-bold text-gray-700">{cid || 'R53'}</span></> };
}

/** Documentos reais do paciente (atestado/exames/prescrição); cai no mock quando vazio. */
async function fetchDocs(): Promise<Doc[]> {
    const raw = await teleconsultaService.documentos.list<{ results: RawDoc[] } | RawDoc[]>();
    const list = Array.isArray(raw) ? raw : raw?.results ?? [];
    if (!list.length) return [];
    return list.map((d) => docFromTipo(d.tipo || d.titulo || 'prescricao', d.valido_ate || d.validade || 'Válido até 30 de Maio', d.cid));
}


export function PrescricoesAtestados() {
    const navigate = useNavigate();
    const { data: docs } = useApiData(fetchDocs, [], []);
    return (
        <AppShell>
            <div className="max-w-2xl mx-auto">
                <PageHeader title="Documentos Disponíveis" to="/minha-saude" />

                <div className="flex flex-col gap-4">
                    {docs.length === 0 && (
                        <p className="text-sm text-gray-400 text-center py-10">Nenhum documento disponível.</p>
                    )}
                    {docs.map((d, i) => (
                        <button
                            key={i}
                            onClick={() => navigate(`/minha-saude/documento/${d.tipo}`)}
                            className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden text-left hover:border-[#407BFF]/40 transition-colors"
                        >
                            <p className="text-sm text-gray-500 leading-relaxed px-5 pt-5 pb-4">{d.preview}</p>
                            <div className={`h-0.5 ${d.accent}`} />
                            <div className="px-5 py-4">
                                <p className="text-sm font-bold text-gray-900">{d.titulo}</p>
                                <p className="text-xs text-gray-400 mt-0.5">{d.validade}</p>
                            </div>
                        </button>
                    ))}
                </div>
            </div>
        </AppShell>
    );
}
