import { Share2, Download } from 'lucide-react';
import { AppShell } from '../../components/layout/AppShell';
import { PageHeader } from '../../components/layout/PageHeader';
import { useAuthStore } from '../../store/useAuthStore';
import logoImage from '../../assets/login/logo-login.png';

const meds = [
    { name: 'Dipirona Sódica 500mg', dose: '1 comprimido a cada 8 horas', obs: 'Tomar preferencialmente em jejum' },
    { name: 'Omeprazol 20mg', dose: '1 comprimido ao dia', obs: 'Utilizar por 1 mês' },
    { name: 'Omeprazol 20mg', dose: '1 comprimido ao dia', obs: 'Tomar preferencialmente em jejum' },
    { name: 'Omeprazol 20mg', dose: '1 comprimido ao dia', obs: 'Utilizar por 1 mês' },
    { name: 'Omeprazol 20mg', dose: '1 comprimido ao dia', obs: 'Tomar preferencialmente em jejum' },
];

export function DocumentoMedico() {
    const user = useAuthStore((s) => s.user) as any;
    return (
        <AppShell>
            <div className="max-w-2xl mx-auto">
                <PageHeader
                    title="Resultados de Exames"
                    to="/minha-saude/exames"
                    right={
                        <div className="flex items-center gap-3 text-gray-600">
                            <button className="hover:text-[#407BFF]"><Share2 size={18} /></button>
                            <button className="hover:text-[#407BFF]"><Download size={18} /></button>
                        </div>
                    }
                />

                {/* Documento */}
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 sm:p-8">
                    {/* Cabeçalho do documento */}
                    <div className="flex items-start justify-between">
                        <img src={logoImage} alt="i-saúde" className="h-8 object-contain" />
                        <p className="text-[10px] text-gray-400">Válido até 00/00/0000</p>
                    </div>

                    {/* Dados do paciente */}
                    <div className="grid grid-cols-4 gap-2 mt-6 pb-4 border-b border-gray-100">
                        <Field label="Paciente" value={user?.nome || 'Nome do Paciente'} />
                        <Field label="CPF" value="000.000.000-00" />
                        <Field label="Nascimento" value="00/00/0000" />
                        <Field label="Sexo" value="Masculino" />
                    </div>

                    <h2 className="text-center text-base font-bold text-gray-900 my-6">Prescrição Médica</h2>

                    {/* Medicações */}
                    <div className="flex flex-col gap-5">
                        {meds.map((m, i) => (
                            <div key={i}>
                                <div className="flex items-baseline gap-2">
                                    <span className="text-sm font-bold text-gray-900 whitespace-nowrap">{m.name}</span>
                                    <span className="flex-1 border-b border-dotted border-gray-300 translate-y-[-3px]" />
                                    <span className="text-xs text-gray-600 whitespace-nowrap">{m.dose}</span>
                                </div>
                                <p className="text-[11px] text-gray-400 mt-1">Observações: {m.obs}</p>
                            </div>
                        ))}
                    </div>

                    {/* Assinatura + QR */}
                    <div className="flex items-end justify-between mt-10 pt-6">
                        <div className="text-center">
                            <div className="w-40 border-b border-gray-400 mb-1" />
                            <p className="text-xs font-bold text-gray-800">Nome do Profissional</p>
                            <p className="text-[10px] text-gray-400">CRM 000000-RJ</p>
                        </div>
                        <div className="w-16 h-16 bg-gray-900 rounded" aria-label="QR code" />
                    </div>
                </div>
            </div>
        </AppShell>
    );
}

function Field({ label, value }: { label: string; value: string }) {
    return (
        <div>
            <p className="text-[10px] text-gray-400">{label}</p>
            <p className="text-xs font-bold text-gray-800 truncate">{value}</p>
        </div>
    );
}
