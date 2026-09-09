import { BadgeCheck, ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { AppShell } from '../../components/layout/AppShell';
import { PageHeader } from '../../components/layout/PageHeader';
import { Avatar } from '../../components/ui/Avatar';

interface Vinculo { nome: string; sub: string; selo?: 'azul' | 'amarelo' }

const SOLICITACOES: Vinculo[] = [
    { nome: 'Clínica Patinhas', sub: 'Clínica Veterinária', selo: 'azul' },
];
const VINCULOS: Vinculo[] = [
    { nome: 'Clínica Mais Saúde', sub: 'Exames Laboratoriais', selo: 'azul' },
    { nome: 'iSaúde', sub: 'Perfil Oficial', selo: 'amarelo' },
];

export function MeusVinculos() {
    const navigate = useNavigate();
    return (
        <AppShell rightRail={null}>
            <div className="max-w-4xl mx-auto">
                <PageHeader title="Meus Vínculos" to="/area-profissional" />

                <div className="flex flex-col gap-6 pt-2">
                    <Secao titulo="Solicitações Recebidas" itens={SOLICITACOES} onClick={() => navigate('/area-profissional/vinculos/proposta')} />
                    <Secao titulo="Vínculos" itens={VINCULOS} />
                </div>
            </div>
        </AppShell>
    );
}

function Secao({ titulo, itens, onClick }: { titulo: string; itens: Vinculo[]; onClick?: () => void }) {
    return (
        <section>
            <h2 className="text-sm font-bold text-gray-900 mb-3">{titulo}</h2>
            <div className="flex flex-col gap-3">
                {itens.map((v) => (
                    <button key={v.nome} onClick={onClick} className="w-full flex items-center gap-3 bg-white rounded-xl border border-gray-100 px-4 py-3 hover:border-[#407BFF]/40 transition-colors text-left">
                        <Avatar name={v.nome} size={40} />
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-bold text-gray-900 flex items-center gap-1">
                                {v.nome}
                                {v.selo && <BadgeCheck size={14} className={v.selo === 'amarelo' ? 'text-amber-400' : 'text-[#407BFF]'} />}
                            </p>
                            <p className="text-xs text-gray-400">{v.sub}</p>
                        </div>
                        <ChevronRight size={18} className="text-gray-300" />
                    </button>
                ))}
            </div>
        </section>
    );
}
