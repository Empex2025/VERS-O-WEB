import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

// 1. Definição do Schema de Validação
const loginSchema = z.object({
    email: z.string().min(1, 'O email é obrigatório').email('Formato de email inválido'),
    password: z.string().min(6, 'A senha deve ter no mínimo 6 caracteres'),
});

// Inferência do tipo pelo Zod
type LoginFormInputs = z.infer<typeof loginSchema>;

export function LoginForm() {
    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm<LoginFormInputs>({
        resolver: zodResolver(loginSchema),
    });

    const onSubmit = async (data: LoginFormInputs) => {
        // Simula uma chamada na API
        console.log('Dados validados com sucesso:', data);
        await new Promise((resolve) => setTimeout(resolve, 1000));
    };

    return (
        <div className="w-full max-w-md p-8 bg-card rounded-xl shadow-md border border-border">
            <h2 className="text-2xl font-bold text-foreground mb-6 text-center">Fazer Login</h2>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-foreground mb-1">Email</label>
                    <input
                        {...register('email')}
                        className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary outline-none transition-all bg-background text-foreground ${errors.email ? 'border-destructive' : 'border-input'
                            }`}
                        placeholder="seu@email.com"
                    />
                    {errors.email && <span className="text-sm text-destructive mt-1 block">{errors.email.message}</span>}
                </div>

                <div>
                    <label className="block text-sm font-medium text-foreground mb-1">Senha</label>
                    <input
                        {...register('password')}
                        type="password"
                        className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary outline-none transition-all bg-background text-foreground ${errors.password ? 'border-destructive' : 'border-input'
                            }`}
                        placeholder="••••••"
                    />
                    {errors.password && <span className="text-sm text-destructive mt-1 block">{errors.password.message}</span>}
                </div>

                <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold py-2 px-4 rounded-lg transition-colors disabled:opacity-50"
                >
                    {isSubmitting ? 'Entrando...' : 'Entrar'}
                </button>
            </form>
        </div>
    );
}
