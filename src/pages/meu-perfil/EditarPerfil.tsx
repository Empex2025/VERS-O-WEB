import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, AtSign, Link2, ChevronRight, X, Plus, Trash2, Stethoscope } from 'lucide-react';
import { AppShell } from '../../components/layout/AppShell';
import { PageHeader } from '../../components/layout/PageHeader';
import { Avatar } from '../../components/ui/Avatar';
import { useAuthStore } from '../../store/useAuthStore';
import { profileService } from '../../services/profileService';

export function EditarPerfil() {
    const navigate = useNavigate();
    const user = useAuthStore((s) => s.user) as any;
    const token = useAuthStore((s) => s.token);
    const setAuth = useAuthStore((s) => s.setAuth);
    const [nome, setNome] = useState<string>(user?.nome ?? '');
    const [username, setUsername] = useState<string>(user?.username ?? user?.email?.split('@')[0] ?? '');
    const [bio, setBio] = useState<string>(user?.descricao_bio ?? '');
    const [saving, setSaving] = useState(false);

    const salvar = async () => {
        if (!user?.id) return;
        setSaving(true);
        try {
            await profileService.updateUser(user.id, { nome: nome.trim(), username: username.trim(), descricao_bio: bio });
            if (token) setAuth(token, { ...user, nome: nome.trim(), username: username.trim(), descricao_bio: bio });
        } catch { /* mantém local */ } finally {
            setSaving(false);
            navigate('/meu-perfil');
        }
    };

    const isProfissional = user?.tipo_usuario === 'profissional' || user?.tipo_usuario === 'clinica';
    const [confirmSwitch, setConfirmSwitch] = useState(false);
    const [linksOpen, setLinksOpen] = useState(false);
    const [showBadge, setShowBadge] = useState(true);
    const [allowBooking, setAllowBooking] = useState(false);
    const [links, setLinks] = useState([
        { label: 'Dra. Maria Glenda', url: 'https://linktr.ee/dra.glenda' },
    ]);

    return (
        <AppShell rightRail={null}>
            <div className="max-w-3xl mx-auto">
                <PageHeader title="Editar Perfil" to="/meu-perfil" />

                <div className="max-w-[560px] mx-auto flex flex-col gap-6 pt-2 pb-6">
                    {/* Foto de perfil — centralizada */}
                    <div className="flex flex-col items-center gap-2.5">
                        <div className="p-1 rounded-[26px] ring-2 ring-[#407BFF]">
                            <Avatar name={nome || 'Perfil'} size={90} />
                        </div>
                        <button className="text-xs font-bold text-[#407BFF] underline">Alterar Foto de Perfil</button>
                    </div>

                    {/* Campos (cards) */}
                    <div className="flex flex-col gap-2">
                        <InputCard icon={<User size={15} />} label="Nome" value={nome} onChange={setNome} placeholder="Seu nome" />
                        <InputCard icon={<AtSign size={15} />} label="Nome de Usuário" value={username} onChange={setUsername} placeholder="seu.usuario" />

                        <div className="bg-[#F3F4F6] rounded-xl px-3 py-2.5">
                            <p className="text-[10px] font-semibold text-gray-500">Sobre mim</p>
                            <textarea
                                rows={3}
                                value={bio}
                                onChange={(e) => setBio(e.target.value.slice(0, 300))}
                                placeholder="Conte um pouco sobre você..."
                                className="w-full bg-transparent text-xs font-bold text-gray-800 outline-none resize-none mt-1"
                            />
                            <span className="text-[10px] text-gray-400 block text-right">{bio.length}/300</span>
                        </div>

                        {isProfissional && (
                            <button onClick={() => setLinksOpen(true)} className="bg-[#F3F4F6] rounded-xl px-3 h-[52px] flex items-center gap-2.5 hover:bg-[#eceef1] transition-colors">
                                <Link2 size={15} className="text-gray-500 shrink-0" />
                                <span className="text-xs font-bold text-gray-800 flex-1 text-left">Seus Links</span>
                                <span className="text-[10px] text-gray-400">{links.length}</span>
                                <ChevronRight size={14} className="text-gray-300" />
                            </button>
                        )}
                    </div>

                    {/* Preferências (profissional) */}
                    {isProfissional && (
                        <div className="flex flex-col gap-5">
                            <div className="flex items-center gap-2">
                                <span className="text-xs font-bold text-gray-800">Exibir Selo de Especialidade</span>
                                <span className="inline-flex items-center gap-1 bg-[#01AEA4] text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                                    <Stethoscope size={10} /> Clínica Geral
                                </span>
                                <div className="flex-1" />
                                <Toggle value={showBadge} onChange={setShowBadge} />
                            </div>
                            <div className="flex items-center gap-2">
                                <span className="text-xs font-bold text-gray-800 flex-1">Permitir Agendamento de Consultas no Perfil</span>
                                <Toggle value={allowBooking} onChange={setAllowBooking} />
                            </div>
                        </div>
                    )}

                    <button onClick={() => navigate('/meu-perfil/tipo-perfil')} className="text-xs font-bold text-[#407BFF] underline self-start">
                        Alterar tipo de Perfil
                    </button>

                    {/* Salvar */}
                    <div className="flex justify-end pt-2">
                        <button
                            onClick={salvar}
                            disabled={saving}
                            className="bg-[#407BFF] hover:bg-blue-600 text-white text-sm font-bold px-6 py-2.5 rounded-full transition-colors disabled:opacity-60"
                        >
                            {saving ? 'Salvando...' : 'Salvar Alterações'}
                        </button>
                    </div>
                </div>
            </div>

            {/* Confirmação: alterar tipo de perfil */}
            {confirmSwitch && (
                <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4">
                    <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm p-6 text-center relative">
                        <button onClick={() => setConfirmSwitch(false)} className="absolute top-4 right-4 text-gray-400"><X size={18} /></button>
                        <h3 className="text-base font-bold text-gray-900 mt-2">
                            Você tem certeza que deseja trocar para {isProfissional ? 'Perfil Pessoal' : 'Perfil Profissional'}?
                        </h3>
                        <p className="text-sm text-gray-500 mt-2">
                            {isProfissional
                                ? 'Você não poderá oferecer serviços enquanto estiver com perfil pessoal.'
                                : 'Será necessário verificar suas informações profissionais.'}
                        </p>
                        <button
                            onClick={() => { setConfirmSwitch(false); navigate('/verificacao'); }}
                            className="w-full mt-5 bg-[#407BFF] hover:bg-blue-600 text-white font-bold text-sm py-3 rounded-full transition-colors"
                        >
                            Trocar para {isProfissional ? 'Pessoal' : 'Profissional'}
                        </button>
                        <button onClick={() => setConfirmSwitch(false)} className="w-full mt-2 text-rose-500 font-semibold text-sm py-2">Voltar</button>
                    </div>
                </div>
            )}

            {/* Seus Links */}
            {linksOpen && (
                <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4" onClick={() => setLinksOpen(false)}>
                    <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm overflow-hidden" onClick={(e) => e.stopPropagation()}>
                        <div className="flex items-center justify-between p-4 border-b border-gray-100">
                            <h3 className="font-bold text-gray-900 text-sm">Seus Links</h3>
                            <button onClick={() => setLinksOpen(false)} className="text-gray-400"><X size={18} /></button>
                        </div>
                        <div className="p-4 flex flex-col gap-2">
                            {links.map((l, i) => (
                                <div key={i} className="flex items-center gap-2 border border-gray-100 rounded-lg px-3 py-2.5">
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-semibold text-gray-800 truncate">{l.label}</p>
                                        <p className="text-xs text-gray-400 truncate">{l.url}</p>
                                    </div>
                                    <button onClick={() => setLinks((prev) => prev.filter((_, idx) => idx !== i))} className="text-gray-300 hover:text-rose-500">
                                        <Trash2 size={16} />
                                    </button>
                                </div>
                            ))}
                            <button className="flex items-center justify-center gap-1 text-[#407BFF] font-bold text-sm py-2.5 border border-dashed border-[#407BFF]/40 rounded-lg hover:bg-[#407BFF]/5">
                                Adicionar Link <Plus size={16} />
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </AppShell>
    );
}

/** Card de campo: ícone + label pequeno + input (padrão do design). */
function InputCard({ icon, label, value, onChange, placeholder }: { icon: React.ReactNode; label: string; value: string; onChange: (v: string) => void; placeholder?: string }) {
    return (
        <div className="bg-[#F3F4F6] rounded-xl px-3 h-[62px] flex items-center gap-2.5">
            <span className="text-gray-500 shrink-0">{icon}</span>
            <div className="flex-1 min-w-0">
                <p className="text-[10px] font-semibold text-gray-500">{label}</p>
                <input
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    placeholder={placeholder}
                    className="w-full bg-transparent text-xs font-bold text-gray-800 outline-none"
                />
            </div>
        </div>
    );
}

/** Switch pill do design (28×16, knob 12). */
function Toggle({ value, onChange }: { value: boolean; onChange: (v: boolean) => void }) {
    return (
        <button
            onClick={() => onChange(!value)}
            className={`w-7 h-4 rounded-full p-0.5 shrink-0 transition-colors ${value ? 'bg-[#407BFF]' : 'bg-[#EFF1F5]'}`}
        >
            <span className={`block w-3 h-3 rounded-full transition-transform ${value ? 'bg-white translate-x-3' : 'bg-[#6f7288]'}`} />
        </button>
    );
}
