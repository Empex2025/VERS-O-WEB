import { ChevronLeft, LifeBuoy } from 'lucide-react';
import { Link } from 'react-router-dom';
import logoImage from '../../assets/login/logo-login.png';

export function NoPhoneAccess() {
    // Canal de suporte — troque pelo número/URL oficial do iSaúde.
    const SUPPORT_WHATSAPP = 'https://wa.me/5599999999999';

    const handleSupport = () => {
        window.open(SUPPORT_WHATSAPP, '_blank', 'noopener,noreferrer');
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
                <div className="w-full max-w-md flex flex-col">
                    <h1 className="text-2xl font-bold text-gray-900 mb-3">Sem acesso ao Número de telefone?</h1>
                    <p className="text-gray-500 text-sm mb-2 leading-relaxed">
                        Fica tranquilo(a), a gente pode te ajudar.
                    </p>
                    <p className="text-gray-500 text-sm mb-8 leading-relaxed">
                        Se você não tem mais acesso ao número de telefone cadastrado no iSaúde,
                        entre em contato com nosso time de suporte para recuperar sua conta com segurança.
                    </p>

                    {/* Botão Falar com o suporte */}
                    <button
                        type="button"
                        onClick={handleSupport}
                        className="w-full flex items-center justify-center gap-2 font-bold py-4 rounded-full bg-[#407BFF] hover:bg-blue-600 active:bg-blue-700 text-white shadow-lg shadow-blue-500/20 transition-all group cursor-pointer"
                    >
                        Falar com o suporte
                        <LifeBuoy size={18} className="transition-transform group-hover:rotate-12" />
                    </button>
                </div>
            </main>
        </div>
    );
}
