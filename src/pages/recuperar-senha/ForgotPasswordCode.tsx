import { useState, useRef } from 'react';
import type { KeyboardEvent } from 'react';
import { ChevronLeft, AlertCircle } from 'lucide-react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { authService } from '../../services/authService';
import { ApiError } from '../../services/http';
import logoImage from '../../assets/login/logo-login.png';

const CODE_LENGTH = 6;

export function ForgotPasswordCode() {
    const location = useLocation();
    const navigate = useNavigate();

    // Contato informado na tela anterior (e-mail ou telefone)
    const contact: string = location.state?.contact ?? '';
    // Exibe apenas os últimos dígitos do telefone, quando houver
    const digits = contact.replace(/\D/g, '');
    const lastDigits = digits.slice(-4);

    const [code, setCode] = useState<string[]>(Array(CODE_LENGTH).fill(''));
    const [error, setError] = useState(false);
    const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

    const handleChange = (index: number, value: string) => {
        // Aceita letras e números (código alfanumérico)
        if (!/^[a-zA-Z0-9]*$/.test(value)) return;

        setError(false);
        const char = value.slice(-1).toUpperCase();
        const newCode = [...code];
        newCode[index] = char;
        setCode(newCode);

        if (char && index < CODE_LENGTH - 1) {
            inputRefs.current[index + 1]?.focus();
        }
    };

    const handleKeyDown = (index: number, e: KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Backspace' && !code[index] && index > 0) {
            inputRefs.current[index - 1]?.focus();
        }
    };

    const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
        e.preventDefault();
        const pasted = e.clipboardData
            .getData('text')
            .replace(/[^a-zA-Z0-9]/g, '')
            .toUpperCase()
            .slice(0, CODE_LENGTH);
        if (!pasted) return;

        setError(false);
        const newCode = [...code];
        pasted.split('').forEach((char, i) => {
            if (i < CODE_LENGTH) newCode[i] = char;
        });
        setCode(newCode);
        const focusIndex = Math.min(pasted.length, CODE_LENGTH - 1);
        inputRefs.current[focusIndex]?.focus();
    };

    const isFilled = code.every((char) => char !== '');
    const canSubmit = isFilled && !error;

    const handleResend = () => {
        // Aqui entraria a chamada de API para reenviar o código
        console.log('Reenviar código para:', contact);
        setError(false);
        setCode(Array(CODE_LENGTH).fill(''));
        inputRefs.current[0]?.focus();
    };

    const onSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!isFilled) return;

        const otp = code.join('');
        try {
            await authService.verifyResetCode(contact, otp);
            navigate('/recuperar-senha/nova-senha', { state: { contact, code: otp } });
        } catch (err) {
            if (err instanceof ApiError) {
                setError(true); // código incorreto/expirado
            } else {
                // API indisponível: segue em modo demo
                navigate('/recuperar-senha/nova-senha', { state: { contact, code: otp } });
            }
        }
    };

    const boxClass = (char: string) => {
        if (error) return 'bg-red-50 border-red-300 text-red-500 focus:ring-red-200';
        if (char) return 'bg-blue-50 border-[#407BFF] text-gray-800 focus:ring-[#407BFF]/30';
        return 'bg-[#F3F4F6] border-transparent text-gray-800 focus:bg-white focus:ring-[#407BFF]/30';
    };

    return (
        <div className="min-h-screen w-full flex flex-col bg-white overflow-x-hidden font-sans">
            {/* Header Superior Azul */}
            <header className="w-full bg-[#407BFF] h-16 flex items-center px-4 md:px-12 shadow-sm">
                <img src={logoImage} alt="iSaúde" className="h-8 object-contain brightness-0 invert" />
            </header>

            {/* Faixa de Navegação 'Voltar' */}
            <div className="w-full border-b border-gray-100 flex items-center px-4 md:px-12 h-14">
                <Link
                    to="/recuperar-senha"
                    className="flex items-center gap-1 text-gray-800 hover:text-blue-600 font-bold text-sm transition-colors group"
                >
                    <ChevronLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
                    Recuperação de Senha
                </Link>
            </div>

            {/* Conteúdo Principal Centralizado */}
            <main className="flex-1 flex items-start justify-center px-6 pt-16 md:pt-24">
                <div className="w-full max-w-md flex flex-col items-center text-center">
                    <div className="w-full text-left">
                        <h1 className="text-2xl font-bold text-gray-900 mb-3">Esqueceu sua Senha?</h1>
                        <p className="text-gray-500 text-sm mb-8 leading-relaxed">
                            Enviamos um código de recuperação para o número de telefone com o final{' '}
                            <span className="font-bold text-gray-700">{lastDigits || '0000'}</span>.
                        </p>
                    </div>

                    <form className="w-full flex flex-col items-center" onSubmit={onSubmit}>
                        {/* Inputs do Código */}
                        <div className="flex gap-2 sm:gap-3 justify-center w-full">
                            {code.map((char, index) => (
                                <input
                                    key={index}
                                    ref={(el) => { inputRefs.current[index] = el; }}
                                    type="text"
                                    inputMode="text"
                                    maxLength={1}
                                    value={char}
                                    aria-invalid={error}
                                    onChange={(e) => handleChange(index, e.target.value)}
                                    onKeyDown={(e) => handleKeyDown(index, e)}
                                    onPaste={handlePaste}
                                    className={`w-12 h-12 sm:w-14 sm:h-14 text-center text-lg font-bold rounded-xl border transition-all outline-none focus:ring-2 ${boxClass(char)}`}
                                />
                            ))}
                        </div>

                        {/* Mensagem de erro */}
                        {error && (
                            <p className="flex items-center gap-1.5 text-red-500 text-sm mt-3 self-start">
                                <AlertCircle size={15} />
                                Ops... esse código não está certo.
                            </p>
                        )}

                        {/* Reenviar código (texto) */}
                        <p className="text-gray-500 text-sm mt-4">
                            Não recebeu?{' '}
                            <button
                                type="button"
                                onClick={handleResend}
                                className="text-gray-700 font-semibold hover:text-[#407BFF] transition-colors"
                            >
                                Tente reenviar o Código.
                            </button>
                        </p>

                        {/* Botão Verificar */}
                        <button
                            type="submit"
                            disabled={!canSubmit}
                            className={`w-full mt-12 flex items-center justify-center gap-2 font-bold py-4 rounded-full transition-all ${
                                canSubmit
                                    ? 'bg-[#407BFF] hover:bg-blue-600 active:bg-blue-700 text-white shadow-lg shadow-blue-500/20 cursor-pointer'
                                    : 'bg-[#E5E7EB] text-gray-400 cursor-not-allowed'
                            }`}
                        >
                            Verificar
                        </button>

                        {/* Reenviar Código (link) */}
                        <button
                            type="button"
                            onClick={handleResend}
                            className="mt-6 text-[#407BFF] text-sm font-bold hover:text-blue-700 hover:underline transition-colors"
                        >
                            Reenviar Código
                        </button>
                    </form>
                </div>
            </main>
        </div>
    );
}
