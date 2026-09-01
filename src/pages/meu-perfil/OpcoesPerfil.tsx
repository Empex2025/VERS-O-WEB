import { useEffect, useState } from 'react';
import {
    Search, ChevronLeft, ChevronRight, X, Lock, Phone, MapPin, CreditCard,
    BadgeCheck, History, Bookmark, Smartphone, Info, Eye, HelpCircle,
    ShieldCheck, FileText, Star, Share2, LogOut, UserRound, Check,
    Trash2, Plus, Pencil,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { AppShell } from '../../components/layout/AppShell';
import { PageHeader } from '../../components/layout/PageHeader';
import { authService } from '../../services/authService';
import { profileService } from '../../services/profileService';
import { useApiData } from '../../hooks/useApiData';
import logoImage from '../../assets/login/logo-login.png';

type ModalKey =
    | null | 'privacidade' | 'sobre' | 'acessibilidade' | 'permissoes' | 'documentos'
    | 'historico' | 'cartoes' | 'enderecos' | 'contatos' | 'salvos' | 'generico';

export function OpcoesPerfil() {
    const navigate = useNavigate();
    const [modal, setModal] = useState<ModalKey>(null);
    const [genericTitle, setGenericTitle] = useState('');

    const openGeneric = (title: string) => { setGenericTitle(title); setModal('generico'); };

    const CONTA = [
        { icon: Lock, label: 'Privacidade da Conta', onClick: () => setModal('privacidade') },
        { icon: Phone, label: 'Meus Contatos', onClick: () => setModal('contatos') },
        { icon: MapPin, label: 'Meus Endereços', onClick: () => setModal('enderecos') },
        { icon: CreditCard, label: 'Meus Cartões', onClick: () => setModal('cartoes') },
        { icon: BadgeCheck, label: 'Meus Documentos', onClick: () => setModal('documentos') },
        { icon: History, label: 'Histórico da conta', onClick: () => navigate('/meu-perfil/historico') },
        { icon: Bookmark, label: 'Salvos', onClick: () => navigate('/meu-perfil/salvos') },
        { icon: Smartphone, label: 'Permissões do Dispositivo', onClick: () => setModal('permissoes') },
        { icon: Info, label: 'Versão do Sistema', onClick: () => setModal('sobre') },
    ];

    const SUPORTE = [
        { icon: Eye, label: 'Acessibilidade', onClick: () => setModal('acessibilidade') },
        { icon: HelpCircle, label: 'Central de Ajuda e Feedback', onClick: () => navigate('/meu-perfil/ajuda') },
        { icon: Info, label: 'Sobre o Aplicativo', onClick: () => setModal('sobre') },
        { icon: ShieldCheck, label: 'Política de Privacidade', onClick: () => navigate('/meu-perfil/politica') },
        { icon: FileText, label: 'Termos de Uso', onClick: () => navigate('/meu-perfil/termos') },
        { icon: Star, label: 'Avaliar', onClick: () => openGeneric('Avaliar') },
        { icon: Share2, label: 'Compartilhar Aplicativo', onClick: () => openGeneric('Compartilhar Aplicativo') },
    ];

    return (
        <AppShell rightRail={null}>
            <div className="max-w-4xl mx-auto flex gap-6">
                {/* Menu */}
                <div className="w-full max-w-md">
                    <PageHeader title="Opções de perfil" to="/meu-perfil" />
                    <div className="relative mb-6">
                        <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input placeholder="Busque por pessoas, assuntos e muito mais..." className="w-full bg-white border border-gray-200 rounded-xl py-3 pl-11 pr-4 text-sm outline-none" />
                    </div>

                    <Section title="Minha Conta" items={CONTA} />
                    <Section title="Suporte e Segurança" items={SUPORTE} />

                    <button
                        onClick={async () => { await authService.logout(); navigate('/'); }}
                        className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-rose-500 hover:bg-rose-50 transition-colors text-sm font-semibold mt-1"
                    >
                        <LogOut size={18} /> Sair da minha Conta <ChevronRight size={16} className="ml-auto text-rose-300" />
                    </button>
                </div>

                {/* Ilustração */}
                <div className="hidden lg:flex flex-1 items-center justify-center">
                    <div className="w-full h-80 rounded-2xl bg-[#407BFF]/5 flex items-center justify-center text-[#407BFF]/40">
                        <UserRound size={80} />
                    </div>
                </div>
            </div>

            {modal === 'privacidade' && <PrivacidadeModal onClose={() => setModal(null)} />}
            {modal === 'sobre' && <SobreModal onClose={() => setModal(null)} />}
            {modal === 'acessibilidade' && <AcessibilidadeModal onClose={() => setModal(null)} />}
            {modal === 'permissoes' && <PermissoesModal onClose={() => setModal(null)} />}
            {modal === 'documentos' && <DocumentosModal onClose={() => setModal(null)} />}
            {modal === 'cartoes' && <CartoesModal onClose={() => setModal(null)} />}
            {modal === 'enderecos' && <EnderecosModal onClose={() => setModal(null)} />}
            {modal === 'contatos' && <ContatosModal onClose={() => setModal(null)} />}
            {modal === 'generico' && <GenericoModal title={genericTitle} onClose={() => setModal(null)} />}
        </AppShell>
    );
}

function Section({ title, items }: { title: string; items: { icon: typeof Lock; label: string; onClick: () => void }[] }) {
    return (
        <div className="mb-4">
            <h2 className="text-xs font-bold text-gray-400 uppercase mb-1 px-1">{title}</h2>
            <div className="flex flex-col">
                {items.map(({ icon: Icon, label, onClick }) => (
                    <button key={label} onClick={onClick} className="flex items-center gap-3 px-3 py-3 rounded-lg hover:bg-gray-50 transition-colors text-sm text-gray-700">
                        <Icon size={18} className="text-[#407BFF]" />
                        <span className="flex-1 text-left font-medium">{label}</span>
                        <ChevronRight size={16} className="text-gray-300" />
                    </button>
                ))}
            </div>
        </div>
    );
}

/* ---------- Modal base ---------- */
function Modal({ title, onClose, children, onBack }: { title: string; onClose: () => void; children: React.ReactNode; onBack?: () => void }) {
    return (
        <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4" onClick={onClose}>
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm overflow-hidden max-h-[80vh] flex flex-col" onClick={(e) => e.stopPropagation()}>
                <div className="flex items-center gap-2 p-4 border-b border-gray-100">
                    <button onClick={onBack ?? onClose} className="text-gray-500 hover:text-gray-700"><ChevronLeft size={18} /></button>
                    <h3 className="font-bold text-gray-900 text-sm flex-1">{title}</h3>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600"><X size={18} /></button>
                </div>
                <div className="overflow-y-auto">{children}</div>
            </div>
        </div>
    );
}

function PrivacidadeModal({ onClose }: { onClose: () => void }) {
    const [privado, setPrivado] = useState(true);
    return (
        <Modal title="Privacidade da Conta" onClose={onClose}>
            <div className="p-5">
                <p className="text-xs text-gray-500 leading-relaxed mb-4">
                    Quando sua conta é pública, seu perfil e publicações podem ser vistos por todos os usuários da plataforma.
                    Quando a conta é privada, somente pessoas que você autorizar terão acesso ao que você compartilha.
                </p>
                <div className="flex items-center justify-between">
                    <span className="text-sm font-bold text-gray-800">Perfil Privado</span>
                    <button onClick={() => setPrivado((v) => !v)} className={`w-11 h-6 rounded-full p-0.5 transition-colors ${privado ? 'bg-[#407BFF]' : 'bg-gray-300'}`}>
                        <span className={`block w-5 h-5 rounded-full bg-white transition-transform ${privado ? 'translate-x-5' : ''}`} />
                    </button>
                </div>
            </div>
        </Modal>
    );
}

function SobreModal({ onClose }: { onClose: () => void }) {
    return (
        <Modal title="Sobre o sistema" onClose={onClose}>
            <div className="p-8 text-center">
                <img src={logoImage} alt="iSaúde" className="h-9 object-contain mx-auto mb-4" />
                <p className="text-xs text-gray-400">© 2025 isaude&bem-estar</p>
                <p className="text-xs text-gray-400">Versão 1.0.0.0</p>
                <button className="text-xs font-semibold text-[#407BFF] mt-3 hover:underline">Licenças</button>
            </div>
        </Modal>
    );
}

const ACESS_ITEMS = ['Saturação', 'Filtro Daltônico', 'Zoom', 'Dislexia', 'Pausar animações', 'Talkback'];
const SATURACAO = ['Saturação Padrão', 'Saturação Alta', 'Saturação Baixa', 'Saturação Monocromática'];
const DALTONICO = ['Sem Filtro', 'Protan (Vermelho)', 'Deutan (Verde)', 'Tritan (Azul)'];

function AcessibilidadeModal({ onClose }: { onClose: () => void }) {
    const [sub, setSub] = useState<null | 'Saturação' | 'Filtro Daltônico'>(null);
    const [choice, setChoice] = useState('Sem Filtro');

    if (sub) {
        const opts = sub === 'Saturação' ? SATURACAO : DALTONICO;
        return (
            <Modal title={sub} onClose={onClose} onBack={() => setSub(null)}>
                <div className="p-2">
                    {opts.map((o) => (
                        <button key={o} onClick={() => setChoice(o)} className="w-full flex items-center gap-3 px-3 py-3 rounded-lg hover:bg-gray-50 text-sm text-gray-700">
                            <span className="flex-1 text-left">{o}</span>
                            <span className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${choice === o ? 'border-[#407BFF]' : 'border-gray-300'}`}>
                                {choice === o && <span className="w-2 h-2 rounded-full bg-[#407BFF]" />}
                            </span>
                        </button>
                    ))}
                </div>
            </Modal>
        );
    }

    return (
        <Modal title="Acessibilidade" onClose={onClose}>
            <div className="p-2">
                {ACESS_ITEMS.map((it) => (
                    <button
                        key={it}
                        onClick={() => (it === 'Saturação' || it === 'Filtro Daltônico') && setSub(it)}
                        className="w-full flex items-center gap-3 px-3 py-3 rounded-lg hover:bg-gray-50 text-sm text-gray-700"
                    >
                        <span className="flex-1 text-left font-medium">{it}</span>
                        <ChevronRight size={16} className="text-gray-300" />
                    </button>
                ))}
            </div>
        </Modal>
    );
}

const PERMISSOES = ['Câmera', 'Microfone', 'Serviços de Localização', 'Notificações', 'Fotos e Vídeos'];
function PermissoesModal({ onClose }: { onClose: () => void }) {
    return (
        <Modal title="Permissões do Dispositivo" onClose={onClose}>
            <div className="p-4">
                <p className="text-xs text-gray-500 mb-1">Gerencie as permissões do aplicativo nas configurações do dispositivo.</p>
                <button className="text-xs font-semibold text-[#407BFF] hover:underline mb-3">Ir para as configurações do dispositivo</button>
                {PERMISSOES.map((p) => (
                    <button key={p} className="w-full flex items-center gap-3 py-3 border-t border-gray-100 text-sm text-gray-700">
                        <span className="flex-1 text-left font-medium">{p}</span>
                        <span className="text-xs text-gray-400">Permitido</span>
                        <ChevronRight size={16} className="text-gray-300" />
                    </button>
                ))}
            </div>
        </Modal>
    );
}

interface RawValidation { doc_type?: string; status?: string }
const DOCS_FALLBACK = [
    { label: 'Documento Oficial com Foto', status: 'approved' },
    { label: 'Carteira Profissional Válida', status: 'approved' },
    { label: 'Registro de Qualificação de Especialista', status: 'approved' },
    { label: 'Selfie', status: 'approved' },
];
function statusLabel(status?: string) {
    const s = (status || '').toLowerCase();
    if (s.includes('approv') || s.includes('verif')) return { text: 'Verificado', ok: true };
    if (s.includes('reject')) return { text: 'Rejeitado', ok: false };
    return { text: 'Pendente', ok: false };
}
async function fetchDocs() {
    const raw = await profileService.validation.get<RawValidation[] | { results: RawValidation[] }>();
    const list = Array.isArray(raw) ? raw : raw?.results ?? [];
    return list.map((v) => ({ label: v.doc_type || 'Documento', status: v.status || 'pending' }));
}
function DocumentosModal({ onClose }: { onClose: () => void }) {
    const { data: docs } = useApiData(fetchDocs, DOCS_FALLBACK, []);
    return (
        <Modal title="Meus Documentos" onClose={onClose}>
            <div className="p-4 flex flex-col gap-2">
                {docs.map((d, i) => {
                    const st = statusLabel(d.status);
                    return (
                        <div key={i} className="flex items-center gap-3 bg-[#F3F4F6] rounded-xl px-4 py-3">
                            <div className="flex-1">
                                <p className="text-sm font-bold text-gray-800">{d.label}</p>
                                <p className="text-xs text-gray-400">{st.text}</p>
                            </div>
                            <span className={`w-6 h-6 rounded-full text-white flex items-center justify-center ${st.ok ? 'bg-emerald-500' : 'bg-gray-300'}`}>
                                <Check size={14} strokeWidth={3} />
                            </span>
                        </div>
                    );
                })}
            </div>
        </Modal>
    );
}

function CardPreview({ number = '**** **** **** 4567', holder = 'Jamile C. de Oliveira' }: { number?: string; holder?: string }) {
    return (
        <div className="h-40 rounded-2xl bg-gradient-to-br from-[#407BFF] to-violet-500 p-4 flex flex-col justify-between text-white shadow-md">
            <div className="flex justify-between">
                <span className="w-9 h-6 rounded bg-amber-300/90" />
                <span className="flex"><span className="w-5 h-5 rounded-full bg-red-500" /><span className="w-5 h-5 rounded-full bg-amber-400 -ml-2" /></span>
            </div>
            <span className="tracking-widest text-lg font-semibold">{number}</span>
            <div className="flex justify-between text-xs">
                <span>{holder}</span>
                <span>08/28  123</span>
            </div>
        </div>
    );
}

interface RawCard { id?: number; brand?: string; nickname?: string; holder_name?: string }
interface CardItem { id?: number; brand: string; num: string }
const CARDS_FALLBACK: CardItem[] = [
    { brand: 'Cartão Inter', num: '**** **** **** 0123' },
    { brand: 'Cartão Banco do Brasil', num: '**** **** **** 1234' },
];
async function fetchCards(): Promise<CardItem[]> {
    const raw = await profileService.cards.list<RawCard[] | { results: RawCard[] }>();
    const list = Array.isArray(raw) ? raw : raw?.results ?? [];
    return list.map((c) => ({ id: c.id, brand: c.brand || c.nickname || 'Cartão', num: `•••• ${c.nickname || c.holder_name || '••••'}` }));
}

function CartoesModal({ onClose }: { onClose: () => void }) {
    const [view, setView] = useState<'list' | 'new' | 'delete'>('list');
    const { data: apiCards } = useApiData(fetchCards, CARDS_FALLBACK, []);
    const [cards, setCards] = useState<CardItem[]>(CARDS_FALLBACK);
    useEffect(() => { setCards(apiCards); }, [apiCards]);
    const [pending, setPending] = useState<number | null>(null);

    // Formulário de novo cartão (campos controlados)
    const [form, setForm] = useState({ number: '', holder: '', cvv: '', validade: '' });
    const [saving, setSaving] = useState(false);
    const resetForm = () => setForm({ number: '', holder: '', cvv: '', validade: '' });
    const detectBrand = (n: string) => {
        const d = n.replace(/\D/g, '');
        if (/^4/.test(d)) return 'visa';
        if (/^5/.test(d)) return 'mastercard';
        if (/^3/.test(d)) return 'amex';
        if (/^6/.test(d)) return 'elo';
        return 'visa';
    };
    const cardDigits = form.number.replace(/\D/g, '');
    const canSaveCard = cardDigits.length >= 13 && !!form.holder.trim() && /\d{2}\s*\/\s*\d{2,4}/.test(form.validade);

    const addCard = async () => {
        const [mm = '', yyRaw = ''] = form.validade.split('/').map((s) => s.trim());
        const yyyy = yyRaw.length === 2 ? `20${yyRaw}` : yyRaw;
        const brand = detectBrand(cardDigits);
        const last4 = cardDigits.slice(-4);
        setSaving(true);
        try {
            await profileService.cards.create({
                card_number: cardDigits,
                cvv: form.cvv,
                holder_name: form.holder.trim(),
                expiry_month: mm,
                expiry_year: yyyy,
                brand,
                nickname: `Cartão ${brand}`,
            });
            setCards(await fetchCards());
        } catch {
            setCards((p) => [...p, { brand, num: `**** **** **** ${last4}` }]);
        } finally {
            setSaving(false);
            resetForm();
            setView('list');
        }
    };
    const removeCard = () => {
        const card = pending != null ? cards[pending] : undefined;
        if (card?.id) profileService.cards.remove(card.id).catch(() => {});
        setCards((p) => p.filter((_, i) => i !== pending));
        setView('list');
    };

    if (view === 'new') {
        return (
            <Modal title="Novo Cartão" onClose={onClose} onBack={() => setView('list')}>
                <div className="p-4">
                    <CardPreview />
                    <div className="flex flex-col gap-3 mt-4">
                        <div>
                            <label className="text-sm font-bold text-gray-800">Cartão</label>
                            <input value={form.number} onChange={(e) => setForm((f) => ({ ...f, number: e.target.value }))} inputMode="numeric" placeholder="0123 4567 8910 4567" className="w-full bg-[#F3F4F6] rounded-lg px-3 py-2.5 text-sm outline-none mt-1" />
                        </div>
                        <div>
                            <label className="text-sm font-bold text-gray-800">Nome do Titular</label>
                            <input value={form.holder} onChange={(e) => setForm((f) => ({ ...f, holder: e.target.value }))} placeholder="Jamile C. de Oliveira" className="w-full bg-[#F3F4F6] rounded-lg px-3 py-2.5 text-sm outline-none mt-1" />
                            <span className="text-[11px] text-gray-400">Igual como está no cartão</span>
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                            <div>
                                <label className="text-sm font-bold text-gray-800">Código de Validação</label>
                                <input value={form.cvv} onChange={(e) => setForm((f) => ({ ...f, cvv: e.target.value }))} inputMode="numeric" placeholder="123" className="w-full bg-[#F3F4F6] rounded-lg px-3 py-2.5 text-sm outline-none mt-1" />
                            </div>
                            <div>
                                <label className="text-sm font-bold text-gray-800">Validade</label>
                                <input value={form.validade} onChange={(e) => setForm((f) => ({ ...f, validade: e.target.value }))} placeholder="08/2028" className="w-full bg-[#F3F4F6] rounded-lg px-3 py-2.5 text-sm outline-none mt-1" />
                            </div>
                        </div>
                        <button
                            onClick={addCard}
                            disabled={!canSaveCard || saving}
                            className="w-full bg-[#407BFF] hover:bg-blue-600 text-white font-bold text-sm py-3 rounded-full mt-1 disabled:bg-gray-200 disabled:text-gray-400"
                        >
                            {saving ? 'Adicionando...' : 'Adicionar Cartão'}
                        </button>
                    </div>
                </div>
            </Modal>
        );
    }

    if (view === 'delete') {
        return (
            <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4">
                <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm p-6 text-center">
                    <h3 className="text-base font-bold text-gray-900">Você tem certeza que deseja excluir esse Cartão?</h3>
                    <p className="text-sm text-gray-500 mt-2">Não é possível desfazer essa ação.</p>
                    <button
                        onClick={removeCard}
                        className="w-full mt-5 bg-rose-500 hover:bg-rose-600 text-white font-bold text-sm py-3 rounded-full"
                    >
                        Sim, Excluir
                    </button>
                    <button onClick={() => setView('list')} className="w-full mt-2 text-rose-500 font-semibold text-sm py-2">Voltar</button>
                </div>
            </div>
        );
    }

    return (
        <Modal title="Meus Cartões" onClose={onClose}>
            <div className="p-4">
                <CardPreview number="**** **** **** ****" holder="NOME IMPRESSO" />
                <div className="flex flex-col gap-2 mt-4">
                    {cards.map((c, i) => (
                        <div key={i} className="flex items-center gap-3 border border-gray-100 rounded-xl px-3 py-2.5">
                            <span className="w-8 h-6 rounded bg-gradient-to-r from-red-500 to-amber-400" />
                            <div className="flex-1">
                                <p className="text-sm font-semibold text-gray-800">{c.num}</p>
                                <p className="text-xs text-gray-400">{c.brand}</p>
                            </div>
                            <button onClick={() => { setPending(i); setView('delete'); }} className="text-gray-300 hover:text-rose-500"><Trash2 size={16} /></button>
                        </div>
                    ))}
                    <button onClick={() => setView('new')} className="text-sm font-bold text-[#407BFF] bg-[#407BFF]/10 py-2.5 rounded-lg hover:bg-[#407BFF]/15">Novo Cartão +</button>
                </div>
            </div>
        </Modal>
    );
}

const ADDR_RESULTS = [
    { title: 'Tuna', desc: 'Marquês da Vale - Pará, Brasil' },
    { title: 'Tuna', desc: 'Q.6, 17 Marquês da Vale - Pará, Brasil 66600-010' },
];
interface RawAddress { id?: number; label?: string; street?: string; number?: string; neighborhood?: string; city?: string; state?: string; zip_code?: string }
interface AddrItem { id?: number; label: string; desc: string }
const ADDR_FALLBACK: AddrItem[] = [
    { label: 'Casa', desc: 'Q.6, 17 Marquês da Vale - Pará, Brasil 66600-010' },
    { label: 'Academia', desc: 'Q.6, 17 Marquês da Vale - Pará, Brasil 66600-010' },
];
async function fetchAddresses(): Promise<AddrItem[]> {
    const raw = await profileService.addresses.list<RawAddress[] | { results: RawAddress[] }>();
    const list = Array.isArray(raw) ? raw : raw?.results ?? [];
    return list.map((a) => ({
        id: a.id,
        label: a.label || 'Endereço',
        desc: [[a.street, a.number].filter(Boolean).join(', '), [a.city, a.state].filter(Boolean).join(' - '), a.zip_code].filter(Boolean).join(' · '),
    }));
}

function EnderecosModal({ onClose }: { onClose: () => void }) {
    const [view, setView] = useState<'list' | 'new' | 'map' | 'form'>('list');
    const { data: apiAddrs } = useApiData(fetchAddresses, ADDR_FALLBACK, []);
    const [addrs, setAddrs] = useState<AddrItem[]>(ADDR_FALLBACK);
    useEffect(() => { setAddrs(apiAddrs); }, [apiAddrs]);

    // Formulário de novo endereço (campos controlados)
    const emptyAddr = { label: '', zip_code: '', street: '', number: '', complement: '', city: '', state: '' };
    const [addr, setAddr] = useState(emptyAddr);
    const [savingAddr, setSavingAddr] = useState(false);
    const setAddrField = (k: keyof typeof emptyAddr) => (v: string) => setAddr((a) => ({ ...a, [k]: v }));
    const canSaveAddr = !!addr.street.trim() && !!addr.city.trim() && !!addr.state.trim();

    const saveAddress = async () => {
        setSavingAddr(true);
        try {
            await profileService.addresses.create({
                label: addr.label.trim() || 'Endereço',
                street: addr.street.trim(),
                number: addr.number.trim(),
                complement: addr.complement.trim(),
                city: addr.city.trim(),
                state: addr.state.trim(),
                zip_code: addr.zip_code.trim(),
            });
            setAddrs(await fetchAddresses());
        } catch {
            const desc = [[addr.street, addr.number].filter(Boolean).join(', '), [addr.city, addr.state].filter(Boolean).join(' - '), addr.zip_code].filter(Boolean).join(' · ');
            setAddrs((p) => [...p, { label: addr.label || 'Endereço', desc }]);
        } finally {
            setSavingAddr(false);
            setAddr(emptyAddr);
            setView('list');
        }
    };

    if (view === 'new') {
        return (
            <Modal title="Novo Endereço" onClose={onClose} onBack={() => setView('list')}>
                <div className="p-4">
                    <div className="relative mb-3">
                        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input placeholder="Busque por rua, cidade, estado ou bairro..." className="w-full bg-[#F3F4F6] rounded-lg py-2.5 pl-9 pr-3 text-sm outline-none" />
                    </div>
                    {ADDR_RESULTS.map((r, i) => (
                        <button key={i} onClick={() => setView('form')} className="w-full flex items-center gap-3 py-2.5 border-b border-gray-100 text-left">
                            <MapPin size={16} className="text-gray-400" />
                            <div className="flex-1"><p className="text-sm font-semibold text-gray-800">{r.title}</p><p className="text-xs text-gray-400">{r.desc}</p></div>
                            <ChevronRight size={14} className="text-gray-300" />
                        </button>
                    ))}
                    <p className="text-xs text-gray-500 mt-4 mb-1">Não achou seu endereço?</p>
                    <button onClick={() => setView('map')} className="w-full text-sm font-bold text-[#407BFF] bg-[#407BFF]/10 py-2.5 rounded-lg hover:bg-[#407BFF]/15">Buscar no Mapa</button>
                </div>
            </Modal>
        );
    }

    if (view === 'map') {
        return (
            <Modal title="Selecione no Mapa" onClose={onClose} onBack={() => setView('new')}>
                <div className="p-4">
                    <div className="rounded-xl bg-gray-100 h-52 flex items-center justify-center relative mb-3">
                        <MapPin size={40} className="text-[#407BFF]" />
                    </div>
                    <p className="text-sm font-semibold text-gray-800 mb-3">Q.6 17 · Marquês da Vale - Pará, Brasil 66600-010</p>
                    <button onClick={() => setView('form')} className="w-full bg-[#407BFF] hover:bg-blue-600 text-white font-bold text-sm py-3 rounded-full">Selecionar Local</button>
                </div>
            </Modal>
        );
    }

    if (view === 'form') {
        return (
            <Modal title="Novo Endereço" onClose={onClose} onBack={() => setView('new')}>
                <div className="p-4 flex flex-col gap-3">
                    <FormField label="Nome do Endereço" placeholder="Academia" value={addr.label} onChange={setAddrField('label')} />
                    <FormField label="CEP" placeholder="66600-010" value={addr.zip_code} onChange={setAddrField('zip_code')} />
                    <FormField label="Logradouro" placeholder="Rua Feliz" value={addr.street} onChange={setAddrField('street')} />
                    <div className="grid grid-cols-2 gap-3">
                        <FormField label="Número" placeholder="80" value={addr.number} onChange={setAddrField('number')} />
                        <FormField label="Cidade" placeholder="Belém" value={addr.city} onChange={setAddrField('city')} />
                    </div>
                    <FormField label="Complemento (opcional)" placeholder="Ap." value={addr.complement} onChange={setAddrField('complement')} />
                    <FormField label="Estado" placeholder="Pará" value={addr.state} onChange={setAddrField('state')} />
                    <button
                        onClick={saveAddress}
                        disabled={!canSaveAddr || savingAddr}
                        className="w-full bg-[#407BFF] hover:bg-blue-600 text-white font-bold text-sm py-3 rounded-full mt-1 disabled:bg-gray-200 disabled:text-gray-400"
                    >
                        {savingAddr ? 'Salvando...' : 'Salvar Endereço'}
                    </button>
                </div>
            </Modal>
        );
    }

    return (
        <Modal title="Meus Endereços" onClose={onClose}>
            <div className="p-4 flex flex-col gap-2">
                {addrs.map((a, i) => (
                    <div key={i} className="flex items-center gap-3 border border-gray-100 rounded-xl px-3 py-2.5">
                        <MapPin size={18} className="text-[#407BFF]" />
                        <div className="flex-1">
                            <p className="text-sm font-bold text-gray-800">{a.label}</p>
                            <p className="text-xs text-gray-400">{a.desc}</p>
                        </div>
                        <button className="text-gray-300 hover:text-[#407BFF]"><Pencil size={15} /></button>
                    </div>
                ))}
                <button onClick={() => setView('new')} className="text-sm font-bold text-[#407BFF] bg-[#407BFF]/10 py-2.5 rounded-lg hover:bg-[#407BFF]/15">Adicionar Endereço +</button>
            </div>
        </Modal>
    );
}

function FormField({ label, placeholder, value, onChange }: { label: string; placeholder: string; value?: string; onChange?: (v: string) => void }) {
    return (
        <div>
            <label className="text-sm font-bold text-gray-800">{label}</label>
            <input
                value={value ?? ''}
                onChange={onChange ? (e) => onChange(e.target.value) : undefined}
                placeholder={placeholder}
                className="w-full bg-[#F3F4F6] rounded-lg px-3 py-2.5 text-sm outline-none mt-1"
            />
        </div>
    );
}

interface RawPhone { id?: number; number?: string }
interface PhoneItem { id?: number; number: string }
const PHONES_FALLBACK: PhoneItem[] = [{ number: '(91) 94082-8922' }];
async function fetchPhones(): Promise<PhoneItem[]> {
    const raw = await profileService.phones.list<RawPhone[] | { results: RawPhone[] }>();
    const list = Array.isArray(raw) ? raw : raw?.results ?? [];
    return list.map((p) => ({ id: p.id, number: p.number || '' })).filter((p) => p.number);
}

function ContatosModal({ onClose }: { onClose: () => void }) {
    const [view, setView] = useState<'list' | 'add' | 'verify' | 'success' | 'delete'>('list');
    const { data: apiPhones } = useApiData(fetchPhones, PHONES_FALLBACK, []);
    const [phones, setPhones] = useState<PhoneItem[]>(PHONES_FALLBACK);
    useEffect(() => { if (apiPhones.length) setPhones(apiPhones); }, [apiPhones]);
    const [code, setCode] = useState(['', '', '', '', '', '']);
    const [pendingDelete, setPendingDelete] = useState<number | null>(null);
    const [phoneNumber, setPhoneNumber] = useState('');
    const [phonePrimary, setPhonePrimary] = useState(true);

    const confirmPhone = async () => {
        const number = phoneNumber.trim();
        try {
            await profileService.phones.create({ number, is_primary: phonePrimary });
            setPhones(await fetchPhones());
        } catch {
            setPhones((p) => [...p, { number }]);
        }
        setCode(['', '', '', '', '', '']);
        setPhoneNumber('');
        setView('list');
    };
    const removePhone = () => {
        const ph = pendingDelete != null ? phones[pendingDelete] : undefined;
        if (ph?.id) profileService.phones.remove(ph.id).catch(() => {});
        setPhones((p) => p.filter((_, i) => i !== pendingDelete));
        setView('list');
    };

    if (view === 'add') {
        return (
            <Modal title="Seu Telefone" onClose={onClose} onBack={() => setView('list')}>
                <div className="p-4">
                    <p className="text-xs text-gray-500 leading-relaxed mb-4">
                        Seu número de telefone é como as pessoas entram em contato com você. Vamos enviar um código
                        de verificação para confirmar que o número é seu.
                    </p>
                    <div className="flex items-center gap-2 bg-[#F3F4F6] rounded-lg px-3 py-2.5">
                        <span className="text-sm">🇧🇷 +55</span>
                        <input value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} inputMode="tel" placeholder="(00) 94002-8922" className="flex-1 bg-transparent text-sm outline-none" />
                    </div>
                    <label className="flex items-center gap-2 mt-3 text-xs text-gray-600"><input type="checkbox" checked={phonePrimary} onChange={(e) => setPhonePrimary(e.target.checked)} className="accent-[#407BFF]" /> Tornar Principal</label>
                    <button onClick={() => setView('verify')} disabled={!phoneNumber.trim()} className="w-full bg-[#407BFF] hover:bg-blue-600 text-white font-bold text-sm py-3 rounded-full mt-4 disabled:bg-gray-200 disabled:text-gray-400">Verificar Telefone</button>
                </div>
            </Modal>
        );
    }

    if (view === 'verify') {
        const filled = code.every((c) => c !== '');
        return (
            <Modal title="Verificação de Telefone" onClose={onClose} onBack={() => setView('add')}>
                <div className="p-4">
                    <p className="text-xs text-gray-500 leading-relaxed mb-4">
                        Digite o código de verificação que enviamos por SMS e WhatsApp para o número {phoneNumber || '(00) 94002-8922'}. <button onClick={() => setView('add')} className="text-[#407BFF] font-semibold">(editar)</button>
                    </p>
                    <div className="flex gap-2 justify-center mb-4">
                        {code.map((c, i) => (
                            <input
                                key={i}
                                value={c}
                                maxLength={1}
                                onChange={(e) => setCode((prev) => prev.map((x, idx) => (idx === i ? e.target.value.replace(/\D/g, '') : x)))}
                                className="w-11 h-12 text-center text-lg font-bold rounded-xl bg-[#F3F4F6] outline-none focus:ring-2 focus:ring-[#407BFF]"
                            />
                        ))}
                    </div>
                    <button disabled={!filled} onClick={() => setView('success')} className={`w-full font-bold text-sm py-3 rounded-full ${filled ? 'bg-[#407BFF] hover:bg-blue-600 text-white' : 'bg-[#E5E7EB] text-gray-400 cursor-not-allowed'}`}>Verificar</button>
                    <button className="w-full text-[#407BFF] font-semibold text-sm py-2 mt-1">Reenviar Código</button>
                </div>
            </Modal>
        );
    }

    if (view === 'success') {
        return (
            <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4">
                <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm p-6 text-center">
                    <div className="w-14 h-14 rounded-full bg-emerald-500 flex items-center justify-center mx-auto mb-4"><Check size={28} className="text-white" strokeWidth={3} /></div>
                    <h3 className="text-base font-bold text-gray-900">Tudo Certo!</h3>
                    <p className="text-sm text-gray-500 mt-2">Confirmamos seu telefone. Ele já está vinculado à sua conta.</p>
                    <button onClick={confirmPhone} className="w-full bg-[#407BFF] hover:bg-blue-600 text-white font-bold text-sm py-3 rounded-full mt-5">Voltar</button>
                </div>
            </div>
        );
    }

    if (view === 'delete') {
        return (
            <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4">
                <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm p-6 text-center">
                    <h3 className="text-base font-bold text-gray-900">Você tem certeza que deseja excluir esse Número de Telefone?</h3>
                    <p className="text-sm text-gray-500 mt-2">Não é possível desfazer essa ação.</p>
                    <button onClick={removePhone} className="w-full mt-5 bg-rose-500 hover:bg-rose-600 text-white font-bold text-sm py-3 rounded-full">Sim, Excluir</button>
                    <button onClick={() => setView('list')} className="w-full mt-2 text-rose-500 font-semibold text-sm py-2">Voltar</button>
                </div>
            </div>
        );
    }

    return (
        <Modal title="Seus Telefones" onClose={onClose}>
            <div className="p-4">
                {phones.map((ph, i) => (
                    <div key={i} className="flex items-center gap-3 border border-gray-100 rounded-xl px-3 py-3 mb-2">
                        <Phone size={18} className="text-[#407BFF]" />
                        <span className="flex-1 text-sm font-semibold text-gray-800">{ph.number}</span>
                        <button onClick={() => { setPendingDelete(i); setView('delete'); }} className="text-gray-300 hover:text-rose-500"><Trash2 size={16} /></button>
                    </div>
                ))}
                <button onClick={() => setView('add')} className="w-full text-sm font-bold text-[#407BFF] bg-[#407BFF]/10 py-2.5 rounded-lg hover:bg-[#407BFF]/15 flex items-center justify-center gap-1">Adicionar Telefone <Plus size={15} /></button>
            </div>
        </Modal>
    );
}

function GenericoModal({ title, onClose }: { title: string; onClose: () => void }) {
    return (
        <Modal title={title} onClose={onClose}>
            <div className="p-8 text-center text-sm text-gray-500">
                Esta seção estará disponível em breve.
            </div>
        </Modal>
    );
}
