import { ArrowLeft, ArrowRight } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import logoImage from '../../assets/login/logo-login.png';
import illustrationImage from '../../assets/login/cad-cadastro.png';

export function Register() {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen w-full flex flex-col bg-white overflow-x-hidden font-sans">

            {/* Header Superior Azul */}
            <header className="w-full bg-[#407BFF] h-16 flex items-center px-4 md:px-12 shadow-sm">
                <img src={logoImage} alt="iSaúde" className="h-8 object-contain brightness-0 invert" />
            </header>

            {/* Faixa de Navegação 'Voltar' */}
            <div className="w-full border-b border-gray-100 flex items-center px-4 md:px-12 h-14">
                <Link to="/" className="flex items-center gap-2 text-gray-800 hover:text-blue-600 font-bold text-sm transition-colors group">
                    <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
                    Nova Conta
                </Link>
            </div>

            {/* Conteúdo Principal Dividido */}
            <main className="flex-1 flex flex-col lg:flex-row w-full max-w-7xl mx-auto items-center px-6 lg:px-12">

                {/* Coluna Esquerda: Textos e Botões de Opções */}
                <div className="w-full lg:w-5/12 pt-12 lg:pt-0 flex flex-col justify-center h-full z-10">
                    <h1 className="text-3xl font-extrabold text-gray-900 mb-4 transition-all">
                        Vamos iniciar sua Jornada.
                    </h1>
                    <p className="text-gray-500 text-sm mb-6 leading-relaxed">
                        No iSaúde, conectamos <span className="font-bold text-gray-700">profissionais de saúde, clínicas, farmácias e pacientes</span> em uma rede de cuidado e bem-estar.
                    </p>
                    <p className="text-gray-500 text-sm mb-10 font-medium">
                        Escolha abaixo como você deseja começar sua jornada com a gente:
                    </p>

                    <div className="flex flex-col gap-4 w-full">
                        {/* Opção 1: Paciente */}
                        <button
                            onClick={() => navigate('/cadastro/paciente')}
                            className="flex items-center justify-between w-full bg-[#407BFF] hover:bg-blue-600 active:bg-blue-700 text-white px-6 py-4 rounded-xl shadow-lg shadow-blue-500/20 transition-all font-semibold group"
                        >
                            Quero cuidar da minha Saúde
                            <ArrowRight size={20} className="text-white opacity-80 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                        </button>

                        {/* Opção 2: Profissional */}
                        <button
                            onClick={() => navigate('/cadastro/profissional')}
                            className="flex items-center justify-between w-full bg-[#34D399] hover:bg-[#2CBF8A] active:bg-[#24A676] text-white px-6 py-4 rounded-xl shadow-lg shadow-emerald-500/20 transition-all font-semibold group"
                        >
                            Quero oferecer meus Serviços
                            <ArrowRight size={20} className="text-white opacity-80 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                        </button>
                    </div>
                </div>

                {/* Coluna Direita: Ilustração */}
                <div className="w-full lg:w-7/12 flex justify-center lg:justify-end items-center mt-12 lg:mt-0 pointer-events-none">
                    <img
                        src={illustrationImage}
                        alt="Pessoas conectadas incluindo profissionais e pacientes"
                        className="w-[90%] md:w-[80%] lg:w-full max-w-2xl object-contain drop-shadow-sm"
                    />
                </div>

            </main>

        </div>
    );
}
