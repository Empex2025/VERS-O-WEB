import { useState } from 'react';
import { User } from 'lucide-react';
import { AppShell } from '../../components/layout/AppShell';
import { PageHeader } from '../../components/layout/PageHeader';

type Tipo = 'paciente' | 'profissional';

export function TipoPerfil() {
    const [atual, setAtual] = useState<Tipo>('profissional');

    return (
        <AppShell rightRail={null}>
            <div className="max-w-4xl mx-auto">
                <PageHeader title="Tipo de Perfil" to="/meu-perfil/editar" />

                <div className="grid grid-cols-2 gap-4 pt-2">
                    <Card tipo="paciente" cor="#407BFF" atual={atual === 'paciente'} onClick={() => setAtual('paciente')} />
                    <Card tipo="profissional" cor="#01AEA4" atual={atual === 'profissional'} onClick={() => setAtual('profissional')} />
                </div>

                <div className="mt-5 text-sm text-gray-500 leading-relaxed">
                    <p>Escolha como você deseja continuar em nossa plataforma:</p>
                    <p className="mt-2">Pacientes podem marcar consultas e exames, além de comprar medicamentos no marketplace</p>
                    <p className="mt-2">Profissionais de Saúde podem gerenciar as consultas...</p>
                </div>
            </div>
        </AppShell>
    );
}

function Card({ tipo, cor, atual, onClick }: { tipo: Tipo; cor: string; atual: boolean; onClick: () => void }) {
    const label = tipo === 'paciente' ? 'Paciente' : 'Profissional';
    return (
        <button
            onClick={onClick}
            style={{ backgroundColor: cor }}
            className={`relative rounded-2xl h-56 flex flex-col items-center justify-center gap-3 text-white transition-all ${atual ? 'ring-2 ring-offset-2 ring-white/60' : 'opacity-90 hover:opacity-100'}`}
        >
            {atual && <span className="absolute top-3 right-3 text-[11px] font-bold bg-white/25 px-2.5 py-1 rounded-full">Atual</span>}
            <span className="w-16 h-16 rounded-full bg-white/20 flex items-center justify-center">
                <User size={30} />
            </span>
            <span className="text-lg font-bold">{label}</span>
        </button>
    );
}
