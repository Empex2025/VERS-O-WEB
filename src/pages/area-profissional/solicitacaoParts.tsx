import { Avatar } from '../../components/ui/Avatar';

/** Card de paciente no topo das telas de Solicitação (Prescrição, Atestado, Exames). */
export function PacienteCard({ nome = 'Carlos Magno de Souza', handle = '@carlos.magno' }: { nome?: string; handle?: string }) {
    return (
        <div className="flex items-center gap-3 bg-[#F9FAFB] rounded-xl px-4 py-3">
            <Avatar name={nome} size={44} />
            <div>
                <p className="text-sm font-bold text-gray-900">{nome}</p>
                <p className="text-xs text-gray-400">{handle}</p>
            </div>
        </div>
    );
}
