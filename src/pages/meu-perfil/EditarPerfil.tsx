import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Pencil, Save, Link2, ChevronRight, X, Plus, RefreshCcw, Trash2 } from 'lucide-react';
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

    const [professional, setProfessional] = useState(false);
    const [confirmSwitch, setConfirmSwitch] = useState(false);
    const [linksOpen, setLinksOpen] = useState(false);
    const [showBadge, setShowBadge] = useState(true);
    const [allowBooking, setAllowBooking] = useState(false);
    const [links, setLinks] = useState([
        { label: 'Dra. Maria Glenda', url: 'https://linktr.ee/dra.glenda' },
        { label: 'Exames | Clínica Mais Saúde', url: 'https://exames.clinicamaissaude.com' },
    ]);
    const [editField, setEditField] = useState<null | 'nome' | 'usuario'>(null);

    return (
        <AppShell rightRail={null}>
            <div className="max-w-2xl mx-auto">
                <PageHeader
                    title={`Editar Dados`}
                    to="/meu-perfil"
                    right={
                        <button onClick={salvar} disabled={saving} className="flex items-center gap-1.5 text-xs font-bold text-white bg-emerald-500 hover:bg-emerald-600 px-4 py-2 rounded-full transition-colors disabled:opacity-60">
                            <Save size={14} /> {saving ? 'Salvando...' : 'Salvar ajustes'}
                        </button>
                    }
                />

                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 sm:p-6 flex flex-col gap-5">
                    {/* Foto de perfil */}
                    <div className="flex items-center gap-3">
                        <Avatar name="Carlos Magno" size={56} />
                        <span className="text-sm font-bold text-gray-800 flex-1">Foto de Perfil</span>
                        <button className="flex items-center gap-1.5 text-xs font-bold text-[#407BFF] border border-[#407BFF]/30 px-4 py-2 rounded-full hover:bg-[#407BFF]/5">
                            <Pencil size={13} /> Editar
                        </button>
                    </div>

                    <Field label="Nome Perfil" value={nome} onChange={setNome} />
                    <Field label="Nome de Usuário" value={username} onChange={setUsername} />

                    <div className="flex flex-col gap-1.5">
                        <label className="text-sm font-bold text-gray-800">Sobre mim</label>
                        <textarea
                            rows={3}
                            value={bio}
                            onChange={(e) => setBio(e.target.value.slice(0, 300))}
                            placeholder="Conte um pouco sobre você..."
                            className="w-full bg-[#F3F4F6] rounded-xl px-4 py-3 text-sm text-gray-700 outline-none resize-none focus:ring-2 focus:ring-[#407BFF]/20"
                        />
                        <span className="text-[11px] text-gray-400 self-end">{bio.length}/300 caracteres</span>
                    </div>

                    {/* Campos exclusivos de profissional */}
                    {professional && (
                        <>
                            <button
                                onClick={() => setLinksOpen(true)}
                                className="flex items-center gap-2 border-t border-gray-100 pt-4 text-sm font-bold text-gray-800"
                            >
                                <Link2 size={16} className="text-[#407BFF]" /> Seus Links
                                <ChevronRight size={16} className="text-gray-300 ml-auto" />
                            </button>

                            <ToggleRow label="Exibir Selo de Especialidade" badge="Clínica Geral" value={showBadge} onChange={setShowBadge} />
                            <ToggleRow label="Permitir Agendamento de Consultas no Perfil" value={allowBooking} onChange={setAllowBooking} />
                        </>
                    )}
                </div>

                {/* Trocar perfil */}
                <div className="flex items-center gap-3 mt-4 px-1">
                    <Avatar name="Carlos Magno" size={40} />
                    <div className="flex-1">
                        <p className="text-sm font-bold text-gray-900">Carlos Magno</p>
                        <p className="text-xs text-gray-400">{professional ? 'Profissional' : 'Paciente'}</p>
                    </div>
                    <button
                        onClick={() => setConfirmSwitch(true)}
                        className="flex items-center gap-1 text-xs font-bold text-[#407BFF] hover:underline"
                    >
                        <RefreshCcw size={13} /> Trocar Perfil
                    </button>
                </div>
            </div>

            {/* Confirmação trocar perfil */}
            {confirmSwitch && (
                <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4">
                    <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm p-6 text-center relative">
                        <button onClick={() => setConfirmSwitch(false)} className="absolute top-4 right-4 text-gray-400"><X size={18} /></button>
                        <h3 className="text-base font-bold text-gray-900 mt-2">
                            Você tem certeza que quer trocar para {professional ? 'Perfil Paciente' : 'Perfil Profissional'}?
                        </h3>
                        <p className="text-sm text-gray-500 mt-2">
                            {professional
                                ? 'Você voltará a usar sua conta como paciente.'
                                : 'Será necessário verificar suas informações profissionais como Nome e Registro Especialista (se houver).'}
                        </p>
                        <button
                            onClick={() => { setProfessional((v) => !v); setConfirmSwitch(false); }}
                            className="w-full mt-5 bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-sm py-3 rounded-full transition-colors"
                        >
                            Trocar para {professional ? 'Paciente' : 'Profissional'}
                        </button>
                        <button onClick={() => setConfirmSwitch(false)} className="w-full mt-2 text-rose-500 font-semibold text-sm py-2">Voltar</button>
                    </div>
                </div>
            )}

            {/* Editar Nome / Nome de Usuário */}
            {editField && <NameEditModal field={editField} onClose={() => setEditField(null)} />}

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

function Field({ label, value, onChange, onEdit }: { label: string; value: string; onChange?: (v: string) => void; onEdit?: () => void }) {
    return (
        <div className="flex flex-col gap-1.5">
            <label className="text-sm font-bold text-gray-800">{label}</label>
            <div className="relative flex items-center bg-[#F3F4F6] rounded-xl focus-within:ring-2 focus-within:ring-[#407BFF]/20">
                <input
                    value={value}
                    onChange={onChange ? (e) => onChange(e.target.value) : undefined}
                    className="flex-1 bg-transparent px-4 py-3 text-sm text-gray-700 outline-none"
                />
                {onEdit && (
                    <button onClick={onEdit} className="px-3 text-gray-400 hover:text-[#407BFF]"><Pencil size={15} /></button>
                )}
            </div>
        </div>
    );
}

const USERNAME_SUGGESTIONS = ['carlos.magno', 'carlosmagno1', 'c.magno014', 'go_magno14'];

function NameEditModal({ field, onClose }: { field: 'nome' | 'usuario'; onClose: () => void }) {
    const isUser = field === 'usuario';
    return (
        <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4" onClick={onClose}>
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm overflow-hidden" onClick={(e) => e.stopPropagation()}>
                <div className="flex items-center gap-2 p-4 border-b border-gray-100">
                    <button onClick={onClose} className="text-gray-500"><X size={18} /></button>
                    <h3 className="font-bold text-gray-900 text-sm flex-1">{isUser ? 'Nome de Usuário' : 'Nome Perfil'}</h3>
                </div>
                <div className="p-4">
                    {isUser && <p className="text-xs text-gray-500 mb-3">Poderá ajustar só pode em falta após 14 dias. Pode ser uma mistura de letras, números e caracteres especiais.</p>}
                    <input
                        defaultValue={isUser ? 'carlos.magno' : 'Carlos Magno de Souza'}
                        className="w-full bg-[#F3F4F6] rounded-lg px-3 py-2.5 text-sm outline-none mb-3"
                    />
                    {isUser && (
                        <>
                            <p className="text-xs font-semibold text-gray-500 mb-2">Alguns nomes disponíveis</p>
                            <div className="flex flex-col gap-1 mb-3">
                                {USERNAME_SUGGESTIONS.map((s) => (
                                    <button key={s} className="text-left text-sm text-[#407BFF] hover:underline">{s}</button>
                                ))}
                            </div>
                        </>
                    )}
                    <button onClick={onClose} className="w-full bg-[#407BFF] hover:bg-blue-600 text-white font-bold text-sm py-3 rounded-full">Salvar</button>
                </div>
            </div>
        </div>
    );
}

function ToggleRow({ label, badge, value, onChange }: { label: string; badge?: string; value: boolean; onChange: (v: boolean) => void }) {
    return (
        <div className="flex items-center gap-2">
            <span className="text-sm text-gray-700 flex-1">{label}</span>
            {badge && <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">{badge}</span>}
            <button onClick={() => onChange(!value)} className={`w-10 h-6 rounded-full p-0.5 transition-colors ${value ? 'bg-[#407BFF]' : 'bg-gray-300'}`}>
                <span className={`block w-5 h-5 rounded-full bg-white transition-transform ${value ? 'translate-x-4' : ''}`} />
            </button>
        </div>
    );
}
