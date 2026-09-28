import { useAuthStore } from '../../store/useAuthStore';

function fmtCpf(v?: string) {
    const d = (v || '').replace(/\D/g, '');
    if (d.length === 11) return d.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
    if (d.length === 14) return d.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, '$1.$2.$3/$4-$5');
    return v || '—';
}
function fmtDate(v?: string) {
    if (!v) return '—';
    const d = new Date(v);
    return isNaN(d.getTime()) ? v : d.toLocaleDateString('pt-BR');
}
function fmtSexo(v?: string) {
    if (!v) return '—';
    const s = String(v).toLowerCase();
    if (s.startsWith('m')) return 'Masculino';
    if (s.startsWith('f')) return 'Feminino';
    return v;
}

/** Dados do paciente logado (nome/CPF/nascimento/sexo) — do perfil real, sem mock. */
export function PacienteInfoGrid() {
    const user = useAuthStore((s) => s.user) as Record<string, string | undefined> | null;
    const fields = [
        { label: 'Paciente', value: user?.nome || '—' },
        { label: 'CPF', value: fmtCpf(user?.cpf || user?.cpfcnpj) },
        { label: 'Nascimento', value: fmtDate(user?.dt_nascimento) },
        { label: 'Sexo', value: fmtSexo(user?.sexo) },
    ];
    return (
        <div className="grid grid-cols-4 gap-2">
            {fields.map((f) => (
                <div key={f.label}>
                    <p className="text-[10px] text-gray-400">{f.label}</p>
                    <p className="text-xs font-bold text-gray-800 truncate">{f.value}</p>
                </div>
            ))}
        </div>
    );
}
