import { useState } from 'react';
import { Image, Zap, Clapperboard, Radio, StickyNote, Globe, ChevronDown, X, Type, Video, Upload } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { AppShell } from '../../components/layout/AppShell';
import { Avatar } from '../../components/ui/Avatar';
import { currentUser } from '../../data/social';
import { socialService } from '../../services/socialService';
import { useAuthStore } from '../../store/useAuthStore';

type Editor = null | 'flash' | 'aovivo' | 'media' | 'pulse';

const OPTIONS: { label: string; icon: typeof Image; color: string; editor: Editor }[] = [
    { label: 'Nota', icon: StickyNote, color: 'text-amber-500', editor: null },
    { label: 'Fotos e Vídeos', icon: Image, color: 'text-rose-500', editor: 'media' },
    { label: 'Flash', icon: Zap, color: 'text-[#407BFF]', editor: 'flash' },
    { label: 'Pulse', icon: Clapperboard, color: 'text-emerald-500', editor: 'pulse' },
    { label: 'Ao Vivo', icon: Radio, color: 'text-red-500', editor: 'aovivo' },
];

export function CriarPost() {
    const navigate = useNavigate();
    const [text, setText] = useState('');
    const [editor, setEditor] = useState<Editor>(null);
    const [publishing, setPublishing] = useState(false);
    const userId = useAuthStore((s) => s.user?.id);

    const handlePublish = async () => {
        if (!text.trim()) return;
        setPublishing(true);
        try {
            await socialService.posts.create({
                conteudo: text.trim(),
                autor_id: userId ?? 0,
                tipo_conteudo: 'texto',
            });
        } catch {
            // API fora do ar: segue em modo demo
        } finally {
            setPublishing(false);
            navigate('/inicio');
        }
    };

    return (
        <AppShell>
            <div className="max-w-xl mx-auto">
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
                    <h1 className="text-lg font-bold text-gray-900 mb-4">Criar publicação</h1>

                    {/* Autor + audiência */}
                    <div className="flex items-center gap-3 mb-4">
                        <Avatar name={currentUser.name} size={44} />
                        <div>
                            <p className="text-sm font-bold text-gray-900">{currentUser.name}</p>
                            <button className="flex items-center gap-1 text-xs text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full mt-0.5">
                                <Globe size={12} /> Público <ChevronDown size={12} />
                            </button>
                        </div>
                    </div>

                    {/* Composer */}
                    <textarea
                        value={text}
                        onChange={(e) => setText(e.target.value)}
                        placeholder="No que você está pensando?"
                        rows={5}
                        className="w-full text-sm text-gray-700 outline-none resize-none placeholder-gray-400"
                    />

                    {/* Adicionar à publicação */}
                    <p className="text-xs font-semibold text-gray-400 border-t border-gray-100 pt-4 mt-2 mb-2">Adicionar à publicação</p>
                    <div className="flex flex-wrap gap-2">
                        {OPTIONS.map(({ label, icon: Icon, color, editor: ed }) => (
                            <button
                                key={label}
                                onClick={() => ed && setEditor(ed)}
                                className="flex items-center gap-2 text-sm font-medium text-gray-600 bg-gray-50 hover:bg-gray-100 px-3 py-2 rounded-lg transition-colors"
                            >
                                <Icon size={18} className={color} /> {label}
                            </button>
                        ))}
                    </div>

                    <button
                        onClick={handlePublish}
                        disabled={!text.trim() || publishing}
                        className={`w-full mt-4 font-bold text-sm py-3 rounded-full transition-colors ${
                            text.trim() && !publishing ? 'bg-[#407BFF] hover:bg-blue-600 text-white' : 'bg-[#E5E7EB] text-gray-400 cursor-not-allowed'
                        }`}
                    >
                        {publishing ? 'Publicando...' : 'Publicar'}
                    </button>
                </div>
            </div>

            {editor === 'flash' && <FlashEditor onClose={() => setEditor(null)} />}
            {editor === 'aovivo' && <LiveModal onClose={() => setEditor(null)} />}
            {(editor === 'media' || editor === 'pulse') && (
                <UploadModal
                    title={editor === 'media' ? 'Fotos e Vídeos' : 'Criar Pulse'}
                    hint={editor === 'media' ? 'Arraste fotos e vídeos ou selecione do dispositivo' : 'Envie um vídeo vertical para criar seu Pulse'}
                    onClose={() => setEditor(null)}
                />
            )}
        </AppShell>
    );
}

const FLASH_COLORS = ['#407BFF', '#10B981', '#8B5CF6', '#F43F5E', '#F59E0B', '#0EA5E9', '#111827', '#EC4899'];

function FlashEditor({ onClose }: { onClose: () => void }) {
    const [color, setColor] = useState(FLASH_COLORS[0]);
    const [flashText, setFlashText] = useState('');

    return (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm overflow-hidden">
                <div className="flex items-center justify-between p-4 border-b border-gray-100">
                    <h3 className="font-bold text-gray-900 flex items-center gap-2"><Type size={18} /> Criar Flash</h3>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600"><X size={18} /></button>
                </div>

                {/* Canvas */}
                <div className="p-4">
                    <div className="rounded-xl aspect-[9/16] flex items-center justify-center p-6 transition-colors" style={{ backgroundColor: color }}>
                        <textarea
                            value={flashText}
                            onChange={(e) => setFlashText(e.target.value)}
                            placeholder="Escreva algo..."
                            className="w-full bg-transparent text-white text-center text-xl font-bold outline-none resize-none placeholder-white/60"
                            rows={4}
                        />
                    </div>

                    {/* Paleta de cores */}
                    <div className="flex gap-2 justify-center mt-4">
                        {FLASH_COLORS.map((c) => (
                            <button
                                key={c}
                                onClick={() => setColor(c)}
                                className={`w-7 h-7 rounded-full transition-transform ${color === c ? 'ring-2 ring-offset-2 ring-gray-400 scale-110' : ''}`}
                                style={{ backgroundColor: c }}
                            />
                        ))}
                    </div>
                </div>

                <div className="p-4 border-t border-gray-100">
                    <button onClick={onClose} className="w-full bg-[#407BFF] hover:bg-blue-600 text-white font-bold text-sm py-3 rounded-full transition-colors">
                        Publicar Flash
                    </button>
                </div>
            </div>
        </div>
    );
}

function LiveModal({ onClose }: { onClose: () => void }) {
    return (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden">
                <div className="flex items-center justify-between p-4 border-b border-gray-100">
                    <h3 className="font-bold text-gray-900 flex items-center gap-2"><Radio size={18} className="text-red-500" /> Ao Vivo</h3>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600"><X size={18} /></button>
                </div>
                <div className="p-4">
                    <div className="rounded-xl aspect-video bg-gray-900 flex flex-col items-center justify-center text-white/50 gap-2">
                        <Video size={40} />
                        <p className="text-sm">Câmera e microfone</p>
                    </div>
                    <p className="text-xs text-gray-500 text-center mt-3">Ao iniciar, seus seguidores serão notificados da transmissão.</p>
                    <button onClick={onClose} className="w-full mt-4 bg-red-500 hover:bg-red-600 text-white font-bold text-sm py-3 rounded-full transition-colors">
                        Iniciar transmissão
                    </button>
                </div>
            </div>
        </div>
    );
}

function UploadModal({ title, hint, onClose }: { title: string; hint: string; onClose: () => void }) {
    return (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden">
                <div className="flex items-center justify-between p-4 border-b border-gray-100">
                    <h3 className="font-bold text-gray-900">{title}</h3>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600"><X size={18} /></button>
                </div>
                <div className="p-4">
                    <div className="rounded-xl border-2 border-dashed border-gray-200 aspect-video flex flex-col items-center justify-center text-gray-400 gap-2">
                        <Upload size={36} />
                        <p className="text-sm text-center px-6">{hint}</p>
                    </div>
                    <button className="w-full mt-4 bg-[#407BFF] hover:bg-blue-600 text-white font-bold text-sm py-3 rounded-full transition-colors">
                        Selecionar arquivo
                    </button>
                </div>
            </div>
        </div>
    );
}
