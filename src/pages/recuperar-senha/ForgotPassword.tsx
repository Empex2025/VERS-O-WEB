import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { ChevronLeft, ArrowRight, AlertCircle } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { authService } from '../../services/authService';
import { ApiError } from '../../services/http';
import logoImage from '../../assets/login/logo-login.png';

// Valida se o campo é um e-mail OU um telefone (mínimo de dígitos)
const forgotPasswordSchema = z.object({
    contact: z
        .string()
        .min(1, 'Informe seu e-mail ou telefone')
        .refine((value) => {
            const isEmail = z.string().email().safeParse(value.trim()).success;
            const digits = value.replace(/\D/g, '');
            const isPhone = digits.length >= 10;
            return isEmail || isPhone;
        }, 'Digite um e-mail ou telefone válido'),
});

type ForgotPasswordInputs = z.infer<typeof forgotPasswordSchema>;

export function ForgotPassword() {
    const navigate = useNavigate();

    const {
        register,
        handleSubmit,
        watch,
        formState: { errors, isSubmitting, isValid },
    } = useForm<ForgotPasswordInputs>({
        resolver: zodResolver(forgotPasswordSchema),
        mode: 'onChange',
    });

    const [notRegistered, setNotRegistered] = useState(false);

    const contactValue = watch('contact');
    const canSubmit = isValid && !!contactValue?.trim();

    // Limpa o erro de "não cadastrado" ao editar o campo
    useEffect(() => {
        setNotRegistered(false);
    }, [contactValue]);

    const onSubmit = async (data: ForgotPasswordInputs) => {
        const email = data.contact.trim();
        try {
            await authService.sendResetCode(email);
            navigate('/recuperar-senha/codigo', { state: { contact: email } });
        } catch (err) {
            if (err instanceof ApiError) {
                setNotRegistered(true); // e-mail não cadastrado / inválido
            } else {
                // API indisponível: segue o fluxo em modo demo
                navigate('/recuperar-senha/codigo', { state: { contact: email } });
            }
        }
    };

    const hasError = !!errors.contact || notRegistered;

    return (
        <div className="min-h-screen w-full flex flex-col bg-white overflow-x-hidden font-sans">
            {/* Header Superior Azul */}
            <header className="w-full bg-[#407BFF] h-16 flex items-center px-4 md:px-12 shadow-sm">
                <img src={logoImage} alt="iSaúde" className="h-8 object-contain brightness-0 invert" />
            </header>

            {/* Faixa de Navegação 'Voltar' */}
            <div className="w-full border-b border-gray-100 flex items-center px-4 md:px-12 h-14">
                <Link
                    to="/"
                    className="flex items-center gap-1 text-gray-800 hover:text-blue-600 font-bold text-sm transition-colors group"
                >
                    <ChevronLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
                    Recuperação de Senha
                </Link>
            </div>

            {/* Conteúdo Principal Centralizado */}
            <main className="flex-1 flex items-start justify-center px-6 pt-16 md:pt-24">
                <div className="w-full max-w-md flex flex-col">
                    <h1 className="text-2xl font-bold text-gray-900 mb-3">Esqueceu sua Senha?</h1>
                    <p className="text-gray-500 text-sm mb-8 leading-relaxed">
                        Digite o telefone que você usou para criar sua conta no iSaúde.
                        Vamos te enviar um link para redefinir a senha.
                    </p>

                    <form className="w-full flex flex-col gap-6" onSubmit={handleSubmit(onSubmit)}>
                        {/* Campo Email ou Telefone */}
                        <div className="flex flex-col gap-2">
                            <label htmlFor="contact" className="text-sm font-bold text-gray-800">
                                Email ou Telefone
                            </label>
                            <div
                                className={`relative flex items-center bg-[#F3F4F6] rounded-xl border transition-all focus-within:bg-white focus-within:ring-2 ${
                                    hasError
                                        ? 'border-red-400 bg-red-50 focus-within:border-red-500 focus-within:ring-red-200'
                                        : 'border-transparent focus-within:border-[#407BFF] focus-within:ring-[#407BFF]/20'
                                }`}
                            >
                                <input
                                    id="contact"
                                    type="text"
                                    autoComplete="username"
                                    aria-invalid={hasError}
                                    placeholder="Digite e-mail ou telefone"
                                    {...register('contact')}
                                    className={`w-full bg-transparent border-none py-3.5 pl-4 pr-11 text-sm outline-none placeholder-gray-400 ${
                                        hasError ? 'text-red-600' : 'text-gray-700'
                                    }`}
                                />
                                {hasError && (
                                    <AlertCircle size={18} className="absolute right-4 text-red-500" />
                                )}
                            </div>
                            {errors.contact ? (
                                <span className="flex items-center gap-1.5 text-xs text-red-500">
                                    <AlertCircle size={13} />
                                    {errors.contact.message}
                                </span>
                            ) : notRegistered ? (
                                <span className="flex items-center gap-1.5 text-xs text-red-500">
                                    <AlertCircle size={13} />
                                    Opss.. Esse email não está cadastrado em nossa plataforma!
                                </span>
                            ) : null}
                        </div>

                        {/* Botão Continuar */}
                        <button
                            type="submit"
                            disabled={!canSubmit || isSubmitting}
                            className={`w-full flex items-center justify-center gap-2 font-bold py-4 rounded-full transition-all group ${
                                canSubmit && !isSubmitting
                                    ? 'bg-[#407BFF] hover:bg-blue-600 active:bg-blue-700 text-white shadow-lg shadow-blue-500/20 cursor-pointer'
                                    : 'bg-[#E5E7EB] text-gray-400 cursor-not-allowed'
                            }`}
                        >
                            {isSubmitting ? 'Enviando...' : 'Continuar'}
                            <ArrowRight
                                size={18}
                                className={`transition-transform ${
                                    canSubmit && !isSubmitting ? 'opacity-100 group-hover:translate-x-1' : 'opacity-70'
                                }`}
                            />
                        </button>

                        {/* Link sem acesso */}
                        <Link
                            to="/recuperar-senha/sem-acesso"
                            className="text-[#407BFF] text-sm font-semibold text-center hover:text-blue-700 hover:underline transition-colors"
                        >
                            Não tenho acesso ao E-mail ou Telefone
                        </Link>
                    </form>
                </div>
            </main>
        </div>
    );
}
