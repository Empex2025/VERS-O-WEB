import { Video, ChevronRight, Plus } from 'lucide-react';
import { VerificacaoShell } from './VerificacaoShell';

export function ModalidadeAtendimento() {
    return (
        <VerificacaoShell title="Adicionar um Endereço" step={3} backTo="/verificacao/endereco" nextTo="/verificacao/pix">
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
                <button className="w-full flex items-center gap-3 border border-gray-200 rounded-xl px-4 py-3.5 hover:border-[#407BFF] transition-colors text-left">
                    <span className="w-9 h-9 rounded-lg bg-[#407BFF]/10 text-[#407BFF] flex items-center justify-center"><Video size={18} /></span>
                    <div className="flex-1">
                        <p className="text-sm font-bold text-gray-900">Teleconsulta</p>
                        <p className="text-[11px] text-gray-400">Atendimento por vídeo chamada</p>
                    </div>
                    <ChevronRight size={16} className="text-gray-300" />
                </button>

                <button className="w-full flex items-center justify-center gap-1 text-[#407BFF] font-bold text-sm py-2.5 mt-3 border border-dashed border-[#407BFF]/40 rounded-lg hover:bg-[#407BFF]/5">
                    Novo Certificado <Plus size={16} />
                </button>
            </div>
        </VerificacaoShell>
    );
}
