import { Plus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Avatar } from '../ui/Avatar';
import { socialService } from '../../services/socialService';
import { profileService } from '../../services/profileService';
import { useApiData } from '../../hooks/useApiData';

interface RawStory { autor_id?: number }
interface FlashAuthor { id: number; name: string; handle: string }

/** Autores com story ativo (`GET /story`), enriquecidos com nome/username. */
async function fetchFlashAuthors(): Promise<FlashAuthor[]> {
    const raw = await socialService.stories.list<{ results: RawStory[] } | RawStory[]>();
    const list = Array.isArray(raw) ? raw : raw?.results ?? [];
    const ids = [...new Set(list.map((s) => s.autor_id).filter(Boolean))] as number[];
    const authors = await Promise.all(
        ids.map(async (id) => {
            let u: { nome?: string; username?: string } | undefined;
            try { u = await profileService.getPublicUser(id); } catch { /* fallback */ }
            return { id, name: u?.nome || `Usuário ${id}`, handle: u?.username ? `@${u.username}` : `@user${id}` };
        }),
    );
    return authors;
}

export function FlashsRow() {
    const navigate = useNavigate();
    const { data: people } = useApiData<FlashAuthor[]>(fetchFlashAuthors, [], []);

    return (
        <section className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
            <h2 className="text-sm font-bold text-gray-900 mb-3">Flashs</h2>
            <div className="flex gap-4 overflow-x-auto pb-1">
                {/* Seu Flash */}
                <button onClick={() => navigate('/criar-post')} className="flex flex-col items-center gap-1.5 shrink-0 w-16">
                    <span className="w-14 h-14 rounded-full bg-[#407BFF]/10 border-2 border-dashed border-[#407BFF] flex items-center justify-center text-[#407BFF]">
                        <Plus size={22} />
                    </span>
                    <span className="text-[11px] text-gray-500 truncate w-full text-center">Seu Flash</span>
                </button>

                {people.map((p) => (
                    <button key={p.id} onClick={() => navigate('/flashs')} className="flex flex-col items-center gap-1.5 shrink-0 w-16">
                        <span className="p-[2px] rounded-full bg-gradient-to-tr from-[#407BFF] to-emerald-400">
                            <span className="block p-[2px] bg-white rounded-full">
                                <Avatar name={p.name} size={48} />
                            </span>
                        </span>
                        <span className="text-[11px] text-gray-500 truncate w-full text-center">
                            {p.handle.replace('@', '').slice(0, 8)}
                        </span>
                    </button>
                ))}
            </div>
        </section>
    );
}
