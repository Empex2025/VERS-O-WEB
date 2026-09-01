import { useState, useRef } from 'react';
import type { KeyboardEvent } from 'react';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';
import logoImage from '../../assets/login/logo-login.png';
import illustrationImage from '../../assets/login/cad-cadastro.png';

export function PhoneVerification() {
    const location = useLocation();
    const navigate = useNavigate();
    // Default to a placeholder if no location state
    const phoneNumber = location.state?.phone || '(32) 99999-2025';

    const [otp, setOtp] = useState(['', '', '', '', '', '']);
    const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

    const handleChange = (index: number, value: string) => {
        if (!/^\d*$/.test(value)) return;

        // Take only the last typed character in case of pasting/multi-keys
        const val = value.slice(-1);

        const newOtp = [...otp];
        newOtp[index] = val;
        setOtp(newOtp);

        if (val && index < 5) {
            inputRefs.current[index + 1]?.focus();
        }
    };

    const handleKeyDown = (index: number, e: KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Backspace' && !otp[index] && index > 0) {
            inputRefs.current[index - 1]?.focus();
        }
    };

    const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
        e.preventDefault();
        const pastedData = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
        if (pastedData) {
            const newOtp = [...otp];
            pastedData.split('').forEach((char, i) => {
                if (i < 6) newOtp[i] = char;
            });
            setOtp(newOtp);
            const focusIndex = Math.min(pastedData.length, 5);
            inputRefs.current[focusIndex]?.focus();
        }
    };

    const isValid = otp.every(digit => digit !== '');

    const handleResend = () => {
        // Aqui entraria a chamada de API para reenviar o código
        console.log('Reenviar código para:', phoneNumber);
        setOtp(['', '', '', '', '', '']);
        inputRefs.current[0]?.focus();
    };

    const onSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!isValid) return;
        // Cadastro concluído — segue para a página inicial
        navigate('/inicio');
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

                {/* Coluna Esquerda: Verificação e Inputs */}
                <div className="w-full lg:w-5/12 pt-8 lg:pt-16 pb-12 flex flex-col z-10 lg:pr-8">

                    {/* Stepper */}
                    <div className="flex items-center mb-10 w-full max-w-[320px]">
                        {[1, 2, 3, 4, 5].map((step, idx) => (
                            <div key={step} className="flex items-center flex-1 last:flex-none">
                                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-colors ${step === 1
                                    ? 'bg-[#407BFF] text-white shadow-md'
                                    : 'bg-[#F3F4F6] text-gray-400'
                                    }`}>
                                    {step}
                                </div>
                                {idx < 4 && (
                                    <div className={`h-[2px] w-full mx-2 ${step < 1 ? 'bg-[#407BFF]' : 'bg-[#F3F4F6]'
                                        }`} />
                                )}
                            </div>
                        ))}
                    </div>

                    <h2 className="text-2xl font-bold text-gray-900 mb-2">Verificação de Telefone</h2>
                    <p className="text-gray-500 text-sm mb-8 leading-relaxed">
                        Digite o código de verificação que enviamos por SMS e <br />
                        WhatsApp para o número de telefone <span className="font-bold text-gray-700">{phoneNumber}</span> <button type="button" onClick={() => navigate(-1)} className="underline hover:text-gray-900 ml-1 font-semibold text-gray-600">(editar)</button>
                    </p>

                    <form className="flex flex-col gap-8 w-full" onSubmit={onSubmit}>

                        {/* OTP Inputs */}
                        <div className="flex gap-2 sm:gap-3 lg:gap-4 relative w-full items-center">
                            {otp.map((digit, index) => (
                                <input
                                    key={index}
                                    ref={el => { inputRefs.current[index] = el; }}
                                    type="text"
                                    inputMode="numeric"
                                    maxLength={1}
                                    value={digit}
                                    onChange={(e) => handleChange(index, e.target.value)}
                                    onKeyDown={(e) => handleKeyDown(index, e)}
                                    onPaste={handlePaste}
                                    className="w-12 h-14 sm:w-14 sm:h-16 text-center text-xl font-bold rounded-xl border-none bg-[#F3F4F6] text-gray-800 focus:bg-white focus:ring-2 focus:ring-[#407BFF] focus:outline-none transition-all shadow-sm"
                                />
                            ))}
                        </div>

                        {/* Botão Verificar */}
                        <div className="mt-8 flex flex-col gap-6 items-center w-full max-w-sm">
                            <button
                                type="submit"
                                disabled={!isValid}
                                className={`w-full flex items-center justify-center gap-2 font-bold py-4 rounded-full transition-all group ${isValid
                                    ? 'bg-[#407BFF] hover:bg-blue-600 active:bg-blue-700 text-white shadow-lg shadow-blue-500/20 cursor-pointer'
                                    : 'bg-[#E5E7EB] text-gray-400 cursor-not-allowed'
                                    }`}
                            >
                                Verificar
                                <ArrowRight size={18} className={`transition-transform ${isValid ? 'opacity-100 group-hover:translate-x-1' : 'opacity-70'}`} />
                            </button>

                            <button type="button" onClick={handleResend} className="text-[#407BFF] text-sm font-bold hover:text-blue-700 hover:underline transition-colors w-full text-center">
                                Reenviar Código
                            </button>
                        </div>
                    </form>
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
