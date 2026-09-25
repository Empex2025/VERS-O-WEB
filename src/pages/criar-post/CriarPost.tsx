import { useState, useRef } from 'react';
import { Users, Globe, ChevronDown, ChevronLeft, X, Camera, Image as ImageIcon, UserPlus, MapPin, ChevronRight, Zap, Clapperboard, Radio, Type, Video, Upload, SlidersHorizontal, ZoomIn, Scissors, Sparkles, Maximize2, Loader2, AlertCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { AppShell } from '../../components/layout/AppShell';
import { Avatar } from '../../components/ui/Avatar';
import { socialService } from '../../services/socialService';
import { useAuthStore } from '../../store/useAuthStore';

type Editor = null | 'flash' | 'aovivo' | 'pulse';
const AUDIENCES = [
    { id: 'seguidores', label: 'Apenas Seguidores', icon: Users },
    { id: 'publico', label: 'Público', icon: Globe },
];

export function CriarPost() {
    const navigate = useNavigate();
    const [text, setText] = useState('');
    const [editor, setEditor] = useState<Editor>(null);
    const [publishing, setPublishing] = useState(false);
    const [audOpen, setAudOpen] = useState(false);
    const [aud, setAud] = useState(AUDIENCES[0]);
    const [photos, setPhotos] = useState<{ file: File; preview: string }[]>([]);
    const [pessoas, setPessoas] = useState(0);
    const [local, setLocal] = useState<string | null>(null);
    const userId = useAuthStore((s) => s.user?.id);
    const meName = useAuthStore((s) => s.user?.nome) || 'Você';
    const fileRef = useRef<HTMLInputElement>(null);

    const addPhotos = (files: FileList | null) => {
        if (!files) return;
        const imgs = Array.from(files).filter((f) => f.type.startsWith('image/'));
        setPhotos((p) => [...p, ...imgs.map((file) => ({ file, preview: URL.createObjectURL(file) }))]);
    };

    const removePhoto = (i: number) =>
        setPhotos((p) => {
            URL.revokeObjectURL(p[i]?.preview);
            return p.filter((_, idx) => idx !== i);
        });

    const handlePublish = async () => {
        if (!text.trim() && photos.length === 0) return;
        setPublishing(true);
        try {
            // Sobe as imagens e guarda as URLs públicas em `midias` (JSON).
            let midias: string | undefined;
            if (photos.length) {
                const urls = await Promise.all(photos.map((p) => socialService.uploadMedia(p.file)));
                midias = JSON.stringify(urls);
            }
            await socialService.posts.create({
                conteudo: text.trim(),
                autor_id: userId ?? 0,
                tipo_conteudo: photos.length ? 'foto' : 'texto',
                ...(midias ? { midias } : {}),
            });
        } catch { /* modo demo */ } finally {
            setPublishing(false);
            navigate('/inicio');
        }
    };

    return (
        <AppShell rightRail={null}>
            <div className="max-w-2xl mx-auto">
                <div className="bg-white rounded-2xl border border-gray-100 shadow-lg p-5">
                    {/* Autor + audiência */}
                    <div className="flex items-center gap-3">
                        <Avatar name={meName} size={40} />
                        <div className="relative">
                            <button onClick={() => setAudOpen((v) => !v)} className="flex items-center gap-2 text-sm font-bold text-gray-800 bg-[#01AEA4]/10 text-[#01AEA4] px-3 py-1.5 rounded-full">
                                <aud.icon size={15} /> {aud.label} <ChevronDown size={14} />
                            </button>
                            {audOpen && (
                                <div className="absolute top-full left-0 mt-1 bg-white rounded-xl shadow-lg border border-gray-100 z-10 w-48 overflow-hidden">
                                    {AUDIENCES.map((a) => (
                                        <button key={a.id} onClick={() => { setAud(a); setAudOpen(false); }} className="w-full flex items-center gap-2 px-3 py-2.5 text-sm text-gray-700 hover:bg-gray-50 text-left">
                                            <a.icon size={15} className="text-gray-500" /> {a.label}
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>
                        <button onClick={() => navigate('/inicio')} className="ml-auto w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 hover:bg-gray-200"><X size={16} /></button>
                    </div>

                    {/* Texto */}
                    <textarea
                        value={text}
                        onChange={(e) => setText(e.target.value.slice(0, 2000))}
                        placeholder="No que você está pensando?"
                        rows={photos.length ? 2 : 5}
                        className="w-full text-base text-gray-800 outline-none resize-none placeholder-gray-400 mt-3"
                    />
                    <p className="text-xs text-gray-400">{text.length}/2000</p>

                    {/* Tags */}
                    {(pessoas > 0 || local) && (
                        <div className="flex flex-col gap-1.5 mt-3">
                            {pessoas > 0 && <p className="flex items-center gap-2 text-sm text-gray-600"><UserPlus size={15} className="text-gray-400" /> Com outras {pessoas} pessoas</p>}
                            {local && <p className="flex items-center gap-2 text-sm text-gray-600"><MapPin size={15} className="text-gray-400" /> {local}</p>}
                        </div>
                    )}

                    {/* Carrossel de fotos */}
                    {photos.length > 0 && (
                        <>
                            <div className="flex gap-2 overflow-x-auto mt-3 pb-1">
                                {photos.map((p, i) => (
                                    <div key={i} className="relative w-40 h-56 rounded-xl overflow-hidden shrink-0">
                                        <img src={p.preview} alt="" className="w-full h-full object-cover" />
                                        <button onClick={() => removePhoto(i)} className="absolute top-2 right-2 w-6 h-6 rounded-full bg-black/40 text-white flex items-center justify-center"><X size={12} /></button>
                                    </div>
                                ))}
                            </div>
                            <p className="text-xs text-gray-400 mt-1">{photos.length} foto{photos.length > 1 ? 's' : ''} adicionada{photos.length > 1 ? 's' : ''}</p>
                        </>
                    )}

                    {/* Toolbar + Publicar */}
                    <div className="flex items-center justify-between mt-5 pt-4 border-t border-gray-100">
                        <div className="flex items-center gap-2">
                            <input
                                ref={fileRef}
                                type="file"
                                accept="image/*"
                                multiple
                                className="hidden"
                                onChange={(e) => { addPhotos(e.target.files); e.target.value = ''; }}
                            />
                            <Tool icon={<Camera size={17} />} onClick={() => fileRef.current?.click()} />
                            <Tool icon={<ImageIcon size={17} />} onClick={() => fileRef.current?.click()} />
                            <Tool icon={<UserPlus size={17} />} onClick={() => setPessoas((n) => n + 1)} />
                            <Tool icon={<MapPin size={17} />} onClick={() => setLocal('Academia FitHarmony')} />
                        </div>
                        <button
                            onClick={handlePublish}
                            disabled={(!text.trim() && photos.length === 0) || publishing}
                            className="text-sm font-bold px-6 py-2.5 rounded-full transition-colors disabled:bg-gray-200 disabled:text-gray-400 bg-[#407BFF] hover:bg-blue-600 text-white"
                        >
                            {publishing ? 'Publicando...' : 'Publicar'}
                        </button>
                    </div>
                </div>

                {/* Outros tipos */}
                <div className="flex flex-wrap gap-2 mt-4">
                    <TypeBtn icon={<Zap size={16} className="text-[#407BFF]" />} label="Flash" onClick={() => setEditor('flash')} />
                    <TypeBtn icon={<Clapperboard size={16} className="text-emerald-500" />} label="Pulse" onClick={() => setEditor('pulse')} />
                    <TypeBtn icon={<Radio size={16} className="text-red-500" />} label="Ao Vivo" onClick={() => setEditor('aovivo')} />
                </div>
            </div>

            {editor === 'flash' && <FlashEditor onClose={() => setEditor(null)} />}
            {editor === 'aovivo' && <LiveModal onClose={() => setEditor(null)} />}
            {editor === 'pulse' && <UploadModal title="Criar Pulse" hint="Envie um vídeo vertical para criar seu Pulse" onClose={() => setEditor(null)} />}
        </AppShell>
    );
}

function Tool({ icon, onClick }: { icon: React.ReactNode; onClick?: () => void }) {
    return <button onClick={onClick} className="w-9 h-9 rounded-full bg-[#F3F4F6] flex items-center justify-center text-gray-600 hover:bg-gray-200 transition-colors">{icon}</button>;
}
function TypeBtn({ icon, label, onClick }: { icon: React.ReactNode; label: string; onClick?: () => void }) {
    return (
        <button onClick={onClick} className="flex items-center gap-2 text-sm font-medium text-gray-700 bg-white border border-gray-200 hover:border-[#407BFF]/40 px-4 py-2 rounded-full transition-colors">
            {icon} {label} <ChevronRight size={14} className="text-gray-300" />
        </button>
    );
}

const FLASH_COLORS = ['#407BFF', '#10B981', '#8B5CF6', '#F43F5E', '#F59E0B', '#0EA5E9', '#111827', '#EC4899'];
const FLASH_GRAD = 'from-sky-300 via-blue-400 to-[#407BFF]';

const PICSART_TOOLS: { key: string; label: string; icon: React.ReactNode; params?: Record<string, string> }[] = [
    { key: 'removebg', label: 'Remover fundo', icon: <Scissors size={15} /> },
    { key: 'enhance__color', label: 'Realçar', icon: <Sparkles size={15} /> },
    { key: 'upscale', label: 'Upscale', icon: <Maximize2 size={15} />, params: { upscale_factor: '2' } },
];

function FlashEditor({ onClose }: { onClose: () => void }) {
    const navigate = useNavigate();
    const userId = useAuthStore((s) => s.user?.id);
    const [step, setStep] = useState<'media' | 'ajustar' | 'canvas'>('media');
    const [color, setColor] = useState(FLASH_COLORS[0]);
    const [flashText, setFlashText] = useState('');
    const [zoom, setZoom] = useState(1);

    // Mídia real: arquivo original + preview + URL já editada (Picsart) para encadear.
    const [origFile, setOrigFile] = useState<File | null>(null);
    const [imgUrl, setImgUrl] = useState<string | null>(null);
    const [editedUrl, setEditedUrl] = useState<string | null>(null);
    const [busy, setBusy] = useState<string | null>(null);
    const [err, setErr] = useState<string | null>(null);
    const [publishing, setPublishing] = useState(false);
    const fileRef = useRef<HTMLInputElement>(null);
    const hasMedia = !!imgUrl;

    const pickFile = (files: FileList | null) => {
        const file = files?.[0];
        if (!file || !file.type.startsWith('image/')) return;
        setOrigFile(file);
        setEditedUrl(null);
        setImgUrl(URL.createObjectURL(file));
        setErr(null);
        setStep('ajustar');
    };

    // Aplica uma ferramenta Picsart na imagem atual (usa a URL já editada quando houver).
    const applyPicsart = async (tool: string, params?: Record<string, string>) => {
        if (busy) return;
        setBusy(tool);
        setErr(null);
        try {
            const src: File | string = editedUrl ?? origFile!;
            const url = await socialService.picsart(tool, src, params);
            if (!url) throw new Error('sem url');
            setEditedUrl(url);
            setImgUrl(url);
        } catch {
            setErr('Não foi possível aplicar agora. Tente novamente.');
        } finally {
            setBusy(null);
        }
    };

    const publicar = async () => {
        setPublishing(true);
        try {
            let conteudo = flashText.trim();
            let tipo = 'texto';
            if (hasMedia) {
                // URL final da imagem: a editada pelo Picsart, ou sobe a original.
                conteudo = editedUrl ?? (origFile ? await socialService.uploadMedia(origFile) : '');
                tipo = 'imagem';
            }
            if (conteudo) {
                await socialService.stories.create({ autor_id: userId ?? 0, conteudo, tipo_conteudo: tipo });
            }
        } catch { /* modo demo / backend indisponível */ } finally {
            setPublishing(false);
            navigate('/flashs');
        }
    };

    const fileInput = (
        <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={(e) => { pickFile(e.target.files); e.target.value = ''; }} />
    );

    // ---- Passo 1: adicionar mídia ----
    if (step === 'media') {
        return (
            <Overlay>
                {fileInput}
                <div className="bg-white rounded-2xl shadow-xl w-full max-w-xl overflow-hidden">
                    <Head onBack={onClose} onClose={onClose}>Adicione Mídia no Flash</Head>
                    <div className="p-10 flex flex-col items-center">
                        <div className="flex items-center gap-1 text-[#407BFF] mb-4">
                            <ImageIcon size={56} strokeWidth={1.5} /><Video size={56} strokeWidth={1.5} />
                        </div>
                        <p className="text-base font-bold text-gray-900 mb-5">Arraste as fotos e os vídeos aqui</p>
                        <button onClick={() => fileRef.current?.click()} className="bg-[#407BFF] hover:bg-blue-600 text-white font-bold text-sm px-6 py-3 rounded-full transition-colors">
                            Selecione do Computador
                        </button>
                        <button onClick={() => setStep('canvas')} className="text-xs font-semibold text-gray-400 hover:text-gray-600 mt-4">Pular e usar cor de fundo</button>
                    </div>
                </div>
            </Overlay>
        );
    }

    // ---- Passo 2: encaixar / zoom ----
    if (step === 'ajustar') {
        return (
            <Overlay>
                {fileInput}
                <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl overflow-hidden">
                    <Head onBack={() => setStep('media')} onClose={onClose}>Arraste a foto para encaixar na moldura</Head>
                    <div className="p-5">
                        <div className="mx-auto w-[240px] aspect-[9/16] rounded-xl overflow-hidden bg-gray-100 flex items-center justify-center">
                            {imgUrl
                                ? <img src={imgUrl} alt="" className="w-full h-full object-cover transition-transform" style={{ transform: `scale(${zoom})` }} />
                                : <div className={`w-full h-full bg-gradient-to-br ${FLASH_GRAD}`} style={{ transform: `scale(${zoom})` }} />}
                        </div>
                        <div className="flex items-center gap-3 mt-5">
                            <button onClick={() => fileRef.current?.click()} className="w-9 h-9 rounded-full bg-[#F3F4F6] flex items-center justify-center text-gray-600" title="Trocar imagem"><SlidersHorizontal size={16} /></button>
                            <button className="w-9 h-9 rounded-full bg-[#407BFF]/10 flex items-center justify-center text-[#407BFF]"><ZoomIn size={16} /></button>
                            <input type="range" min={1} max={3} step={0.05} value={zoom} onChange={(e) => setZoom(Number(e.target.value))} className="flex-1 accent-[#407BFF]" />
                            <button onClick={() => setStep('canvas')} className="bg-[#407BFF] hover:bg-blue-600 text-white font-bold text-sm px-6 py-2.5 rounded-full transition-colors">Continuar</button>
                        </div>
                    </div>
                </div>
            </Overlay>
        );
    }

    // ---- Passo 3: canvas (texto + cor + ferramentas Picsart) ----
    return (
        <Overlay>
            {fileInput}
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm overflow-hidden">
                <Head onBack={() => setStep(hasMedia ? 'ajustar' : 'media')} onClose={onClose}><Type size={18} className="inline mr-1" /> Criar Flash</Head>
                <div className="p-4">
                    <div className="relative rounded-xl aspect-[9/16] overflow-hidden flex items-center justify-center p-6" style={hasMedia ? undefined : { backgroundColor: color }}>
                        {hasMedia && <img src={imgUrl!} alt="" className="absolute inset-0 w-full h-full object-cover" style={{ transform: `scale(${zoom})` }} />}
                        {busy && (
                            <div className="absolute inset-0 bg-black/40 flex flex-col items-center justify-center text-white gap-2 z-10">
                                <Loader2 size={26} className="animate-spin" />
                                <span className="text-xs font-semibold">Processando…</span>
                            </div>
                        )}
                        <textarea value={flashText} onChange={(e) => setFlashText(e.target.value)} placeholder="Escreva algo..." className="relative w-full bg-transparent text-white text-center text-xl font-bold outline-none resize-none placeholder-white/60 drop-shadow" rows={4} />
                    </div>

                    {/* Ferramentas Picsart (só com imagem) */}
                    {hasMedia && (
                        <div className="mt-3">
                            <div className="flex gap-2">
                                {PICSART_TOOLS.map((t) => (
                                    <button
                                        key={t.key}
                                        onClick={() => applyPicsart(t.key, t.params)}
                                        disabled={!!busy}
                                        className="flex-1 flex flex-col items-center gap-1 py-2 rounded-xl bg-[#F3F4F6] text-gray-700 text-[11px] font-semibold hover:bg-[#407BFF]/10 hover:text-[#407BFF] transition-colors disabled:opacity-50"
                                    >
                                        {busy === t.key ? <Loader2 size={15} className="animate-spin" /> : t.icon}
                                        {t.label}
                                    </button>
                                ))}
                            </div>
                            {err && <p className="text-xs text-rose-500 flex items-center gap-1 mt-2"><AlertCircle size={12} /> {err}</p>}
                        </div>
                    )}

                    {!hasMedia && (
                        <div className="flex gap-2 justify-center mt-4">
                            {FLASH_COLORS.map((c) => (
                                <button key={c} onClick={() => setColor(c)} className={`w-7 h-7 rounded-full transition-transform ${color === c ? 'ring-2 ring-offset-2 ring-gray-400 scale-110' : ''}`} style={{ backgroundColor: c }} />
                            ))}
                        </div>
                    )}
                </div>
                <div className="p-4 border-t border-gray-100">
                    <button onClick={publicar} disabled={publishing || !!busy} className="w-full bg-[#407BFF] hover:bg-blue-600 text-white font-bold text-sm py-3 rounded-full transition-colors disabled:opacity-60">
                        {publishing ? 'Publicando…' : 'Publicar Flash'}
                    </button>
                </div>
            </div>
        </Overlay>
    );
}

function Overlay({ children }: { children: React.ReactNode }) {
    return <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">{children}</div>;
}
function Head({ children, onBack, onClose }: { children: React.ReactNode; onBack: () => void; onClose: () => void }) {
    return (
        <div className="flex items-center gap-2 p-4 border-b border-gray-100">
            <button onClick={onBack} className="text-gray-500 hover:text-gray-700"><ChevronLeft size={18} /></button>
            <h3 className="font-bold text-gray-900 flex-1">{children}</h3>
            <button onClick={onClose} className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 hover:bg-gray-200"><X size={16} /></button>
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
                    <div className="rounded-xl aspect-video bg-gray-900 flex flex-col items-center justify-center text-white/50 gap-2"><Video size={40} /><p className="text-sm">Câmera e microfone</p></div>
                    <p className="text-xs text-gray-500 text-center mt-3">Ao iniciar, seus seguidores serão notificados da transmissão.</p>
                    <button onClick={onClose} className="w-full mt-4 bg-red-500 hover:bg-red-600 text-white font-bold text-sm py-3 rounded-full transition-colors">Iniciar transmissão</button>
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
                    <div className="rounded-xl border-2 border-dashed border-gray-200 aspect-video flex flex-col items-center justify-center text-gray-400 gap-2"><Upload size={36} /><p className="text-sm text-center px-6">{hint}</p></div>
                    <button className="w-full mt-4 bg-[#407BFF] hover:bg-blue-600 text-white font-bold text-sm py-3 rounded-full transition-colors">Selecionar arquivo</button>
                </div>
            </div>
        </div>
    );
}
