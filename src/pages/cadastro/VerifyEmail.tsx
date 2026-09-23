import { useState } from 'react';
import { ArrowLeft, ArrowRight, MailCheck, Loader2, CheckCircle2, AlertCircle } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';
import { authService } from '../../services/authService';
import logoImage from '../../assets/login/logo-login.png';
import illustrationImage from '../../assets/login/cad-cadastro.png';

type Status = 'idle' | 'sending' | 'sent' | 'error';

export function VerifyEmail() {
    const location = useLocation();
    const navigate = useNavigate();
    const email: string = location.state?.email || 'seu e-mail';

    const [status, setStatus] = useState<Status>('idle');

    const handleResend = async () => {
        if (!location.state?.email) {
            setStatus('error');
            return;
        }
        setStatus('sending');
        try {
            await authService.sendConfirmationEmail(email);
            setStatus('sent');
        } catch {
            setStatus('error');
        }
    };

    return (
        <div className="min-h-screen w-full flex flex-col bg-white overflow-x-hidden font-sans">
            {/* Header Superior Azul */}
            <header className="w-full bg-[#407BFF] h-16 flex items-center px-4 md:px-12 shadow-sm">
                <img src={logoImage} alt="iSaúde" className="h-8 object-contain brightness-0 invert" />
            </header>

            {/* Faixa de Navegação 'Voltar' */}
            <div className="w-full border-b border-gray-100 flex items-center px-4 md:px-12 h-14">
                <button type="button" onClick={() => navigate(-1)} className="flex items-center gap-2 text-gray-800 hover:text-blue-600 font-bold text-sm transition-colors group">
                    <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
                    Nova Conta
                </button>
            </div>

            {/* Conteúdo Principal Dividido */}
            <main className="flex-1 flex flex-col lg:flex-row w-full max-w-7xl mx-auto px-6 lg:px-12">

                {/* Coluna Esquerda */}
                <div className="w-full lg:w-5/12 pt-8 lg:pt-16 pb-12 flex flex-col z-10 lg:pr-8">

                    {/* Ícone */}
                    <div className="w-14 h-14 rounded-2xl bg-[#407BFF]/10 flex items-center justify-center text-[#407BFF] mb-6">
                        <MailCheck size={26} />
                    </div>

                    <h2 className="text-2xl font-bold text-gray-900 mb-2">Verifique seu e-mail</h2>
                    <p className="text-gray-500 text-sm mb-8 leading-relaxed">
                        Enviamos um <span className="font-bold text-gray-700">link de ativação</span> para{' '}
                        <span className="font-bold text-gray-700">{email}</span>. Abra seu e-mail e clique no
                        link para ativar sua conta. Depois é só entrar normalmente.
                    </p>

                    {/* Dica */}
                    <div className="bg-[#F3F4F6] rounded-xl px-4 py-3 text-xs text-gray-500 mb-8 leading-relaxed">
                        Não recebeu? Verifique a caixa de spam ou lixo eletrônico. O link pode levar alguns
                        minutos para chegar.
                    </div>

                    {/* Feedback de reenvio */}
                    {status === 'sent' && (
                        <div className="flex items-center gap-2 text-emerald-600 text-sm font-semibold mb-4">
                            <CheckCircle2 size={16} /> E-mail de ativação reenviado.
                        </div>
                    )}
                    {status === 'error' && (
                        <div className="flex items-center gap-2 text-rose-500 text-sm font-semibold mb-4">
                            <AlertCircle size={16} /> Não foi possível reenviar. Tente novamente pela tela de cadastro.
                        </div>
                    )}

                    {/* Ações */}
                    <div className="flex flex-col gap-4 w-full max-w-sm">
                        <button
                            type="button"
                            onClick={() => navigate('/login')}
                            className="w-full flex items-center justify-center gap-2 font-bold py-4 rounded-full bg-[#407BFF] hover:bg-blue-600 active:bg-blue-700 text-white shadow-lg shadow-blue-500/20 transition-all group"
                        >
                            Ir para o login
                            <ArrowRight size={18} className="transition-transform group-hover:translate-x-1" />
                        </button>

                        <button
                            type="button"
                            onClick={handleResend}
                            disabled={status === 'sending'}
                            className="text-[#407BFF] text-sm font-bold hover:text-blue-700 hover:underline transition-colors w-full text-center flex items-center justify-center gap-2 disabled:opacity-60"
                        >
                            {status === 'sending' ? (
                                <><Loader2 size={16} className="animate-spin" /> Enviando…</>
                            ) : (
                                'Reenviar e-mail de ativação'
                            )}
                        </button>
                    </div>
                </div>

                {/* Coluna Direita: Ilustração */}
                <div className="hidden lg:flex w-7/12 justify-end items-center pointer-events-none pl-12">
                    <img
                        src={illustrationImage}
                        alt="Pessoas conectadas incluindo profissionais e pacientes"
                        className="w-full max-w-2xl object-contain drop-shadow-sm opacity-90 relative z-10"
                    />
                </div>

            </main>
        </div>
    );
}
