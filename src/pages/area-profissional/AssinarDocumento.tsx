import { ChevronRight, FileText } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { AppShell } from '../../components/layout/AppShell';
import { PageHeader } from '../../components/layout/PageHeader';

interface AssinarProps {
    titulo: string; tipo: string; editarTo: string; footer: string;
    ajuda: string; adicioneTitulo: string; adicionePlaceholder: string;
}

/** Tela "Assinar Prescrição/Atestado": editar + upload do arquivo assinado. */
function AssinarDocumento({ titulo, tipo, editarTo, footer, ajuda, adicioneTitulo, adicionePlaceholder }: AssinarProps) {
    const navigate = useNavigate();
    return (
        <AppShell rightRail={null}>
            <div className="max-w-5xl mx-auto flex flex-col min-h-[calc(100vh-8rem)]">
                <PageHeader title={titulo} to={editarTo} />

                <div className="flex-1">
                    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 sm:p-6 flex flex-col gap-5">
                        <button onClick={() => navigate(editarTo)} className="w-full flex items-center justify-between bg-[#F9FAFB] rounded-xl px-4 py-4 hover:bg-gray-100 transition-colors">
                            <span className="text-sm font-bold text-gray-900">Editar {tipo}</span>
                            <ChevronRight size={18} className="text-gray-300" />
                        </button>

                        <p className="text-sm text-gray-500">{ajuda}</p>

                        <div>
                            <p className="text-sm font-bold text-gray-900 mb-2">{adicioneTitulo}</p>
                            <label className="flex items-center gap-2 bg-[#F9FAFB] rounded-xl px-4 h-12 cursor-pointer text-gray-400 hover:bg-gray-100 transition-colors">
                                <FileText size={18} />
                                <span className="text-sm">{adicionePlaceholder}</span>
                                <input type="file" accept="application/pdf,image/*" className="hidden" />
                            </label>
                        </div>
                    </div>
                </div>

                <div className="flex justify-end border-t border-gray-100 pt-4 mt-4">
                    <button
                        onClick={() => navigate('/area-profissional/atendimento/pos')}
                        className="bg-[#407BFF] hover:bg-blue-600 text-white text-sm font-bold px-6 py-2.5 rounded-full transition-colors"
                    >
                        {footer}
                    </button>
                </div>
            </div>
        </AppShell>
    );
}

export function AssinarPrescricao() {
    return <AssinarDocumento titulo="Assinar Prescrição" tipo="Prescrição" editarTo="/area-profissional/atendimento/prescricao" footer="Gerar Prescrição"
        ajuda="Assine a prescrição digitalmente e faça o upload do arquivo assinado aqui, para disponibilizar ao paciente."
        adicioneTitulo="Adicione a Prescrição Assinada" adicionePlaceholder="Adicione a prescrição assinada aqui" />;
}

export function AssinarAtestado() {
    return <AssinarDocumento titulo="Assinar Atestado" tipo="Atestado" editarTo="/area-profissional/atendimento/atestado" footer="Gerar Atestado"
        ajuda="Assine o atestado digitalmente e faça o upload do arquivo assinado aqui, para disponibilizar ao paciente."
        adicioneTitulo="Adicione o Atestado Assinado" adicionePlaceholder="Adicione o atestado assinado aqui" />;
}
