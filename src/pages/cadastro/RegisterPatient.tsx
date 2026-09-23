import { useState } from 'react';
import { ArrowLeft, ArrowRight, User, AtSign, Calendar, IdCard, Mail, Phone, KeyRound, Eye, EyeOff, AlertCircle } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { authService } from '../../services/authService';
import { ApiError } from '../../services/http';
import logoImage from '../../assets/login/logo-login.png';
import illustrationImage from '../../assets/login/cad-cadastro.png';

/** Validação de CPF (dígitos verificadores) — casa com a exigência do backend. */
function isValidCpf(value: string): boolean {
    const cpf = value.replace(/\D/g, '');
    if (cpf.length !== 11 || /^(\d)\1{10}$/.test(cpf)) return false;
    const calc = (len: number) => {
        let sum = 0;
        for (let i = 0; i < len; i++) sum += parseInt(cpf[i]) * (len + 1 - i);
        const d = (sum * 10) % 11;
        return d === 10 ? 0 : d;
    };
    return calc(9) === parseInt(cpf[9]) && calc(10) === parseInt(cpf[10]);
}

/** Idade mínima de 18 anos (o backend rejeita menores). */
function isAdult(dateStr: string): boolean {
    if (!dateStr) return false;
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return false;
    const now = new Date();
    const age = now.getFullYear() - d.getFullYear() - (now < new Date(now.getFullYear(), d.getMonth(), d.getDate()) ? 1 : 0);
    return age >= 18;
}

// 1. Schema de validação dos dados pessoais
const patientSchema = z.object({
    fullName: z.string().min(3, 'Nome precisa ter no mínimo 3 letras'),
    username: z.string().regex(/^[a-z0-9._]{3,30}$/, 'Use 3 a 30: letras minúsculas, números, ponto ou _'),
    cpf: z.string().refine(isValidCpf, 'CPF inválido'),
    birthDate: z.string().refine(isAdult, 'É necessário ter pelo menos 18 anos'),
    email: z.string().email('Email inválido'),
    phone: z.string().min(10, 'Telefone incompleto'),
    password: z.string().min(6, 'A senha deve ter no mínimo 6 caracteres'),
});

type PatientFormInputs = z.infer<typeof patientSchema>;

export function RegisterPatient() {
    const navigate = useNavigate();
    const [showPassword, setShowPassword] = useState(false);
    const [apiError, setApiError] = useState<string | null>(null);
    const [submitting, setSubmitting] = useState(false);
    const {
        register,
        handleSubmit,
        formState: { isValid, errors },
    } = useForm<PatientFormInputs>({
        resolver: zodResolver(patientSchema),
        mode: 'onChange', // Valida a cada tecla digitada para ligar o botão em tempo real
    });

    const onSubmit = async (data: PatientFormInputs) => {
        setApiError(null);
        setSubmitting(true);
        let proceed = false;
        try {
            await authService.register({
                nome: data.fullName,
                username: data.username,
                email: data.email,
                senha_hash: data.password,
                tipo_usuario: 'paciente',
                telefone: data.phone.replace(/\D/g, ''), // só dígitos (coluna do banco é curta)
                cpfcnpj: data.cpf.replace(/\D/g, ''),
                dt_nascimento: data.birthDate, // YYYY-MM-DD (exigido pelo backend p/ paciente)
            });
            proceed = true;
        } catch (err) {
            // Conta já existe: segue para reenviar o link de ativação; outros erros ficam visíveis.
            if (err instanceof ApiError && /cadastrad|já|already|exists/i.test(err.message)) {
                proceed = true;
            } else if (err instanceof ApiError) {
                setApiError(err.message);
            } else {
                setApiError('Não foi possível conectar ao servidor. Tente novamente em instantes.');
            }
        }
        if (!proceed) {
            setSubmitting(false);
            return;
        }
        // Backend criou a conta no Firebase (emailVerified=false); dispara o link de ativação.
        try {
            await authService.sendActivationEmail(data.email, data.password);
        } catch {
            // Firebase indisponível/senha divergente: dá pra reenviar na próxima tela
        }
        setSubmitting(false);
        navigate('/cadastro/verificar-email', { state: { email: data.email, password: data.password } });
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

                        {/* Nome de usuário */}
                        <div className="flex flex-col gap-2">
                            <label className="text-sm font-bold text-gray-800">Nome de usuário</label>
                            <div className="relative flex items-center bg-[#F3F4F6] rounded-xl overflow-hidden border border-transparent focus-within:border-[#407BFF] focus-within:ring-2 focus-within:ring-[#407BFF]/20 transition-all">
                                <div className="absolute left-4 text-gray-400">
                                    <AtSign size={18} />
                                </div>
                                <input
                                    {...register('username')}
                                    type="text"
                                    autoCapitalize="none"
                                    placeholder="carlos.magno"
                                    className="w-full bg-transparent border-none py-3.5 pl-12 pr-4 text-sm text-gray-700 outline-none placeholder-gray-400"
                                />
                            </div>
                            {errors.username && <p className="text-xs text-rose-500 flex items-center gap-1"><AlertCircle size={12} /> {errors.username.message}</p>}
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
                                    inputMode="numeric"
                                    placeholder="000.000.000-00"
                                    className="w-full bg-transparent border-none py-3.5 pl-12 pr-4 text-sm text-gray-700 outline-none placeholder-gray-400"
                                />
                            </div>
                            {errors.cpf
                                ? <p className="text-xs text-rose-500 flex items-center gap-1"><AlertCircle size={12} /> {errors.cpf.message}</p>
                                : <a href="#" className="text-xs text-gray-400 underline hover:text-gray-600 self-start mt-1">Por que pedimos seu CPF?</a>}
                        </div>

                        {/* Data de Nascimento */}
                        <div className="flex flex-col gap-2">
                            <label className="text-sm font-bold text-gray-800">Data de Nascimento</label>
                            <div className="relative flex items-center bg-[#F3F4F6] rounded-xl overflow-hidden border border-transparent focus-within:border-[#407BFF] focus-within:ring-2 focus-within:ring-[#407BFF]/20 transition-all">
                                <div className="absolute left-4 text-gray-400">
                                    <Calendar size={18} />
                                </div>
                                <input
                                    {...register('birthDate')}
                                    type="date"
                                    className="w-full bg-transparent border-none py-3.5 pl-12 pr-4 text-sm text-gray-700 outline-none placeholder-gray-400"
                                />
                            </div>
                            {errors.birthDate && <p className="text-xs text-rose-500 flex items-center gap-1"><AlertCircle size={12} /> {errors.birthDate.message}</p>}
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

                            {apiError && (
                                <div className="flex items-center gap-2 text-rose-500 text-sm font-semibold">
                                    <AlertCircle size={15} /> {apiError}
                                </div>
                            )}

                            <button
                                type="submit"
                                disabled={!isValid || submitting}
                                className={`w-full flex items-center justify-center gap-2 font-bold py-4 rounded-full transition-all group ${isValid && !submitting
                                    ? 'bg-[#407BFF] hover:bg-blue-600 active:bg-blue-700 text-white shadow-lg shadow-blue-500/20 cursor-pointer'
                                    : 'bg-[#E5E7EB] text-gray-400 cursor-not-allowed'
                                    }`}
                            >
                                {submitting ? 'Enviando…' : 'Continuar'}
                                <ArrowRight size={18} className={`transition-transform ${isValid && !submitting ? 'opacity-100 group-hover:translate-x-1' : 'opacity-70'}`} />
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
