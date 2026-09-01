import { useState } from 'react';
import { VerificacaoShell } from './VerificacaoShell';
import { teleconsultaService } from '../../services/teleconsultaService';
import { useAuthStore } from '../../store/useAuthStore';

const DAYS = ['Domingo', 'Segunda-Feira', 'Terça-Feira', 'Quarta-Feira', 'Quinta-Feira', 'Sexta-Feira', 'Sábado'];

export function HorarioFuncionamento() {
    // Aberto/fechado por dia (padrão: dias úteis abertos)
    const [open, setOpen] = useState<boolean[]>([false, true, true, true, true, true, false]);
    const selfId = useAuthStore((s) => s.user?.id) ?? 0;

    // Grava a disponibilidade (08:00–18:00) de cada dia aberto.
    const submit = async () => {
        if (!selfId) return;
        await Promise.all(
            open.map((isOpen, i) =>
                isOpen
                    ? teleconsultaService.disponibilidade.create({ profissional_id: selfId, dia_semana: i, hora_inicio: '08:00', hora_fim: '18:00' }).catch(() => {})
                    : Promise.resolve(),
            ),
        );
    };

    return (
        <VerificacaoShell title="Adicionar um Horário de Funcionamento" step={1} backTo="/verificacao" nextTo="/verificacao/endereco" backLabel="Voltar" onNext={submit}>
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
                <label className="flex items-center gap-2 text-sm text-gray-700 mb-5">
                    <input type="checkbox" defaultChecked className="accent-[#407BFF]" />
                    Utilizar em modelo Comercial (segunda a sexta de 08:00 às 18:00).
                </label>

                <h3 className="text-sm font-bold text-gray-900 mb-3">Horário Comercial</h3>
                <div className="flex flex-col divide-y divide-gray-100">
                    {DAYS.map((day, i) => (
                        <div key={day} className="flex items-center justify-between py-3">
                            <span className="text-sm text-gray-700">{day}</span>
                            <button
                                onClick={() => setOpen((prev) => prev.map((v, idx) => (idx === i ? !v : v)))}
                                className="flex items-center gap-2"
                            >
                                <span className="text-xs text-gray-400 w-14 text-right">{open[i] ? 'Aberto' : 'Fechado'}</span>
                                <span className={`w-9 h-5 rounded-full p-0.5 transition-colors ${open[i] ? 'bg-[#407BFF]' : 'bg-gray-300'}`}>
                                    <span className={`block w-4 h-4 rounded-full bg-white transition-transform ${open[i] ? 'translate-x-4' : ''}`} />
                                </span>
                            </button>
                        </div>
                    ))}
                </div>
            </div>
        </VerificacaoShell>
    );
}
