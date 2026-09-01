import type { ReactNode } from 'react';
import { Home } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { AppShell } from '../../components/layout/AppShell';
import { PageHeader } from '../../components/layout/PageHeader';
import { Stepper } from '../../components/layout/Stepper';

interface VerificacaoShellProps {
    title: string;
    step: number;
    children: ReactNode;
    backTo: string;
    nextTo: string;
    backLabel?: string;
    nextLabel?: string;
    nextDisabled?: boolean;
    /** Grava a fatia da etapa na API antes de avançar (otimista: erro não bloqueia). */
    onNext?: () => void | Promise<void>;
}

/** Layout dos passos do wizard: header + stepper + conteúdo + rodapé (voltar/próximo). */
export function VerificacaoShell({
    title, step, children, backTo, nextTo, backLabel = 'Cancelar', nextLabel = 'Próximo', nextDisabled, onNext,
}: VerificacaoShellProps) {
    const navigate = useNavigate();
    return (
        <AppShell rightRail={null}>
            <div className="max-w-2xl mx-auto flex flex-col min-h-[calc(100vh-8rem)]">
                <PageHeader title={title} to={backTo} right={<Home size={18} className="text-gray-400" />} />
                <Stepper current={step} />

                <div className="flex-1">{children}</div>

                {/* Rodapé */}
                <div className="flex items-center justify-end gap-3 pt-6">
                    <button onClick={() => navigate(backTo)} className="text-sm font-semibold text-gray-500 hover:text-gray-700 px-4 py-2">
                        {backLabel}
                    </button>
                    <button
                        onClick={async () => { if (nextDisabled) return; try { await onNext?.(); } catch { /* otimista */ } navigate(nextTo); }}
                        disabled={nextDisabled}
                        className={`text-sm font-bold px-6 py-2.5 rounded-full transition-colors ${
                            nextDisabled ? 'bg-[#E5E7EB] text-gray-400 cursor-not-allowed' : 'bg-[#407BFF] hover:bg-blue-600 text-white'
                        }`}
                    >
                        {nextLabel}
                    </button>
                </div>
            </div>
        </AppShell>
    );
}
