import { Share2, Download, CalendarPlus } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import { AppShell } from '../../components/layout/AppShell';
import { PageHeader } from '../../components/layout/PageHeader';
import logoImage from '../../assets/login/logo-login.png';

const CONFIG: Record<string, { header: string; titulo: string }> = {
    atestado: { header: 'Atestado Médico', titulo: 'Atestado Médico' },
    exames: { header: 'Solicitação de Exames', titulo: 'Solicitação de Exames' },
    prescricao: { header: 'Prescrição Médica', titulo: 'Prescrição Médica' },
};

export function DocumentoView() {
    const navigate = useNavigate();
    const { tipo = 'atestado' } = useParams();
    const cfg = CONFIG[tipo] ?? CONFIG.atestado;

    return (
        <AppShell rightRail={null}>
            <div className="max-w-2xl mx-auto">
                <PageHeader
                    title={cfg.header}
                    to="/minha-saude/documentos"
                    right={
                        <div className="flex items-center gap-2">
                            {tipo === 'exames' && (
                                <button onClick={() => navigate('/minha-saude/agendamentos')} className="flex items-center gap-1.5 bg-[#407BFF] text-white text-xs font-bold px-3 py-1.5 rounded-full hover:bg-blue-600 transition-colors">
                                    <CalendarPlus size={14} /> Agendar Exames
                                </button>
                            )}
                            <button className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 hover:text-[#407BFF]"><Share2 size={15} /></button>
                            <button className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 hover:text-[#407BFF]"><Download size={15} /></button>
                        </div>
                    }
                />

                {/* Documento */}
                <div className="relative bg-white rounded-2xl border border-gray-100 shadow-sm p-6 sm:p-10 overflow-hidden">
                    {/* Cantos decorativos */}
                    <div className="absolute top-0 right-0 w-16 h-16 bg-[#407BFF] rounded-bl-[2.5rem]" />
                    <div className="absolute bottom-0 left-0 w-16 h-16 bg-[#407BFF] rounded-tr-[2.5rem]" />

                    <img src={logoImage} alt="i-saúde" className="h-9 object-contain relative" />

                    {/* Dados do paciente */}
                    <div className="grid grid-cols-4 gap-2 mt-8 bg-[#F9FAFB] rounded-xl p-4">
                        <Field label="Paciente" value="Nome do Paciente" />
                        <Field label="CPF" value="000.000.000-00" />
                        <Field label="Nascimento" value="00/00/0000" />
                        <Field label="Sexo" value="Masculino" />
                    </div>

                    <h2 className="text-center text-lg font-bold text-gray-900 my-8">{cfg.titulo}</h2>

                    {/* Corpo */}
                    <div className="text-sm text-gray-600 leading-relaxed space-y-5">
                        <p>
                            Eu, <span className="font-bold text-gray-800">Dr. Nome do Profissional</span>, CRM 123456-AL, atesto para os devidos fins que o paciente <span className="font-bold text-gray-800">Nome do Paciente</span>, foi atendido e diagnosticado em <span className="font-bold text-gray-800">30/05/2025</span>{tipo === 'atestado' ? ' e necessita de afastamento de suas atividades por ' : ' conforme especificado no '}
                            {tipo === 'atestado' && <span className="font-bold text-gray-800">3 (três) dias</span>}
                            {tipo === 'atestado' ? ' pelo motivo especificado no CID-10 abaixo:' : 'CID-10 abaixo:'}
                        </p>
                        <p>CID-10: <span className="font-bold text-gray-800">R53</span></p>
                        {tipo === 'atestado' && (
                            <p className="text-xs text-gray-500">
                                O presente atestado é válido para finalidades previstas no art. 143 1º do Decreto 27/2 de 05/03/1997 e Resolução CFM 1190/84 e será expedido para justificar o Afastamento do Trabalho de 1 a 15 dias.
                            </p>
                        )}
                    </div>

                    {/* Assinatura + QR */}
                    <div className="flex items-end justify-between mt-16 relative">
                        <div className="text-center">
                            <div className="w-44 border-b border-gray-400 mb-2" />
                            <p className="text-sm font-bold text-gray-800">Nome do Profissional</p>
                            <p className="text-[10px] text-gray-400">CRM: 000000-AL</p>
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
