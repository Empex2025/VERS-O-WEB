import { Check } from 'lucide-react';

/** Stepper horizontal. `current` é 1-indexado; passos < current ficam concluídos. */
export function Stepper({ current, total = 4 }: { current: number; total?: number }) {
    return (
        <div className="flex items-center px-2 mb-8">
            {Array.from({ length: total }).map((_, i) => {
                const step = i + 1;
                const done = step < current;
                const active = step === current;
                return (
                    <div key={step} className="flex items-center flex-1 last:flex-none">
                        <div
                            className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold shrink-0 transition-colors ${
                                done ? 'bg-emerald-500 text-white' : active ? 'bg-[#407BFF] text-white' : 'bg-gray-200 text-gray-400'
                            }`}
                        >
                            {done ? <Check size={15} strokeWidth={3} /> : step}
                        </div>
                        {i < total - 1 && (
                            <div className={`h-0.5 flex-1 mx-2 rounded ${step < current ? 'bg-emerald-500' : 'bg-gray-200'}`} />
                        )}
                    </div>
                );
            })}
        </div>
    );
}
