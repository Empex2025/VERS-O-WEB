import { useState } from 'react';
import { Phone, Mail, IdCard, UserRound, CalendarDays, ChevronRight } from 'lucide-react';
import { AppShell } from '../../components/layout/AppShell';
import { PageHeader } from '../../components/layout/PageHeader';
import { useAuthStore } from '../../store/useAuthStore';

export function DadosPerfil() {
    const user = useAuthStore((s) => s.user) as { nome?: string; email?: string; telefone?: string } | null;
    const [tel, setTel] = useState(user?.telefone || '(00) 94002-8922');
    const [email, setEmail] = useState(user?.email || 'carlos.magno@email.com');
    const [cpf, setCpf] = useState('132.456.789-01');
    const [nome, setNome] = useState(user?.nome || 'Carlos Magno de Souza');
    const [nasc, setNasc] = useState('01/01/2000');

    return (
        <AppShell rightRail={null}>
            <div className="max-w-2xl mx-auto">
                <PageHeader
                    title="Editar Dados"
                    to="/meu-perfil/opcoes"
                    right={<button className="bg-[#01AEA4] text-white text-xs font-bold px-4 py-1.5 rounded-full hover:bg-teal-600 transition-colors">Salvar ajustes</button>}
                />

                <div className="flex flex-col gap-3">
                    <Field icon={<Phone size={16} className="text-gray-400" />} tag="Pessoal" value={tel} onChange={setTel} chevron />
                    <Field icon={<Mail size={16} className="text-gray-400" />} tag="Pessoal" value={email} onChange={setEmail} />
                    <Field label="CPF" icon={<IdCard size={16} className="text-gray-400" />} value={cpf} onChange={setCpf} />
                    <Field label="Nome Completo" icon={<UserRound size={16} className="text-gray-400" />} value={nome} onChange={setNome} />
                    <Field label="Data de Nascimento" icon={<CalendarDays size={16} className="text-gray-400" />} value={nasc} onChange={setNasc} />
                </div>
            </div>
        </AppShell>
    );
}

function Field({ label, tag, icon, value, onChange, chevron }: { label?: string; tag?: string; icon: React.ReactNode; value: string; onChange: (v: string) => void; chevron?: boolean }) {
    return (
        <div>
            {label && <p className="text-sm font-bold text-gray-800 mb-1.5">{label}</p>}
            <div className="flex items-center gap-2 bg-white border border-gray-200 rounded-xl px-4 h-12">
                {icon}
                <input value={value} onChange={(e) => onChange(e.target.value)} className="flex-1 bg-transparent text-sm text-gray-800 outline-none" />
                {tag && <span className="text-[10px] font-bold text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full">{tag}</span>}
                {chevron && <ChevronRight size={16} className="text-gray-300" />}
            </div>
        </div>
    );
}
