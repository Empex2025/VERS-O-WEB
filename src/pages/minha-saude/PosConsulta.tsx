import { useState } from 'react';
import { Star, FileText, Share2, HelpCircle, Flag, ChevronRight, X, PartyPopper } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import logoImage from '../../assets/login/logo-login.png';

type Phase = 'done' | 'survey' | 'thanks';

export function PosConsulta() {
    const navigate = useNavigate();
    const [phase, setPhase] = useState<Phase>('done');
    const [rating, setRating] = useState(0);

    return (
        <div className="min-h-screen flex flex-col bg-white font-sans">
            {/* Header azul */}
            <header className="w-full bg-[#407BFF] h-16 flex items-center px-4 md:px-12 shadow-sm">
                <img src={logoImage} alt="iSaúde" className="h-8 object-contain brightness-0 invert" />
            </header>
            <div className="w-full border-b border-gray-100 px-4 md:px-8 h-12 flex items-center">
                <span className="text-sm font-semibold text-gray-700">Atendimento Concluído</span>
            </div>

            <main className="flex-1 flex items-center justify-center px-6 py-10">
                <div className="w-full max-w-md text-center">
                    <div className="w-full h-40 rounded-2xl bg-[#407BFF]/5 flex items-center justify-center mb-8">
                        <PartyPopper size={56} className="text-[#407BFF]" />
                    </div>

                    <h1 className="text-xl font-bold text-gray-900">Atendimento finalizado com Sucesso.</h1>
                    <p className="text-sm text-gray-500 mt-2">
                        A consulta foi encerrada pelo profissional. Este atendimento possui um retorno incluso,
                        vá até a página do atendimento para agendar o retorno.
                    </p>

                    {/* Avaliação */}
                    <p className="text-sm font-semibold text-gray-700 mt-6 mb-2">Como você avalia este atendimento?</p>
                    <div className="flex justify-center gap-1 mb-6">
                        {[1, 2, 3, 4, 5].map((s) => (
                            <button key={s} onClick={() => { setRating(s); setPhase('survey'); }}>
                                <Star size={30} className={s <= rating ? 'fill-amber-400 text-amber-400' : 'text-gray-300'} />
                            </button>
                        ))}
                    </div>

                    {/* Ações */}
                    <div className="flex flex-col gap-1 text-left">
                        <ActionRow icon={<FileText size={18} />} label="Página de Atendimento" onClick={() => navigate('/minha-saude/agendamentos')} />
                        <ActionRow icon={<Share2 size={18} />} label="Compartilhar Profissional" />
                        <ActionRow icon={<HelpCircle size={18} />} label="Ajuda e Suporte" />
                        <ActionRow icon={<Flag size={18} />} label="Denunciar Atendimento" danger />
                    </div>
                </div>
            </main>

            {/* Pesquisa de satisfação */}
            {phase === 'survey' && (
                <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4">
                    <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm p-5">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="font-bold text-gray-900 text-sm flex items-center gap-1">Pesquisa de Satisfação</h3>
                            <button onClick={() => setPhase('done')} className="text-gray-400"><X size={18} /></button>
                        </div>
                        <p className="text-xs text-gray-500 text-center mb-2">Como você avalia este atendimento?</p>
                        <div className="flex justify-center gap-1 mb-4">
                            {[1, 2, 3, 4, 5].map((s) => (
                                <button key={s} onClick={() => setRating(s)}>
                                    <Star size={26} className={s <= rating ? 'fill-amber-400 text-amber-400' : 'text-gray-300'} />
                                </button>
                            ))}
                        </div>
                        <p className="text-xs font-semibold text-gray-700 mb-1">Comentários</p>
                        <textarea
                            rows={3}
                            placeholder="Conte o que achou do atendimento..."
                            className="w-full bg-[#F3F4F6] rounded-lg p-3 text-sm outline-none resize-none mb-4"
                        />
                        <button onClick={() => setPhase('thanks')} className="w-full bg-[#407BFF] hover:bg-blue-600 text-white font-bold text-sm py-3 rounded-full transition-colors">
                            Publicar Avaliação
                        </button>
                    </div>
                </div>
            )}

            {/* Agradecimento */}
            {phase === 'thanks' && (
                <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4">
                    <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm p-6 text-center">
                        <div className="w-full h-32 rounded-2xl bg-amber-50 flex items-center justify-center mb-4">
                            <PartyPopper size={44} className="text-amber-500" />
                        </div>
                        <h3 className="text-base font-bold text-gray-900">Obrigado por Avaliar!</h3>
                        <p className="text-sm text-gray-500 mt-1">Com a sua ajuda, tornamos nossa comunidade cada vez mais segura e acolhedora para todos.</p>
                        <button onClick={() => navigate('/inicio')} className="w-full bg-[#407BFF] hover:bg-blue-600 text-white font-bold text-sm py-3 rounded-full mt-5 transition-colors">
                            Voltar para o Início
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}

function ActionRow({ icon, label, danger, onClick }: { icon: React.ReactNode; label: string; danger?: boolean; onClick?: () => void }) {
    return (
        <button onClick={onClick} className={`w-full flex items-center gap-3 px-3 py-3 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium ${danger ? 'text-rose-500' : 'text-gray-700'}`}>
            <span className={danger ? 'text-rose-500' : 'text-[#407BFF]'}>{icon}</span>
            <span className="flex-1 text-left">{label}</span>
            <ChevronRight size={16} className="text-gray-300" />
        </button>
    );
}
