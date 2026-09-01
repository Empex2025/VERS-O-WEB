import { useState } from 'react';
import { Search, X, MapPin } from 'lucide-react';
import { AppShell } from '../../components/layout/AppShell';
import { FlashsRow } from '../../components/social/FlashsRow';
import { PostCard } from '../../components/social/PostCard';
import { Avatar } from '../../components/ui/Avatar';
import { feedPosts, suggestions } from '../../data/social';
import { socialService } from '../../services/socialService';
import { useApiData } from '../../hooks/useApiData';

const ONBOARDED_KEY = 'isaude_onboarded';

export function Home() {
    // Primeiro acesso: mostra onboarding e, em seguida, permissão de localização
    const [step, setStep] = useState<'onboarding' | 'location' | 'done'>(
        () => (localStorage.getItem(ONBOARDED_KEY) ? 'done' : 'onboarding'),
    );
    const [tab, setTab] = useState<'feed' | 'pulses'>('feed');

    // Feed real da API (fallback para o mock quando a API está fora do ar)
    const { data: posts } = useApiData(() => socialService.getFeed({ limit: 30 }), feedPosts, []);

    const finishOnboarding = () => {
        localStorage.setItem(ONBOARDED_KEY, '1');
        setStep('done');
    };

    return (
        <AppShell>
            <div className="max-w-xl mx-auto flex flex-col gap-4">
                <FlashsRow />

                {/* Abas */}
                <div className="flex gap-2">
                    <button
                        onClick={() => setTab('feed')}
                        className={`px-5 py-1.5 rounded-full text-sm font-semibold transition-colors ${
                            tab === 'feed' ? 'bg-[#407BFF] text-white' : 'bg-white text-gray-500 border border-gray-200'
                        }`}
                    >
                        Feed
                    </button>
                    <button
                        onClick={() => setTab('pulses')}
                        className={`px-5 py-1.5 rounded-full text-sm font-semibold transition-colors ${
                            tab === 'pulses' ? 'bg-[#407BFF] text-white' : 'bg-white text-gray-500 border border-gray-200'
                        }`}
                    >
                        Pulses
                    </button>
                </div>

                {/* Feed */}
                {posts.map((post) => (
                    <PostCard key={post.id} post={post} />
                ))}
            </div>

            {/* Onboarding — primeiro acesso */}
            {step === 'onboarding' && (
                <OnboardingModal onClose={() => setStep('location')} />
            )}

            {/* Permissão de localização */}
            {step === 'location' && (
                <LocationPrompt onDone={finishOnboarding} />
            )}
        </AppShell>
    );
}

function OnboardingModal({ onClose }: { onClose: () => void }) {
    return (
        <div className="fixed inset-0 z-40 bg-black/40 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6 relative">
                <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600">
                    <X size={20} />
                </button>
                <h2 className="text-lg font-bold text-gray-900 mb-1">Vamos começar sua jornada!</h2>
                <p className="text-sm text-gray-500 mb-4">
                    Encontre profissionais, perfis e temas do seu interesse para personalizar seu feed com conteúdo relevante.
                </p>

                <div className="relative mb-4">
                    <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                        placeholder="Busque por pessoas, assuntos e muito mais..."
                        className="w-full bg-[#F3F4F6] rounded-xl py-3 pl-10 pr-4 text-sm outline-none focus:ring-2 focus:ring-[#407BFF]/20"
                    />
                </div>

                <div className="flex flex-col gap-1 max-h-64 overflow-y-auto">
                    {suggestions.map((p) => (
                        <div key={p.handle} className="flex items-center gap-3 py-2">
                            <Avatar name={p.name} size={40} />
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-semibold text-gray-900 truncate flex items-center gap-1">
                                    {p.name}
                                    {p.verified && <span className="text-[#407BFF] text-xs">✔</span>}
                                </p>
                                <p className="text-xs text-gray-400 truncate">{p.role}</p>
                            </div>
                            <button className="text-xs font-bold text-white bg-[#407BFF] hover:bg-blue-600 px-5 py-2 rounded-full transition-colors">
                                Seguir
                            </button>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

function LocationPrompt({ onDone }: { onDone: () => void }) {
    return (
        <div className="fixed top-20 right-6 z-40 bg-white rounded-2xl shadow-xl border border-gray-100 w-80 p-4">
            <div className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-full bg-[#407BFF]/10 flex items-center justify-center text-[#407BFF] shrink-0">
                    <MapPin size={18} />
                </div>
                <div className="flex-1">
                    <p className="text-sm font-bold text-gray-900">Localização em tempo real</p>
                    <p className="text-xs text-gray-500 mt-1 leading-relaxed">
                        Usaremos essa informação para conectar você a pessoas e locais próximos, além de oferecer
                        conteúdo personalizado enquanto você navega no app.
                    </p>
                </div>
                <button onClick={onDone} className="text-gray-400 hover:text-gray-600"><X size={16} /></button>
            </div>
            <button
                onClick={onDone}
                className="w-full mt-4 bg-[#407BFF] hover:bg-blue-600 text-white font-bold text-sm py-2.5 rounded-full transition-colors"
            >
                Permitir
            </button>
        </div>
    );
}
