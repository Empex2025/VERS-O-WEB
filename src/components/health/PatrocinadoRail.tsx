import { BadgeCheck, Star, Stethoscope, Crown } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Avatar } from '../ui/Avatar';
import { useProfissionais, money, type Prof } from '../../hooks/useProfissionais';

/**
 * Coluna direita "Patrocinado" da seção Minha Saúde (Consultas e Exames).
 * Mostra o profissional em destaque do catálogo real; se não houver, slots vazios.
 */
export function PatrocinadoRail() {
    const { data: profs } = useProfissionais();
    const featured = profs[0];

    return (
        <div className="flex flex-col gap-4">
            <p className="text-sm font-bold text-gray-900">Patrocinado</p>
            {featured ? (
                <RailFeaturedCard prof={featured} />
            ) : (
                <div className="h-40 rounded-2xl border border-gray-200 bg-white" />
            )}
            <div className="h-40 rounded-2xl border border-gray-200 bg-white" />
        </div>
    );
}

function RailFeaturedCard({ prof }: { prof: Prof }) {
    const navigate = useNavigate();
    return (
        <button
            onClick={() => navigate(`/perfil-profissional/${prof.id}`)}
            className="w-full text-left bg-white rounded-2xl border-2 border-emerald-400 shadow-sm p-4 pt-6 relative hover:shadow-md transition-shadow"
        >
            <span className="absolute -top-3 left-1/2 -translate-x-1/2 flex items-center gap-1 bg-emerald-500 text-white text-[10px] font-bold px-3 py-1 rounded-full whitespace-nowrap">
                <Crown size={11} /> Profissional em Destaque
            </span>
            <div className="flex items-start justify-between gap-2">
                <p className="text-[11px] text-gray-400">A partir de</p>
                <p className="text-base font-extrabold text-gray-900">{prof.preco ? money(prof.preco) : '—'}</p>
            </div>
            <div className="flex items-start gap-3 mt-1">
                <Avatar name={prof.nome} size={44} ring />
                <div className="min-w-0">
                    <p className="text-sm font-bold text-gray-900 flex items-center gap-1 truncate">
                        {prof.nome} <BadgeCheck size={13} className="text-[#407BFF] shrink-0" />
                    </p>
                    <p className="text-[11px] text-gray-500 flex items-center gap-1 truncate"><Stethoscope size={11} /> {prof.especialidade}</p>
                    <p className="text-[11px] text-gray-500 flex items-center gap-1 mt-0.5">
                        <Star size={11} className="fill-amber-400 text-amber-400" /> 4.8 <span className="text-gray-400">4.876 Avaliações</span>
                    </p>
                </div>
            </div>
            <div className="flex flex-wrap gap-1.5 mt-2">
                {prof.modalidades.map((m) => (
                    <span key={m} className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${/tele/i.test(m) ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-500'}`}>{m}</span>
                ))}
            </div>
        </button>
    );
}
