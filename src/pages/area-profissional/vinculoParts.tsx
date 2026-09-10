import { HeartPulse, Info, PawPrint } from 'lucide-react';

/** Cards reutilizados nas telas de Vínculo (Proposta, Termos, Confirmado). */

export function InstituicaoCard({ nome = 'Clínica Patinhas' }: { nome?: string }) {
    return (
        <div className="bg-white rounded-xl border border-gray-100 px-4 py-4 flex items-center gap-3">
            <span className="w-10 h-10 rounded-xl bg-[#FBEEDD] flex items-center justify-center">
                <PawPrint size={20} className="text-[#8B5E34]" />
            </span>
            <div>
                <p className="text-[11px] text-gray-400">Instituição</p>
                <p className="text-sm font-bold text-gray-900">{nome}</p>
            </div>
        </div>
    );
}

export function TipoAtendimentoCard({ tipo = 'Teleconsulta' }: { tipo?: string }) {
    return (
        <div className="bg-white rounded-xl border border-gray-100 px-4 py-4 flex items-center gap-3">
            <HeartPulse size={22} className="text-gray-500" />
            <div>
                <p className="text-[11px] text-gray-400">Tipo de Atendimento</p>
                <p className="text-sm font-bold text-gray-900">{tipo}</p>
            </div>
        </div>
    );
}

export function ValorCard() {
    return (
        <div className="bg-white rounded-xl border border-gray-100 px-4 py-4 flex items-center justify-between">
            <div>
                <p className="text-[11px] text-gray-400">Você Receberá</p>
                <p className="text-sm font-bold text-gray-900"><span className="text-[10px] text-gray-400">R$ </span>23,80</p>
            </div>
            <div>
                <p className="text-[11px] text-gray-400">Valor do Atendimento</p>
                <p className="text-sm font-semibold text-gray-500"><span className="text-[10px] text-gray-400">R$ </span>54,90</p>
            </div>
            <Info size={16} className="text-gray-300" />
        </div>
    );
}

export function InfoCard({ label, children }: { label: string; children: React.ReactNode }) {
    return (
        <div className="bg-white rounded-xl border border-gray-100 px-4 py-4">
            <p className="text-[11px] text-gray-400 mb-1">{label}</p>
            <div className="text-sm font-bold text-gray-800 leading-relaxed">{children}</div>
        </div>
    );
}
