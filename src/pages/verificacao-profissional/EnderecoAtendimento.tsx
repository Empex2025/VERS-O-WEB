import { useState } from 'react';
import { Search, MapPin, Plus } from 'lucide-react';
import { VerificacaoShell } from './VerificacaoShell';
import { teleconsultaService } from '../../services/teleconsultaService';
import { useAuthStore } from '../../store/useAuthStore';

const RESULTS = [
    { title: 'R. Feliz', desc: 'Freguesia (Jacarepaguá), Rio de Janeiro - RJ' },
    { title: 'R. das Flores', desc: 'Centro, São Paulo - SP' },
    { title: 'Av. Amazonas', desc: 'Umarizal, Belém - PA' },
    { title: 'R. Aurora', desc: 'Boa Viagem, Recife - PE' },
];

export function EnderecoAtendimento() {
    const [selected, setSelected] = useState<number | null>(null);
    const selfId = useAuthStore((s) => s.user?.id) ?? 0;

    // Submete o endereço selecionado (parseia "Cidade - UF" do desc).
    const submit = async () => {
        if (selected == null || !selfId) return;
        const r = RESULTS[selected];
        const tail = r.desc.split(',').pop()?.trim() ?? '';
        const [cidade = tail, estado = ''] = tail.split(' - ').map((s) => s.trim());
        await teleconsultaService.enderecoAtendimento.create({ profissional_id: selfId, logradouro: r.title, cidade, estado }).catch(() => {});
    };

    return (
        <VerificacaoShell title="Adicionar um Endereço" step={2} backTo="/verificacao/horario" nextTo="/verificacao/modalidade" onNext={submit}>
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
                <div className="relative mb-4">
                    <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                        placeholder="Endereço ou CEP..."
                        className="w-full bg-[#F3F4F6] rounded-xl py-3 pl-11 pr-4 text-sm outline-none focus:ring-2 focus:ring-[#407BFF]/20"
                    />
                </div>

                <div className="flex flex-col divide-y divide-gray-100">
                    {RESULTS.map((r, i) => (
                        <button
                            key={i}
                            onClick={() => setSelected(i)}
                            className={`flex items-center gap-3 py-3 text-left ${selected === i ? 'text-[#407BFF]' : 'text-gray-700'}`}
                        >
                            <MapPin size={18} className={selected === i ? 'text-[#407BFF]' : 'text-gray-400'} />
                            <div className="flex-1">
                                <p className="text-sm font-semibold">{r.title}</p>
                                <p className="text-xs text-gray-400">{r.desc}</p>
                            </div>
                        </button>
                    ))}
                </div>

                <p className="text-xs text-gray-500 mt-4 mb-2">Não achou seu endereço?</p>
                <button className="w-full flex items-center justify-center gap-1 text-[#407BFF] font-bold text-sm py-2.5 border border-dashed border-[#407BFF]/40 rounded-lg hover:bg-[#407BFF]/5">
                    Cadastrar Novo <Plus size={16} />
                </button>
            </div>
        </VerificacaoShell>
    );
}
