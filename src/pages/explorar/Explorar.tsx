import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, X, Check } from 'lucide-react';
import { AppShell } from '../../components/layout/AppShell';
import { Avatar } from '../../components/ui/Avatar';
import { profileService } from '../../services/profileService';
import { socialService } from '../../services/socialService';
import { useAuthStore } from '../../store/useAuthStore';
import { useApiData } from '../../hooks/useApiData';

const CATEGORIES = [
    { tag: '#nutricionistas', count: '12mil publicações' },
    { tag: '#SaúdeporAmor', count: '10mil publicações' },
    { tag: '#psicologos', count: '8mil publicações' },
    { tag: '#amor', count: '6mil publicações' },
    { tag: '#bemestar', count: '4mil publicações' },
];

interface RawUser { id: number; nome?: string; username?: string; ft_perfil?: string | null; is_verificado?: boolean; tipo_usuario?: string }
interface Person { id: number; name: string; handle: string; role: string; verified: boolean }

const PEOPLE_FALLBACK: Person[] = [
    { id: -1, name: 'Dra. Helena Souza', handle: '@helena', role: 'Profissional', verified: true },
    { id: -2, name: 'Clínica Bem Viver', handle: '@bemviver', role: 'Clínica', verified: true },
    { id: -3, name: 'Marcos Lima', handle: '@marcos', role: 'Paciente', verified: false },
];

function roleLabel(t?: string) {
    return t === 'profissional' ? 'Profissional' : t === 'clinica' ? 'Clínica' : 'Paciente';
}

async function fetchPeople(): Promise<Person[]> {
    const selfId = useAuthStore.getState().user?.id;
    const raw = await profileService.getUsers<{ users?: RawUser[] } | RawUser[]>();
    const list = Array.isArray(raw) ? raw : raw?.users ?? [];
    return list
        .filter((u) => u.id !== selfId)
        .map((u) => ({
            id: u.id,
            name: u.nome || `Usuário ${u.id}`,
            handle: u.username ? `@${u.username}` : `@user${u.id}`,
            role: roleLabel(u.tipo_usuario),
            verified: !!u.is_verificado,
        }));
}

export function Explorar() {
    const [query, setQuery] = useState('');
    const trimmed = query.trim().toLowerCase();
    const { data: people } = useApiData(fetchPeople, PEOPLE_FALLBACK, []);

    const filtered = useMemo(() => {
        if (!trimmed) return people;
        return people.filter((p) => p.name.toLowerCase().includes(trimmed) || p.handle.toLowerCase().includes(trimmed));
    }, [people, trimmed]);

    return (
        <AppShell>
            <div className="max-w-3xl">
                {/* Busca */}
                <h1 className="text-lg font-bold text-gray-900 mb-3">Explorar</h1>
                <div className="relative mb-5">
                    <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        placeholder="Busque por pessoas, assuntos e muito mais..."
                        className="w-full bg-white border border-gray-200 rounded-xl py-3 pl-11 pr-4 text-sm outline-none focus:ring-2 focus:ring-[#407BFF]/20"
                    />
                </div>

                {/* Categorias */}
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 mb-6">
                    {CATEGORIES.map((c) => (
                        <button key={c.tag} onClick={() => setQuery(c.tag)} className="bg-white border border-gray-200 rounded-xl p-3 text-left hover:border-[#407BFF] transition-colors">
                            <p className="text-sm font-bold text-gray-900 truncate">{c.tag}</p>
                            <p className="text-[11px] text-gray-400 mt-0.5">{c.count}</p>
                            <span className="text-[11px] font-semibold text-[#407BFF]">Ver Publicações</span>
                        </button>
                    ))}
                </div>

                <h2 className="text-sm font-bold text-gray-900 mb-3">
                    {trimmed ? `Resultados para "${query.trim()}"` : 'Pessoas que você pode conhecer'}
                </h2>

                {filtered.length === 0 ? (
                    <p className="text-sm text-gray-400 py-8 text-center">Nenhuma pessoa encontrada.</p>
                ) : (
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                        {filtered.map((p) => (
                            <FollowTile key={p.id} person={p} />
                        ))}
                    </div>
                )}
            </div>
        </AppShell>
    );
}

function FollowTile({ person }: { person: Person }) {
    const navigate = useNavigate();
    const [following, setFollowing] = useState(false);
    const [hidden, setHidden] = useState(false);

    const openProfile = () => {
        if (person.id < 0) return; // mock
        if (person.role === 'Profissional' || person.role === 'Clínica') navigate(`/perfil-profissional/${person.id}`);
        else navigate(`/perfil/${person.handle.replace(/^@/, '')}`);
    };

    const toggleFollow = async () => {
        const next = !following;
        setFollowing(next);
        if (next && person.id > 0) {
            try { await socialService.seguidores.create({ seguindo_id: person.id }); } catch { /* otimista */ }
        }
    };

    if (hidden) return null;
    return (
        <div className="rounded-xl bg-white border border-gray-200 p-4 flex flex-col items-center text-center relative">
            <button onClick={() => setHidden(true)} className="absolute top-2 right-2 text-gray-300 hover:text-gray-500"><X size={16} /></button>
            <button onClick={openProfile} className="flex flex-col items-center hover:opacity-80">
                <Avatar name={person.name} size={56} />
                <p className="text-sm font-semibold text-gray-900 mt-2 flex items-center gap-1">
                    {person.name}
                    {person.verified && <span className="text-[#407BFF] text-xs">✔</span>}
                </p>
                <p className="text-xs text-gray-400">{person.role}</p>
            </button>
            <button
                onClick={toggleFollow}
                className={`mt-3 w-full text-xs font-bold py-2 rounded-full transition-colors flex items-center justify-center gap-1 ${following ? 'bg-gray-100 text-gray-600' : 'bg-[#407BFF] hover:bg-blue-600 text-white'}`}
            >
                {following ? <><Check size={13} /> Seguindo</> : 'Seguir'}
            </button>
        </div>
    );
}
