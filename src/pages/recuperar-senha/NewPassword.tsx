import { useState } from 'react';
import { ChevronLeft, KeyRound, Eye, EyeOff, AlertCircle } from 'lucide-react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { authService } from '../../services/authService';
import { ApiError } from '../../services/http';
import logoImage from '../../assets/login/logo-login.png';

// Critérios de força da senha (na ordem das barras)
const STRENGTH_RULES = [
    /[a-z]/,        // letra minúscula
    /[A-Z]/,        // letra maiúscula
    /[0-9]/,        // número
    /[^a-zA-Z0-9]/, // caractere especial
];

function getStrength(password: string): number {
    return STRENGTH_RULES.reduce((score, rule) => (rule.test(password) ? score + 1 : score), 0);
}

export function NewPassword() {
    const location = useLocation();
    const navigate = useNavigate();
    const contact: string = location.state?.contact ?? '';
    const code: string = location.state?.code ?? '';

    const [password, setPassword] = useState('');
    const [confirm, setConfirm] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    const strength = getStrength(password);
    const passwordsMatch = confirm.length > 0 && password === confirm;
    const showMismatch = confirm.length > 0 && password !== confirm;
    const canSubmit = password.length >= 8 && passwordsMatch;

    const onSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!canSubmit) return;
        setError(null);
        setLoading(true);
        try {
            await authService.resetPassword(contact, password, confirm, code);
            navigate('/recuperar-senha/sucesso', { state: { contact } });
        } catch (err) {
            if (err instanceof ApiError) {
                setError(err.message); // código expirado / regra de senha
            } else {
                // API indisponível: segue em modo demo
                navigate('/recuperar-senha/sucesso', { state: { contact } });
            }
        } finally {
            setLoading(false);
        }
    };

    const handleResend = () => {
        // Volta para a etapa de código
        navigate('/recuperar-senha/codigo', { state: { contact } });
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
                    to="/recuperar-senha/codigo"
                    state={{ contact }}
                    className="flex items-center gap-1 text-gray-800 hover:text-blue-600 font-bold text-sm transition-colors group"
                >
                    <ChevronLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
                    Recuperação de Senha
                </Link>
            </div>

            {/* Conteúdo Principal Centralizado */}
            <main className="flex-1 flex items-start justify-center px-6 pt-16 md:pt-24">
                <div className="w-full max-w-md flex flex-col">
                    <h1 className="text-2xl font-bold text-gray-900 mb-3">Crie uma Nova Senha</h1>
                    <p className="text-gray-500 text-sm mb-1 leading-relaxed">
                        Crie uma senha forte que será usada para fazer login.
                    </p>
                    <p className="text-gray-500 text-sm mb-8 leading-relaxed">
                        A senha deve conter letras minúsculas e maiúsculas, números e caracteres especiais.
                    </p>

                    <form className="w-full flex flex-col gap-6" onSubmit={onSubmit}>
                        {/* Campo Crie uma Senha */}
                        <div className="flex flex-col gap-2">
                            <label htmlFor="password" className="text-sm font-bold text-gray-800">
                                Crie uma Senha
                            </label>
                            <div className="relative flex items-center bg-[#F3F4F6] rounded-xl border border-transparent focus-within:border-[#407BFF] focus-within:bg-white focus-within:ring-2 focus-within:ring-[#407BFF]/20 transition-all">
                                <div className="absolute left-4 text-gray-400">
                                    <KeyRound size={18} />
                                </div>
                                <input
                                    id="password"
                                    type={showPassword ? 'text' : 'password'}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    autoComplete="new-password"
                                    placeholder="Digite sua senha aqui"
                                    className="w-full bg-transparent border-none py-3.5 pl-11 pr-11 text-sm text-gray-700 outline-none placeholder-gray-400"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword((v) => !v)}
                                    className="absolute right-4 text-gray-400 hover:text-gray-600 transition-colors"
                                    aria-label={showPassword ? 'Ocultar senha' : 'Mostrar senha'}
                                >
                                    {showPassword ? <Eye size={18} /> : <EyeOff size={18} />}
                                </button>
                            </div>

                            {/* Indicador de força */}
                            <div className="flex gap-2 mt-1">
                                {STRENGTH_RULES.map((_, i) => (
                                    <span
                                        key={i}
                                        className={`h-1.5 flex-1 rounded-full transition-colors ${
                                            i < strength ? 'bg-teal-500' : 'bg-gray-200'
                                        }`}
                                    />
                                ))}
                            </div>
                        </div>

                        {/* Campo Digite Novamente */}
                        <div className="flex flex-col gap-2">
                            <label htmlFor="confirm" className="text-sm font-bold text-gray-800">
                                Digite Novamente
                            </label>
                            <div
                                className={`relative flex items-center bg-[#F3F4F6] rounded-xl border transition-all focus-within:bg-white focus-within:ring-2 ${
                                    showMismatch
                                        ? 'border-red-300 focus-within:border-red-400 focus-within:ring-red-200'
                                        : 'border-transparent focus-within:border-[#407BFF] focus-within:ring-[#407BFF]/20'
                                }`}
                            >
                                <div className="absolute left-4 text-gray-400">
                                    <KeyRound size={18} />
                                </div>
                                <input
                                    id="confirm"
                                    type={showConfirm ? 'text' : 'password'}
                                    value={confirm}
                                    onChange={(e) => setConfirm(e.target.value)}
                                    autoComplete="new-password"
                                    placeholder="Digite sua senha aqui"
                                    className="w-full bg-transparent border-none py-3.5 pl-11 pr-11 text-sm text-gray-700 outline-none placeholder-gray-400"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowConfirm((v) => !v)}
                                    className="absolute right-4 text-gray-400 hover:text-gray-600 transition-colors"
                                    aria-label={showConfirm ? 'Ocultar senha' : 'Mostrar senha'}
                                >
                                    {showConfirm ? <Eye size={18} /> : <EyeOff size={18} />}
                                </button>
                            </div>
                            {showMismatch && (
                                <span className="flex items-center gap-1.5 text-red-500 text-xs">
                                    <AlertCircle size={14} />
                                    As senhas não coincidem.
                                </span>
                            )}
                        </div>

                        {/* Erro do backend */}
                        {error && (
                            <span className="flex items-center gap-1.5 text-red-500 text-xs">
                                <AlertCircle size={14} /> {error}
                            </span>
                        )}

                        {/* Botão Verificar */}
                        <button
                            type="submit"
                            disabled={!canSubmit || loading}
                            className={`w-full mt-2 flex items-center justify-center font-bold py-4 rounded-full transition-all ${
                                canSubmit && !loading
                                    ? 'bg-[#407BFF] hover:bg-blue-600 active:bg-blue-700 text-white shadow-lg shadow-blue-500/20 cursor-pointer'
                                    : 'bg-[#E5E7EB] text-gray-400 cursor-not-allowed'
                            }`}
                        >
                            {loading ? 'Salvando...' : 'Verificar'}
                        </button>

                        {/* Reenviar Código (link) */}
                        <button
                            type="button"
                            onClick={handleResend}
                            className="text-[#407BFF] text-sm font-bold text-center hover:text-blue-700 hover:underline transition-colors"
                        >
                            Reenviar Código
                        </button>
                    </form>
                </div>
            </main>
        </div>
    );
}
