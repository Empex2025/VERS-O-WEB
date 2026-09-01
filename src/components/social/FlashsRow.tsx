import { Plus } from 'lucide-react';
import { Avatar } from '../ui/Avatar';
import { flashPeople } from '../../data/social';

export function FlashsRow() {
    return (
        <section className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
            <h2 className="text-sm font-bold text-gray-900 mb-3">Flashs</h2>
            <div className="flex gap-4 overflow-x-auto pb-1">
                {/* Seu Flash */}
                <button className="flex flex-col items-center gap-1.5 shrink-0 w-16">
                    <span className="w-14 h-14 rounded-full bg-[#407BFF]/10 border-2 border-dashed border-[#407BFF] flex items-center justify-center text-[#407BFF]">
                        <Plus size={22} />
                    </span>
                    <span className="text-[11px] text-gray-500 truncate w-full text-center">Seu Flash</span>
                </button>

                {flashPeople.map((p) => (
                    <button key={p.handle} className="flex flex-col items-center gap-1.5 shrink-0 w-16">
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
