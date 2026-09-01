import type { ComponentType } from 'react';
import { Zap } from 'lucide-react';
import { AppShell } from '../../components/layout/AppShell';

function Placeholder({ title, subtitle, Icon }: { title: string; subtitle: string; Icon: ComponentType<{ size?: number; className?: string }> }) {
    return (
        <AppShell>
            <div className="max-w-xl mx-auto flex flex-col items-center text-center py-24">
                <div className="w-20 h-20 rounded-3xl bg-[#407BFF]/10 flex items-center justify-center mb-6">
                    <Icon size={36} className="text-[#407BFF]" />
                </div>
                <h1 className="text-2xl font-bold text-gray-900 mb-2">{title}</h1>
                <p className="text-gray-500 text-sm max-w-sm">{subtitle}</p>
            </div>
        </AppShell>
    );
}

export function Flashs() {
    return <Placeholder title="Flashs" subtitle="Momentos rápidos dos perfis que você segue. Em construção." Icon={Zap} />;
}
