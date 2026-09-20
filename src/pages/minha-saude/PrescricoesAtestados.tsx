import { useNavigate } from 'react-router-dom';
import { AppShell } from '../../components/layout/AppShell';
import { PageHeader } from '../../components/layout/PageHeader';

interface Doc {
    tipo: string;
    titulo: string;
    validade: string;
    accent: string;
    preview: React.ReactNode;
}

const DOCS: Doc[] = [
    {
        tipo: 'atestado',
        titulo: 'Atestado Médico',
        validade: 'Válido até 30 de Maio',
        accent: 'bg-rose-400',
        preview: (
            <>Eu, <span className="font-bold text-gray-700">Dr. Nome do Profissional</span>, CRM 123456-AL, atesto para os devidos fins que o paciente <span className="font-bold text-gray-700">Nome do Paciente</span>, foi atendido e diagnosticado em <span className="font-bold text-gray-700">30/05/2025</span> e necessita de afastamento de suas atividades por <span className="font-bold text-gray-700">3 (três) dias</span> pelo motivo especificado no CID-10 abaixo:</>
        ),
    },
    {
        tipo: 'exames',
        titulo: 'Solicitação de Exames',
        validade: 'Válido até 30 de Maio',
        accent: 'bg-[#407BFF]',
        preview: <>CID-10: <span className="font-bold text-gray-700">R53</span></>,
    },
    {
        tipo: 'prescricao',
        titulo: 'Prescrição de Medicamentos',
        validade: 'Válido até 30 de Maio',
        accent: 'bg-[#407BFF]',
        preview: <>CID-10: <span className="font-bold text-gray-700">R53</span></>,
    },
];

export function PrescricoesAtestados() {
    const navigate = useNavigate();
    return (
        <AppShell>
            <div className="max-w-2xl mx-auto">
                <PageHeader title="Documentos Disponíveis" to="/minha-saude" />

                <div className="flex flex-col gap-4">
                    {DOCS.map((d) => (
                        <button
                            key={d.tipo}
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
