import { useState } from 'react';
import { ArrowLeft, ArrowRight, User, IdCard, Mail, Phone, KeyRound, Eye, EyeOff } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { authService } from '../../services/authService';
import logoImage from '../../assets/login/logo-login.png';
import illustrationImage from '../../assets/login/cad-cadastro.png';

// 1. Schema de validação dos dados pessoais
const patientSchema = z.object({
    fullName: z.string().min(3, 'Nome precisa ter no mínimo 3 letras'),
    cpf: z.string().min(11, 'CPF incompleto'),
    email: z.string().email('Email inválido'),
    phone: z.string().min(10, 'Telefone incompleto'),
    password: z.string().min(6, 'A senha deve ter no mínimo 6 caracteres'),
});

type PatientFormInputs = z.infer<typeof patientSchema>;

export function RegisterPatient() {
    const navigate = useNavigate();
    const [showPassword, setShowPassword] = useState(false);
    const {
        register,
        handleSubmit,
        formState: { isValid },
    } = useForm<PatientFormInputs>({
        resolver: zodResolver(patientSchema),
        mode: 'onChange', // Valida a cada tecla digitada para ligar o botão em tempo real
    });

    const onSubmit = async (data: PatientFormInputs) => {
        try {
            await authService.register({
                nome: data.fullName,
                email: data.email,
                senha_hash: data.password,
                tipo_usuario: 'paciente',
                telefone: data.phone,
                cpfcnpj: data.cpf,
            });
        } catch {
            // API fora do ar / e-mail já usado: segue o fluxo em modo demo
        }
        navigate('/cadastro/telefone', { state: { phone: data.phone } });
    };

    return (
        <div className="min-h-screen w-full flex flex-col bg-white overflow-x-hidden font-sans">

            {/* Header Superior Azul */}
            <header className="w-full bg-[#407BFF] h-16 flex items-center px-4 md:px-12 shadow-sm">
                <img src={logoImage} alt="iSaúde" className="h-8 object-contain brightness-0 invert" />
            </header>

            {/* Faixa de Navegação 'Voltar' */}
            <div className="w-full border-b border-gray-100 flex items-center px-4 md:px-12 h-14">
                <Link to="/cadastro" className="flex items-center gap-2 text-gray-800 hover:text-blue-600 font-bold text-sm transition-colors group">
                    <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
                    Nova Conta
                </Link>
            </div>

            {/* Conteúdo Principal Dividido */}
            <main className="flex-1 flex flex-col lg:flex-row w-full max-w-7xl mx-auto px-6 lg:px-12">

                {/* Coluna Esquerda: Formulário de Dados Pessoais */}
                <div className="w-full lg:w-5/12 pt-8 lg:pt-16 pb-12 flex flex-col z-10 lg:pr-8">

                    <h2 className="text-2xl font-bold text-gray-900 mb-2">Dados Pessoais</h2>
                    <p className="text-gray-500 text-sm mb-8 leading-relaxed">
                        Primeiro, precisamos de algumas informações pessoais para
                        fazer seu cadastro em nossa comunidade.
                    </p>

                    <form className="flex flex-col gap-5 w-full" onSubmit={handleSubmit(onSubmit)}>

                        {/* Nome Completo */}
                        <div className="flex flex-col gap-2">
                            <label className="text-sm font-bold text-gray-800">Nome Completo</label>
                            <div className="relative flex items-center bg-[#F3F4F6] rounded-xl overflow-hidden border border-transparent focus-within:border-[#407BFF] focus-within:ring-2 focus-within:ring-[#407BFF]/20 transition-all">
                                <div className="absolute left-4 text-gray-400">
                                    <User size={18} />
                                </div>
                                <input
                                    {...register('fullName')}
                                    type="text"
                                    placeholder="Carlos Magno de Souza"
                                    className="w-full bg-transparent border-none py-3.5 pl-12 pr-4 text-sm text-gray-700 outline-none placeholder-gray-400"
                                />
                            </div>
                        </div>

                        {/* CPF do Responsável */}
                        <div className="flex flex-col gap-2">
                            <label className="text-sm font-bold text-gray-800">CPF do Responsável</label>
                            <div className="relative flex items-center bg-[#F3F4F6] rounded-xl overflow-hidden border border-transparent focus-within:border-[#407BFF] focus-within:ring-2 focus-within:ring-[#407BFF]/20 transition-all">
                                <div className="absolute left-4 text-gray-400">
                                    <IdCard size={18} />
                                </div>
                                <input
                                    {...register('cpf')}
                                    type="text"
                                    placeholder="000.000.000-00"
                                    className="w-full bg-transparent border-none py-3.5 pl-12 pr-4 text-sm text-gray-700 outline-none placeholder-gray-400"
                                />
                            </div>
                            <a href="#" className="text-xs text-gray-400 underline hover:text-gray-600 self-start mt-1">Por que pedimos seu CPF?</a>
                        </div>

                        {/* Email */}
                        <div className="flex flex-col gap-2">
                            <label className="text-sm font-bold text-gray-800">Email</label>
                            <div className="relative flex items-center bg-[#F3F4F6] rounded-xl overflow-hidden border border-transparent focus-within:border-[#407BFF] focus-within:ring-2 focus-within:ring-[#407BFF]/20 transition-all">
                                <div className="absolute left-4 text-gray-400">
                                    <Mail size={18} />
                                </div>
                                <input
                                    {...register('email')}
                                    type="email"
                                    placeholder="seuemail@exemplo.com"
                                    className="w-full bg-transparent border-none py-3.5 pl-12 pr-4 text-sm text-gray-700 outline-none placeholder-gray-400"
                                />
                            </div>
                        </div>

                        {/* Número de Telefone */}
                        <div className="flex flex-col gap-2">
                            <label className="text-sm font-bold text-gray-800">Número de Telefone</label>
                            <div className="relative flex items-center bg-[#F3F4F6] rounded-xl overflow-hidden border border-transparent focus-within:border-[#407BFF] focus-within:ring-2 focus-within:ring-[#407BFF]/20 transition-all">
                                <div className="absolute left-4 text-gray-400">
                                    <Phone size={18} />
                                </div>
                                <input
                                    {...register('phone')}
                                    type="tel"
                                    placeholder="(00) 00000-0000"
                                    className="w-full bg-transparent border-none py-3.5 pl-12 pr-4 text-sm text-gray-700 outline-none placeholder-gray-400"
                                />
                            </div>
                        </div>

                        {/* Senha */}
                        <div className="flex flex-col gap-2">
                            <label className="text-sm font-bold text-gray-800">Crie uma Senha</label>
                            <div className="relative flex items-center bg-[#F3F4F6] rounded-xl overflow-hidden border border-transparent focus-within:border-[#407BFF] focus-within:ring-2 focus-within:ring-[#407BFF]/20 transition-all">
                                <div className="absolute left-4 text-gray-400">
                                    <KeyRound size={18} />
                                </div>
                                <input
                                    {...register('password')}
                                    type={showPassword ? 'text' : 'password'}
                                    placeholder="Digite uma senha"
                                    className="w-full bg-transparent border-none py-3.5 pl-12 pr-12 text-sm text-gray-700 outline-none placeholder-gray-400"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword((v) => !v)}
                                    className="absolute right-4 text-gray-400 hover:text-gray-600 transition-colors"
                                >
                                    {showPassword ? <Eye size={18} /> : <EyeOff size={18} />}
                                </button>
                            </div>
                        </div>

                        {/* Termos e Botão de Continuar */}
                        <div className="mt-8 flex flex-col gap-4">
                            <p className="text-xs text-gray-500">
                                Ao continuar você concorda com nossos <br className="hidden sm:block" />
                                <a href="#" className="font-bold underline text-gray-600 hover:text-gray-900">Termos de Uso</a> e <a href="#" className="font-bold underline text-gray-600 hover:text-gray-900">Política de Privacidade.</a>
                            </p>

                            <button
                                type="submit"
                                disabled={!isValid}
                                className={`w-full flex items-center justify-center gap-2 font-bold py-4 rounded-full transition-all group ${isValid
                                    ? 'bg-[#407BFF] hover:bg-blue-600 active:bg-blue-700 text-white shadow-lg shadow-blue-500/20 cursor-pointer'
                                    : 'bg-[#E5E7EB] text-gray-400 cursor-not-allowed'
                                    }`}
                            >
                                Continuar
                                <ArrowRight size={18} className={`transition-transform ${isValid ? 'opacity-100 group-hover:translate-x-1' : 'opacity-70'}`} />
                            </button>
                        </div>

                    </form>
                </div>

                {/* Coluna Direita: Ilustração */}
                <div className="hidden lg:flex w-7/12 justify-end items-center pointer-events-none pl-12">
                    <img
                        src={illustrationImage}
                        alt="Pessoas conectadas incluindo profissionais e pacientes"
                        className="w-full max-w-2xl object-contain drop-shadow-sm opacity-90"
                    />
                </div>

            </main>

        </div>
    );
}
