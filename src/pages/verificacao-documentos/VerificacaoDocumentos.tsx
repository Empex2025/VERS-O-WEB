import { useState } from 'react';
import { Check, Upload, FileText, Briefcase, FilePlus2, QrCode, CheckCircle2, FolderKanban } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { AppShell } from '../../components/layout/AppShell';
import { PageHeader } from '../../components/layout/PageHeader';

type Step = 1 | 2 | 3 | 4 | 'analise';

export function VerificacaoDocumentos() {
    const navigate = useNavigate();
    const [step, setStep] = useState<Step>(1);
    const done = step === 'analise';
    const s = done ? 5 : step;

    const avancar = () => setStep((p) => (p === 4 ? 'analise' : ((p as number) + 1) as Step));

    return (
        <AppShell rightRail={null}>
            <div className="max-w-5xl mx-auto flex flex-col min-h-[calc(100vh-8rem)]">
                <PageHeader title="Verificação de documentos" to="/inicio" />

                {/* Stepper */}
                <div className="flex items-center mb-8 px-2">
                    {[1, 2, 3, 4].map((n, i) => {
                        const stepDone = done || n < s;
                        const active = n === s;
                        return (
                            <div key={n} className={i < 3 ? 'flex items-center flex-1' : 'flex items-center'}>
                                <span className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold shrink-0 ${stepDone ? 'bg-[#01AEA4] text-white' : active ? 'bg-[#407BFF] text-white' : 'bg-gray-200 text-gray-400'}`}>
                                    {stepDone ? <Check size={18} /> : n}
                                </span>
                                {i < 3 && <span className={`flex-1 h-0.5 mx-2 ${done || n + 1 < s ? 'bg-[#01AEA4]' : n + 1 === s ? 'bg-[#407BFF]' : 'bg-gray-200'}`} />}
                            </div>
                        );
                    })}
                </div>

                <div className="flex-1">
                    {step === 1 && (
                        <>
                            <Titulo t="Primeiro, vamos confirmar sua identidade." l1="Precisamos da frente e verso de um documento oficial com foto para validar quem você é de verdade!" l2="Isso protege sua conta e garante segurança a todos na plataforma." />
                            <div className="grid sm:grid-cols-2 gap-4">
                                <Dropzone icon={<Briefcase size={20} className="text-[#407BFF]" />} titulo="Frente do Documento" />
                                <Dropzone icon={<Briefcase size={20} className="text-[#407BFF]" />} titulo="Verso do Documento" />
                            </div>
                        </>
                    )}
                    {step === 2 && (
                        <>
                            <Titulo t="Agora, valide seu registro profissional." l1="Precisamos do seu registro profissional para confirmar que você está apto a atuar na plataforma!" l2="Isso garante segurança aos pacientes e validade jurídica aos documentos que você emitir." />
                            <Dropzone icon={<FileText size={20} className="text-[#407BFF]" />} titulo="Registro Profissional" />
                        </>
                    )}
                    {step === 3 && (
                        <>
                            <Titulo t="Quase lá. Valide seu documento de especialidade." l1="Precisamos do seu registro profissional para confirmar que você está apto a atuar na plataforma!" l2="Isso garante segurança aos pacientes e validade jurídica aos documentos que você emitir." />
                            <Dropzone icon={<FilePlus2 size={20} className="text-[#407BFF]" />} titulo="Registro de Qualificação de Especialista" />
                        </>
                    )}
                    {step === 4 && (
                        <>
                            <Titulo t="Vamos tirar uma selfie?" l1="Último passo! Vamos comparar sua selfie com a foto do documento." l2="Fique tranquilo(a): usamos tecnologia de reconhecimento facial que apaga a imagem após a validação." />
                            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 sm:p-6">
                                <div className="flex flex-col sm:flex-row items-start justify-between gap-6">
                                    <div className="flex-1">
                                        <div className="flex items-center gap-3 mb-3">
                                            <span className="w-11 h-11 rounded-xl bg-[#407BFF]/10 flex items-center justify-center"><FilePlus2 size={20} className="text-[#407BFF]" /></span>
                                            <div className="flex items-center gap-2">
                                                <span className="text-base font-bold text-gray-900">Continue pelo celular</span>
                                                <span className="text-[11px] font-bold text-[#01AEA4] bg-[#01AEA4]/10 px-2 py-0.5 rounded-full">Recomendado</span>
                                            </div>
                                        </div>
                                        <p className="text-sm text-gray-500 mb-4">Escaneie o QR Code com a câmera do seu celular para tirar sua selfie.</p>
                                        <ul className="flex flex-col gap-2">
                                            {['Mais rápido e seguro', 'Melhor qualidade da foto', 'Compatível com seu dispositivo'].map((t) => (
                                                <li key={t} className="flex items-center gap-2 text-sm text-gray-600"><CheckCircle2 size={16} className="text-[#01AEA4]" /> {t}</li>
                                            ))}
                                        </ul>
                                    </div>
                                    <span className="w-40 h-40 rounded-xl bg-gray-50 border border-gray-100 flex items-center justify-center shrink-0"><QrCode size={120} className="text-gray-800" /></span>
                                </div>
                                <div className="mt-5 bg-[#01AEA4]/5 rounded-xl px-4 py-3 text-center">
                                    <p className="text-sm font-bold text-[#01AEA4]">O processo continuará automaticamente aqui quando você terminar no celular.</p>
                                </div>
                            </div>
                        </>
                    )}
                    {step === 'analise' && (
                        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8 flex flex-col sm:flex-row items-center gap-6">
                            <div className="flex-1">
                                <h2 className="text-2xl font-bold text-gray-900 mb-3">Documentos em Análise</h2>
                                <p className="text-sm text-gray-500 leading-relaxed">Seus documentos foram recebidos e estão em analise. Em até 48 horas você receberá um retorno sobre sua validação.</p>
                                <p className="text-sm text-gray-500 leading-relaxed mt-3">Enquanto isso, pode continuar utilizando nossa plataforma normalmente.</p>
                            </div>
                            <div className="w-56 h-40 rounded-2xl bg-[#407BFF]/5 flex items-center justify-center shrink-0">
                                <FolderKanban size={72} className="text-[#407BFF]" />
                            </div>
                        </div>
                    )}
                </div>

                {/* Rodapé */}
                <div className="flex justify-end border-t border-gray-100 pt-4 mt-4">
                    {step === 'analise' ? (
                        <button onClick={() => navigate('/inicio')} className="bg-[#01AEA4] hover:bg-teal-600 text-white text-sm font-bold px-6 py-2.5 rounded-full transition-colors">Voltar para o Início</button>
                    ) : (
                        <button onClick={avancar} className="bg-[#407BFF] hover:bg-blue-600 text-white text-sm font-bold px-8 py-2.5 rounded-full transition-colors">Próximo</button>
                    )}
                </div>
            </div>
        </AppShell>
    );
}

function Titulo({ t, l1, l2 }: { t: string; l1: string; l2: string }) {
    return (
        <div className="mb-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">{t}</h2>
            <p className="text-sm text-gray-500">{l1}</p>
            <p className="text-sm text-gray-500 mt-1">{l2}</p>
        </div>
    );
}

function Dropzone({ icon, titulo }: { icon: React.ReactNode; titulo: string }) {
    return (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
            <div className="flex items-center gap-3 mb-4">
                <span className="w-11 h-11 rounded-xl bg-[#407BFF]/10 flex items-center justify-center">{icon}</span>
                <div>
                    <p className="text-sm font-bold text-gray-900">{titulo}</p>
                    <p className="text-xs text-gray-400">Clique para adicionar o documento</p>
                </div>
            </div>
            <label className="block border-2 border-dashed border-[#407BFF]/30 rounded-xl py-10 text-center cursor-pointer hover:bg-[#407BFF]/5 transition-colors">
                <span className="w-12 h-12 rounded-full bg-[#407BFF]/10 flex items-center justify-center mx-auto mb-3"><Upload size={20} className="text-[#407BFF]" /></span>
                <p className="text-sm font-bold text-gray-900">Clique para adicionar</p>
                <p className="text-xs text-gray-400">ou arraste o arquivo aqui</p>
                <input type="file" accept="image/*,application/pdf" className="hidden" />
            </label>
            <p className="text-xs text-gray-400 mt-3">Formatos aceitos: JPG, PNG ou PDF</p>
            <p className="text-xs text-gray-400">Tamanho máximo: 10MB</p>
        </div>
    );
}
