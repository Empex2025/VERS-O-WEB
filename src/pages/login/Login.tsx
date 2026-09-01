import { useState } from 'react';
import { Mail, KeyRound, EyeOff, Eye, ChevronRight, AlertCircle } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { authService } from '../../services/authService';
import { ApiError } from '../../services/http';
import bgImage from '../../assets/login/cad login.png';
import logoImage from '../../assets/login/logo-login.png';

export function Login() {
    const [showPassword, setShowPassword] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);

        // Atalho de desenvolvimento: sem e-mail, entra direto (modo demo).
        if (!email.trim()) {
            navigate('/inicio');
            return;
        }

        setLoading(true);
        try {
            await authService.login(email.trim(), password);
            navigate('/inicio');
        } catch (err) {
            if (err instanceof ApiError) {
                setError(err.message); // credenciais inválidas / e-mail não verificado
            } else {
                // API ainda não publicada / fora do ar: segue em modo demo
                console.warn('API indisponível — entrando em modo demo.', err);
                navigate('/inicio');
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen w-full flex bg-white font-sans">
            {/* Coluna Esquerda: Formulário de Login */}
            <div className="w-full lg:w-1/2 flex flex-col justify-center items-center p-8 sm:p-12 lg:p-16 relative">
                <div className="w-full max-w-md flex flex-col items-center">

                    {/* Logo */}
                    <div className="mb-8">
                        <img src={logoImage} alt="iSaúde Logo" className="h-10 md:h-12 object-contain" />
                    </div>

                    {/* Títulos */}
                    <div className="text-center mb-10">
                        <h2 className="text-2xl font-bold text-gray-900 mb-2">Que bom ter você de volta!</h2>
                        <p className="text-gray-500 text-sm">Use seus dados para entrar na comunidade.</p>
                    </div>

                    {/* Formulário */}
                    <form className="w-full space-y-5" onSubmit={handleLogin}>

                        {/* E-mail */}
                        <div className="flex flex-col gap-2">
                            <label className="text-sm font-bold text-gray-800">E-mail</label>
                            <div className="relative flex items-center bg-[#F3F4F6] rounded-xl overflow-hidden border border-transparent focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-500/20 transition-all">
                                <div className="absolute left-4 text-gray-400">
                                    <Mail size={20} />
                                </div>
                                <input
                                    type="email"
                                    autoComplete="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="Digite seu e-mail aqui"
                                    className="w-full bg-transparent border-none py-3.5 pl-12 pr-4 text-sm text-gray-700 outline-none placeholder-gray-400"
                                />
                            </div>
                        </div>

                        {/* Senha */}
                        <div className="flex flex-col gap-2">
                            <label className="text-sm font-bold text-gray-800">Digite sua senha</label>
                            <div className="relative flex items-center bg-[#F3F4F6] rounded-xl overflow-hidden border border-transparent focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-500/20 transition-all">
                                <div className="absolute left-4 text-gray-400">
                                    <KeyRound size={20} />
                                </div>
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    autoComplete="current-password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="Digite sua senha aqui"
                                    className="w-full bg-transparent border-none py-3.5 pl-12 pr-12 text-sm text-gray-700 outline-none placeholder-gray-400"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-4 text-gray-400 hover:text-gray-600 transition-colors"
                                >
                                    {showPassword ? <Eye size={20} /> : <EyeOff size={20} />}
                                </button>
                            </div>
                        </div>

                        {/* Link Esqueci Minha Senha */}
                        <div className="flex justify-end w-full pt-1">
                            <Link to="/recuperar-senha" className="text-xs font-bold text-gray-900 hover:text-blue-600 transition-colors flex items-center gap-1 group">
                                Esqueci minha Senha! <ChevronRight size={14} className="group-hover:translate-x-0.5 transition-transform" />
                            </Link>
                        </div>

                        {/* Erro de autenticação */}
                        {error && (
                            <p className="flex items-center gap-1.5 text-sm text-red-500">
                                <AlertCircle size={15} /> {error}
                            </p>
                        )}

                        {/* Botão de Entrar */}
                        <div className="pt-4">
                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full bg-[#407BFF] hover:bg-blue-600 active:bg-blue-700 text-white font-semibold flex items-center justify-center py-4 rounded-full transition-all shadow-md shadow-blue-500/20 disabled:opacity-60"
                            >
                                {loading ? 'Entrando...' : 'Entrar'}
                            </button>
                        </div>
                    </form>

                    {/* Footer Crie uma Conta */}
                    <div className="mt-8 text-sm font-medium text-gray-800">
                        Novo por aqui?{' '}
                        <Link to="/cadastro" className="text-[#407BFF] font-bold hover:text-blue-700 transition-colors">
                            Crie uma conta!
                        </Link>
                    </div>
                </div>
            </div>

            {/* Coluna Direita: Imagem de Fundo */}
            <div className="hidden lg:flex w-1/2 relative bg-gray-100 overflow-hidden">
                <img
                    src={bgImage}
                    alt="Profissional de saúde"
                    className="absolute inset-0 w-full h-full object-cover"
                />
            </div>
        </div>
    );
}
