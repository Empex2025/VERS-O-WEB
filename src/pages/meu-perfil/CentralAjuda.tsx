import { useState } from 'react';
import { Search, ChevronDown, MessageSquareText, Send } from 'lucide-react';
import { AppShell } from '../../components/layout/AppShell';
import { PageHeader } from '../../components/layout/PageHeader';

const FAQ = [
    { q: 'Como agendo uma consulta?', a: 'Acesse o perfil do profissional desejado e toque em "Agendar Atendimento". Escolha data, horário e forma de pagamento para confirmar.' },
    { q: 'Como funciona a teleconsulta?', a: 'No horário marcado, vá em Minha Saúde › Meus Agendamentos e toque em "Entrar na Sala de Atendimento" para iniciar a chamada por vídeo.' },
    { q: 'Posso cancelar ou reagendar?', a: 'Sim. No detalhe do agendamento, use o menu para reagendar gratuitamente ou cancelar. Cancelamentos até 24h antes são reembolsados.' },
    { q: 'Como torno meu perfil privado?', a: 'Em Meu Perfil › Opções de perfil › Privacidade da Conta, ative a opção "Perfil Privado".' },
    { q: 'Como viro um profissional verificado?', a: 'Em Editar Perfil, toque em "Trocar Perfil" e conclua a verificação enviando seus documentos e registro profissional.' },
];

export function CentralAjuda() {
    const [open, setOpen] = useState<number | null>(0);
    const [feedback, setFeedback] = useState('');
    const [sent, setSent] = useState(false);

    return (
        <AppShell rightRail={null}>
            <div className="max-w-2xl mx-auto">
                <PageHeader title="Central de Ajuda e Feedback" to="/meu-perfil/opcoes" />

                {/* Busca */}
                <div className="relative mb-5">
                    <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input placeholder="Como podemos ajudar?" className="w-full bg-white border border-gray-200 rounded-xl py-3 pl-11 pr-4 text-sm outline-none focus:ring-2 focus:ring-[#407BFF]/20" />
                </div>

                {/* Perguntas frequentes */}
                <h2 className="text-sm font-bold text-gray-900 mb-2">Perguntas frequentes</h2>
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm divide-y divide-gray-100 mb-6">
                    {FAQ.map((f, i) => (
                        <div key={i}>
                            <button onClick={() => setOpen(open === i ? null : i)} className="w-full flex items-center gap-3 px-4 py-3.5 text-left">
                                <span className="flex-1 text-sm font-semibold text-gray-800">{f.q}</span>
                                <ChevronDown size={16} className={`text-gray-400 transition-transform ${open === i ? 'rotate-180' : ''}`} />
                            </button>
                            {open === i && <p className="px-4 pb-4 text-sm text-gray-500 leading-relaxed">{f.a}</p>}
                        </div>
                    ))}
                </div>

                {/* Feedback */}
                <h2 className="text-sm font-bold text-gray-900 mb-2">Enviar Feedback</h2>
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
                    {sent ? (
                        <div className="flex flex-col items-center text-center py-6">
                            <div className="w-12 h-12 rounded-full bg-emerald-50 flex items-center justify-center mb-3"><MessageSquareText size={22} className="text-emerald-500" /></div>
                            <p className="text-sm font-bold text-gray-900">Obrigado pelo seu feedback!</p>
                            <p className="text-xs text-gray-500 mt-1">Sua mensagem foi enviada para nossa equipe.</p>
                        </div>
                    ) : (
                        <>
                            <textarea
                                value={feedback}
                                onChange={(e) => setFeedback(e.target.value)}
                                rows={4}
                                placeholder="Conte pra gente o que podemos melhorar..."
                                className="w-full bg-[#F3F4F6] rounded-xl p-3 text-sm outline-none resize-none"
                            />
                            <button
                                onClick={() => feedback.trim() && setSent(true)}
                                disabled={!feedback.trim()}
                                className={`w-full mt-3 flex items-center justify-center gap-2 font-bold text-sm py-3 rounded-full transition-colors ${feedback.trim() ? 'bg-[#407BFF] hover:bg-blue-600 text-white' : 'bg-[#E5E7EB] text-gray-400 cursor-not-allowed'}`}
                            >
                                Enviar Feedback <Send size={15} />
                            </button>
                        </>
                    )}
                </div>
            </div>
        </AppShell>
    );
}
