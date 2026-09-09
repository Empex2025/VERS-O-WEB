import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppShell } from '../../components/layout/AppShell';
import { PageHeader } from '../../components/layout/PageHeader';
import { Avatar } from '../../components/ui/Avatar';

export function ComentarioPaciente() {
    const navigate = useNavigate();
    const [texto, setTexto] = useState('');

    return (
        <AppShell rightRail={null}>
            <div className="max-w-4xl mx-auto flex flex-col min-h-[calc(100vh-8rem)]">
                <PageHeader title="Comentário para o Paciente" to="/area-profissional/atendimento/pos" />

                <div className="flex-1 flex flex-col gap-4">
                    <div className="flex items-center gap-3 bg-white rounded-xl border border-gray-100 px-4 py-3">
                        <Avatar name="Carlos Magno de Souza" size={40} />
                        <div>
                            <p className="text-sm font-bold text-gray-900">Carlos Magno de Souza</p>
                            <p className="text-xs text-gray-400">@carlosmagno</p>
                        </div>
                    </div>

                    <div>
                        <label className="text-sm font-bold text-gray-900">Escreva um comentário para o paciente</label>
                        <textarea
                            value={texto}
                            onChange={(e) => setTexto(e.target.value)}
                            placeholder="Ex.: Recomendo repouso por 2 dias e retorno em caso de febre persistente."
                            className="mt-2 w-full h-48 bg-[#F3F4F6] rounded-xl p-4 text-sm text-gray-800 outline-none resize-none placeholder:text-gray-400"
                        />
                    </div>
                </div>

                <div className="flex justify-end border-t border-gray-100 pt-4 mt-4">
                    <button
                        onClick={() => navigate('/area-profissional/atendimento/pos')}
                        disabled={!texto.trim()}
                        className="text-sm font-bold px-6 py-2.5 rounded-full transition-colors disabled:bg-gray-200 disabled:text-gray-400 bg-[#407BFF] hover:bg-blue-600 text-white"
                    >
                        Salvar Comentário
                    </button>
                </div>
            </div>
        </AppShell>
    );
}
