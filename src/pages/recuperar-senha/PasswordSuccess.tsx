import { ThumbsUp } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import logoImage from '../../assets/login/logo-login.png';

export function PasswordSuccess() {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen w-full flex flex-col bg-white overflow-x-hidden font-sans">
            {/* Header Superior Azul */}
            <header className="w-full bg-[#407BFF] h-16 flex items-center px-4 md:px-12 shadow-sm">
                <img src={logoImage} alt="iSaúde" className="h-8 object-contain brightness-0 invert" />
            </header>

            {/* Conteúdo Principal Centralizado */}
            <main className="flex-1 flex items-start justify-center px-6 pt-16 md:pt-24">
                <div className="w-full max-w-md flex flex-col items-center text-center">
                    {/* Ilustração */}
                    <div className="relative mb-10 flex items-center justify-center">
                        <div className="absolute w-48 h-48 rounded-full bg-teal-50" />
                        <div className="relative w-28 h-28 rounded-3xl bg-teal-500 rotate-[-12deg] flex items-center justify-center shadow-lg shadow-teal-500/30">
                            <ThumbsUp size={56} className="text-white rotate-[12deg]" strokeWidth={2.2} />
                        </div>
                    </div>

                    <h1 className="text-2xl font-bold text-gray-900 mb-3">Senha alterada com Sucesso!</h1>
                    <p className="text-gray-500 text-sm mb-10 leading-relaxed max-w-sm">
                        Com a sua ajuda, tornamos nossa comunidade cada vez mais segura e acolhedora para todos.
                    </p>

                    {/* Botão para o login */}
                    <button
                        type="button"
                        onClick={() => navigate('/')}
                        className="w-full flex items-center justify-center font-bold py-4 rounded-full bg-[#407BFF] hover:bg-blue-600 active:bg-blue-700 text-white shadow-lg shadow-blue-500/20 transition-all cursor-pointer"
                    >
                        Ir para o Login
                    </button>
                </div>
            </main>
        </div>
    );
}
