import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, AtSign, Link2, ChevronRight, X, Plus, Trash2, Stethoscope, Pencil, Type } from 'lucide-react';
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
    const [linksOpen, setLinksOpen] = useState(false);
    const [showBadge, setShowBadge] = useState(true);
    const [allowBooking, setAllowBooking] = useState(false);
    const [links, setLinks] = useState([
        { label: 'Dra. Maria Glenda', url: 'https://linktr.ee/dra.glenda' },
    ]);

    return (
        <AppShell rightRail={null}>
            <div className="max-w-2xl mx-auto">
                <PageHeader
                    title="Editar Perfil"
                    to="/meu-perfil"
                    right={
                        <button onClick={salvar} disabled={saving} className="bg-[#01AEA4] hover:bg-teal-600 text-white text-xs font-bold px-4 py-1.5 rounded-full transition-colors disabled:opacity-60">
                            {saving ? 'Salvando...' : 'Salvar ajustes'}
                        </button>
                    }
                />

                <div className="flex flex-col gap-4 pb-6">
                    {/* Foto de Perfil */}
                    <div className="flex items-center justify-between bg-white border border-gray-100 rounded-xl px-4 py-3">
                        <div className="flex items-center gap-3">
                            <Avatar name={nome || 'Perfil'} size={44} className="!rounded-xl" />
                            <span className="text-sm font-bold text-gray-900">Foto de Perfil</span>
                        </div>
                        <button className="flex items-center gap-1.5 bg-[#407BFF] hover:bg-blue-600 text-white text-xs font-bold px-4 py-1.5 rounded-full transition-colors">
                            <Pencil size={13} /> Editar
                        </button>
                    </div>

                    {/* Campos */}
                    <Field label="Nome Perfil">
                        <div className="flex items-center gap-2 bg-white border border-gray-200 rounded-xl px-4 h-12">
                            <User size={16} className="text-gray-400" />
                            <input value={nome} onChange={(e) => setNome(e.target.value)} placeholder="Seu nome" className="flex-1 bg-transparent text-sm text-gray-800 outline-none" />
                        </div>
                    </Field>

                    <Field label="Nome de Usuário">
                        <div className="flex items-center gap-2 bg-white border border-gray-200 rounded-xl px-4 h-12">
                            <AtSign size={16} className="text-gray-400" />
                            <input value={username} onChange={(e) => setUsername(e.target.value)} placeholder="seu.usuario" className="flex-1 bg-transparent text-sm text-gray-800 outline-none" />
                        </div>
                    </Field>

                    <Field label="Sobre mim">
                        <div className="bg-white border border-gray-200 rounded-xl px-4 py-3">
                            <div className="flex gap-2">
                                <Type size={16} className="text-gray-400 mt-0.5 shrink-0" />
                                <textarea
                                    rows={3}
                                    value={bio}
                                    onChange={(e) => setBio(e.target.value.slice(0, 350))}
                                    placeholder="Conte um pouco sobre você..."
                                    className="w-full bg-transparent text-sm text-gray-800 outline-none resize-none"
                                />
                            </div>
                            <span className="text-[11px] text-gray-400 block text-right">{bio.length}/350 caracteres</span>
                        </div>
                    </Field>

                    {/* Seus Links */}
                    <button onClick={() => setLinksOpen(true)} className="flex items-center gap-2 bg-white border border-gray-200 rounded-xl px-4 h-12 hover:border-[#407BFF]/40 transition-colors">
                        <Link2 size={16} className="text-gray-400 shrink-0" />
                        <span className="text-sm font-bold text-gray-800 flex-1 text-left">Seus Links</span>
                        <span className="text-xs text-gray-400">{links.length}</span>
                        <ChevronRight size={16} className="text-gray-300" />
                    </button>

                    {/* Preferências (profissional) */}
                    {isProfissional && (
                        <div className="flex flex-col gap-5 pt-1">
                            <div className="flex items-center gap-2">
                                <span className="text-sm font-bold text-gray-800">Exibir Selo de Especialidade</span>
                                <span className="inline-flex items-center gap-1 bg-[#01AEA4] text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                                    <Stethoscope size={10} /> Clínica Geral
                                </span>
                                <div className="flex-1" />
                                <Toggle value={showBadge} onChange={setShowBadge} />
                            </div>
                            <div className="flex items-center gap-2">
                                <span className="text-sm font-bold text-gray-800 flex-1">Permitir Agendamento de Consultas no Perfil</span>
                                <Toggle value={allowBooking} onChange={setAllowBooking} />
                            </div>
                        </div>
                    )}

                    <button onClick={() => navigate('/meu-perfil/tipo-perfil')} className="text-xs font-bold text-[#407BFF] underline self-start">
                        Alterar tipo de Perfil
                    </button>
                </div>
            </div>

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

/** Campo com label em negrito acima do controle (padrão do design). */
function Field({ label, children }: { label: string; children: React.ReactNode }) {
    return (
        <div>
            <p className="text-sm font-bold text-gray-800 mb-1.5">{label}</p>
            {children}
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
