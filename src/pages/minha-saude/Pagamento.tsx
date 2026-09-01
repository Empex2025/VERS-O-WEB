import { useState } from 'react';
import {
    CreditCard, Smartphone, QrCode, Wallet, ChevronRight, Plus, BadgeCheck,
    Check, Copy, X, ChevronLeft,
} from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { AppShell } from '../../components/layout/AppShell';
import { PageHeader } from '../../components/layout/PageHeader';
import { Avatar } from '../../components/ui/Avatar';
import { profileService } from '../../services/profileService';
import { teleconsultaService } from '../../services/teleconsultaService';
import { useApiData } from '../../hooks/useApiData';

type Step = 'method' | 'card' | 'summary' | 'pix';

interface RawCard { id?: number; brand?: string; nickname?: string; last4?: string; holder_name?: string }
interface CardItem { id?: number; label: string; brand?: string }

/** Cartões reais do usuário para o checkout. */
async function fetchCheckoutCards(): Promise<CardItem[]> {
    const raw = await profileService.cards.list<{ results: RawCard[] } | RawCard[]>();
    const list = Array.isArray(raw) ? raw : raw?.results ?? [];
    return list.map((c) => ({ id: c.id, label: `•••• •••• •••• ${c.last4 ?? '••••'}`, brand: c.brand }));
}

const METHODS = [
    { id: 'debito', label: 'Cartão de Débito', icon: CreditCard, hint: '' },
    { id: 'credito', label: 'Cartão de Crédito', icon: CreditCard, hint: '' },
    { id: 'pix', label: 'Pix', icon: QrCode, hint: 'Recomendado' },
    { id: 'google', label: 'Google Pay', icon: Smartphone, hint: '' },
    { id: 'apple', label: 'Apple Pay', icon: Smartphone, hint: '' },
    { id: 'paypal', label: 'PayPal', icon: Wallet, hint: '' },
];

export function Pagamento() {
    const navigate = useNavigate();
    const location = useLocation();
    const [step, setStep] = useState<Step>('method');

    const st = (location.state ?? {}) as { title?: string; consultaId?: number; valor?: number; profNome?: string; profId?: number };
    const successTitle = st.title ?? 'Seu atendimento foi agendado com sucesso.';
    const valor = st.valor ?? 50.9;
    const profNome = st.profNome ?? 'Dra. Maria Glenda';
    const [selectedCard, setSelectedCard] = useState<CardItem | null>(null);

    const goPay = async () => {
        // Tenta registrar o pagamento (requer credenciais MP no backend; 503/erro é tolerado).
        try {
            await teleconsultaService.consultaPayment.create({
                agendamento_id: st.consultaId,
                id_usuario_profissional: st.profId,
                valor,
                payment_method_id: 'credit_card',
                metodo: 'credit_card',
            });
        } catch { /* pagamento indisponível sem MP: segue para a confirmação */ }
        navigate('/minha-saude/agendamento-confirmado', { state: { title: successTitle } });
    };

    return (
        <AppShell>
            <div className="max-w-md mx-auto">
                <PageHeader
                    title={step === 'method' ? 'Pagamento' : step === 'card' ? 'Pagamento com Cartão' : step === 'pix' ? 'Pagamento com Pix' : 'Pagamento'}
                    to="/minha-saude/agendamentos"
                />

                {/* Stepper */}
                <div className="flex items-center mb-6">
                    {[1, 2, 3, 4, 5].map((s, i) => (
                        <div key={s} className="flex items-center flex-1 last:flex-none">
                            <div className="w-6 h-6 rounded-full flex items-center justify-center bg-emerald-500 text-white">
                                <Check size={13} strokeWidth={3} />
                            </div>
                            {i < 4 && <div className="h-0.5 flex-1 mx-1 bg-emerald-500" />}
                        </div>
                    ))}
                </div>

                {step === 'method' && <MethodStep onPick={(id) => setStep(id === 'pix' ? 'pix' : id === 'credito' || id === 'debito' ? 'card' : 'summary')} />}
                {step === 'card' && <CardStep onNext={(card) => { setSelectedCard(card); setStep('summary'); }} />}
                {step === 'summary' && <SummaryStep onPay={goPay} profNome={profNome} valor={valor} card={selectedCard} />}
                {step === 'pix' && <PixStep onPay={goPay} valor={valor} />}
            </div>
        </AppShell>
    );
}

function MethodStep({ onPick }: { onPick: (id: string) => void }) {
    return (
        <div>
            <h2 className="text-base font-bold text-gray-900 mb-1">Como você deseja pagar?</h2>
            <p className="text-xs text-gray-400 mb-4">Escolha a melhor forma de pagamento para concluir sua compra.</p>
            <div className="flex flex-col gap-2">
                {METHODS.map(({ id, label, icon: Icon, hint }) => (
                    <button key={id} onClick={() => onPick(id)} className="flex items-center gap-3 bg-white border border-gray-200 rounded-xl px-4 py-3.5 hover:border-[#407BFF] transition-colors">
                        <Icon size={20} className="text-[#407BFF]" />
                        <span className="text-sm font-semibold text-gray-800 flex-1 text-left">{label}</span>
                        {hint && <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">{hint}</span>}
                        <ChevronRight size={16} className="text-gray-300" />
                    </button>
                ))}
            </div>
        </div>
    );
}

function CardStep({ onNext }: { onNext: (card: CardItem | null) => void }) {
    const { data: cards } = useApiData(fetchCheckoutCards, [], []);
    return (
        <div>
            <h2 className="text-base font-bold text-gray-900 mb-1">Cartão de Crédito</h2>
            <p className="text-xs text-gray-400 mb-4">Escolha um cartão cadastrado ou adicione um novo.</p>
            <div className="flex flex-col gap-2">
                {cards.length === 0 && <p className="text-sm text-gray-400 py-3 text-center">Nenhum cartão cadastrado ainda.</p>}
                {cards.map((c) => (
                    <button key={c.id ?? c.label} onClick={() => onNext(c)} className="flex items-center gap-3 bg-white border border-gray-200 rounded-xl px-4 py-3.5 hover:border-[#407BFF] transition-colors">
                        <span className="w-8 h-5 rounded bg-gradient-to-r from-red-500 to-amber-400" />
                        <span className="text-sm font-semibold text-gray-800 flex-1 text-left">{c.label}</span>
                        <ChevronRight size={16} className="text-gray-300" />
                    </button>
                ))}
                <button className="flex items-center justify-center gap-1 text-[#407BFF] font-bold text-sm py-3 border border-dashed border-[#407BFF]/40 rounded-xl hover:bg-[#407BFF]/5">
                    Novo Cartão <Plus size={16} />
                </button>
            </div>
        </div>
    );
}

function SummaryStep({ onPay, profNome, valor, card }: { onPay: () => void; profNome: string; valor: number; card: CardItem | null }) {
    const [installments, setInstallments] = useState(1);
    const [showInstallments, setShowInstallments] = useState(false);
    const fmt = (v: number) => 'R$ ' + v.toFixed(2).replace('.', ',');

    return (
        <div>
            <h2 className="text-base font-bold text-gray-900 mb-3">Sua Compra</h2>

            {/* Item */}
            <div className="bg-white border border-gray-100 rounded-xl p-4">
                <div className="flex items-center gap-3">
                    <Avatar name={profNome} size={40} />
                    <div className="flex-1">
                        <p className="text-sm font-bold text-gray-900 flex items-center gap-1">{profNome} <BadgeCheck size={13} className="text-emerald-500" /></p>
                        <p className="text-xs text-gray-400">Teleconsulta</p>
                    </div>
                    <span className="text-sm font-bold text-gray-900">{fmt(valor)}</span>
                </div>
                <div className="mt-3 pt-3 border-t border-gray-100">
                    <p className="text-xs text-gray-400">Data do Atendimento</p>
                    <p className="text-sm font-semibold text-gray-800">Segunda, 28 de Abril às 9:30</p>
                </div>
            </div>

            {/* Cupom */}
            <p className="text-sm font-bold text-gray-800 mt-4 mb-1">Tem cupom de Desconto?</p>
            <div className="flex gap-2">
                <input placeholder="CUPOM45" className="flex-1 bg-white border border-gray-200 rounded-lg px-3 py-2.5 text-sm outline-none uppercase" />
                <button className="text-sm font-bold text-[#407BFF] px-4">Aplicar</button>
            </div>

            {/* Pagamento */}
            <div className="mt-4 flex items-center justify-between">
                <div>
                    <p className="text-xs text-gray-400">Pagamento</p>
                    <p className="text-lg font-bold text-gray-900">{fmt(valor)}</p>
                </div>
                <button onClick={() => setShowInstallments(true)} className="text-xs text-gray-600 border border-gray-200 rounded-lg px-3 py-1.5 flex items-center gap-1">
                    {installments}x de {fmt(valor / installments)} <ChevronRight size={14} />
                </button>
            </div>

            <div className="flex items-center gap-2 mt-3">
                <span className="w-8 h-5 rounded bg-gradient-to-r from-red-500 to-amber-400" />
                <span className="text-xs text-gray-500">{card ? `Cartão · ${card.label}` : 'Cartão de Crédito'}</span>
            </div>

            <button onClick={onPay} className="w-full bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-sm py-3.5 rounded-full mt-5 transition-colors">
                Pagar Agora
            </button>

            {showInstallments && (
                <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4" onClick={() => setShowInstallments(false)}>
                    <div className="bg-white rounded-2xl shadow-xl w-full max-w-xs overflow-hidden" onClick={(e) => e.stopPropagation()}>
                        <div className="flex items-center justify-between p-4 border-b border-gray-100">
                            <h3 className="font-bold text-gray-900 text-sm flex items-center gap-1"><ChevronLeft size={16} /> Opções de Parcelamento</h3>
                            <button onClick={() => setShowInstallments(false)} className="text-gray-400"><X size={16} /></button>
                        </div>
                        <div className="max-h-72 overflow-y-auto">
                            {[1, 2, 3, 4, 5, 6].map((n) => (
                                <button key={n} onClick={() => { setInstallments(n); }} className="w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-50 text-left">
                                    <span className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${installments === n ? 'border-[#407BFF]' : 'border-gray-300'}`}>
                                        {installments === n && <span className="w-2 h-2 rounded-full bg-[#407BFF]" />}
                                    </span>
                                    <span className="flex-1">
                                        <span className="block text-sm font-semibold text-gray-800">{n}x de {fmt(valor / n)}</span>
                                        <span className="block text-[11px] text-gray-400">{n <= 3 ? 'sem juros' : 'com juros'}</span>
                                    </span>
                                </button>
                            ))}
                        </div>
                        <div className="p-4 border-t border-gray-100">
                            <button onClick={() => setShowInstallments(false)} className="w-full bg-[#407BFF] hover:bg-blue-600 text-white font-bold text-sm py-2.5 rounded-full">Avançar</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

function PixStep({ onPay, valor }: { onPay: () => void; valor: number }) {
    const code = '00020126360014BR.GOV.BCB.PIX0114+55219999999995204000053039865802BR5913ISAUDE PAGAMENTO6009SAO PAULO62070503***6304A1B2';
    return (
        <div className="text-center">
            <h2 className="text-base font-bold text-gray-900 mb-1">Pix</h2>
            <p className="text-xs text-gray-400 mb-5">Escaneie o QR Code ou copie o código para pagar.</p>
            <div className="w-40 h-40 bg-gray-900 rounded-xl mx-auto mb-3 flex items-center justify-center">
                <QrCode size={100} className="text-white" />
            </div>
            <p className="text-lg font-bold text-gray-900 mb-4">{'R$ ' + valor.toFixed(2).replace('.', ',')}</p>
            <div className="bg-[#F3F4F6] rounded-lg p-3 text-[10px] text-gray-500 break-all text-left mb-4">{code}</div>
            <button onClick={() => navigator.clipboard?.writeText(code).catch(() => {})} className="w-full flex items-center justify-center gap-2 bg-[#407BFF] hover:bg-blue-600 text-white font-bold text-sm py-3 rounded-full transition-colors mb-2">
                Copiar Código <Copy size={16} />
            </button>
            <button onClick={onPay} className="w-full text-emerald-600 font-bold text-sm py-2">Já paguei</button>
        </div>
    );
}
