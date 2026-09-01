import { useState } from 'react';
import { VerificacaoShell } from './VerificacaoShell';
import { teleconsultaService } from '../../services/teleconsultaService';
import { useAuthStore } from '../../store/useAuthStore';

export function ChavePix() {
    const selfId = useAuthStore((s) => s.user?.id) ?? 0;
    const [chave, setChave] = useState('');
    const tipo = chave.replace(/\D/g, '').length > 11 ? 'cnpj' : 'cpf';

    const submit = async () => {
        if (!chave.trim() || !selfId) return;
        await teleconsultaService.chavePix.create({ tipo_titular: 'medico', id_titular: selfId, chave: chave.trim(), tipo }).catch(() => {});
    };

    return (
        <VerificacaoShell
            title="Adicionar Chave Pix"
            step={4}
            backTo="/verificacao/modalidade"
            nextTo="/verificacao/concluido"
            nextLabel="Iniciar Chave Pix"
            nextDisabled={!chave.trim()}
            onNext={submit}
        >
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
                <p className="text-sm text-gray-500 leading-relaxed mb-4">
                    Adicione sua Chave Pix para receber os valores dos seus atendimentos. Você pode usar o mesmo CPF/CNPJ
                    cadastrado na plataforma ou uma chave já existente.
                </p>
                <label className="text-sm font-bold text-gray-800">CPF ou CNPJ</label>
                <input
                    value={chave}
                    onChange={(e) => setChave(e.target.value)}
                    inputMode="numeric"
                    placeholder="000.000.000-00"
                    className="w-full bg-[#F3F4F6] rounded-xl py-3 px-4 text-sm outline-none focus:ring-2 focus:ring-[#407BFF]/20 mt-1.5"
                />
            </div>
        </VerificacaoShell>
    );
}
