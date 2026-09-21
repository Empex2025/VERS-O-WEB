import { useState } from 'react';
import { MoreHorizontal, ImageIcon } from 'lucide-react';
import { AppShell } from '../../components/layout/AppShell';
import { PageHeader } from '../../components/layout/PageHeader';
import { PostCard } from '../../components/social/PostCard';
import { feedPosts } from '../../data/social';

const TABS = ['Publicações', 'Mídia', 'Pulses'] as const;

export function MinhasCurtidas() {
    const [tab, setTab] = useState<(typeof TABS)[number]>('Publicações');
    const posts = feedPosts;

    return (
        <AppShell rightRail={null}>
            <div className="max-w-2xl mx-auto">
                <PageHeader
                    title="Minhas Curtidas"
                    to="/meu-perfil/opcoes"
                    right={<button className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 hover:bg-gray-200"><MoreHorizontal size={16} /></button>}
                />

                {/* Abas */}
                <div className="flex gap-2 bg-gray-100 rounded-full p-1 mb-4">
                    {TABS.map((t) => (
                        <button
                            key={t}
                            onClick={() => setTab(t)}
                            className={`flex-1 py-2 rounded-full text-sm font-semibold transition-colors ${tab === t ? 'bg-white text-[#407BFF] shadow-sm' : 'text-gray-500'}`}
                        >
                            {t}
                        </button>
                    ))}
                </div>

                {tab === 'Publicações' && (
                    posts.length === 0 ? (
                        <p className="text-sm text-gray-400 py-10 text-center">Você ainda não curtiu publicações.</p>
                    ) : (
                        <div className="flex flex-col gap-4">
                            {posts.map((p) => <PostCard key={p.id} post={p} />)}
                        </div>
                    )
                )}

                {(tab === 'Mídia' || tab === 'Pulses') && (
                    <div className={tab === 'Pulses' ? 'grid grid-cols-3 gap-2' : 'grid grid-cols-2 gap-2'}>
                        {Array.from({ length: tab === 'Pulses' ? 6 : 4 }).map((_, i) => (
                            <div key={i} className={`${tab === 'Pulses' ? 'aspect-[9/16]' : 'aspect-square'} rounded-lg bg-gray-100 flex items-center justify-center text-gray-300`}>
                                <ImageIcon size={28} />
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </AppShell>
    );
}
