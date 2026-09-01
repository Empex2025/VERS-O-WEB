import { ChevronRight } from 'lucide-react';

function Label({ children }: { children: React.ReactNode }) {
    return <label className="text-sm font-bold text-gray-800">{children}</label>;
}

function TextField({ placeholder, suffix }: { placeholder: string; suffix?: string }) {
    return (
        <div className="flex items-center bg-white border border-gray-200 rounded-lg px-3">
            <input placeholder={placeholder} className="w-full py-2.5 text-sm text-gray-700 outline-none placeholder-gray-400 bg-transparent" />
            {suffix && <span className="text-xs text-gray-400 pl-1">{suffix}</span>}
        </div>
    );
}

/** Select estilizado (mock) com chevron à direita. */
function SelectField({ value }: { value: string }) {
    return (
        <button type="button" className="w-full flex items-center justify-between bg-white border border-gray-200 rounded-lg px-3 py-2.5 text-sm text-gray-700 hover:border-[#407BFF] transition-colors">
            {value} <ChevronRight size={16} className="text-gray-400" />
        </button>
    );
}

function QuestionPair({ question, quaisValue, hint }: { question: string; quaisValue: string; hint: string }) {
    return (
        <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-1.5">
                <Label>{question}</Label>
                <SelectField value="Sim" />
            </div>
            <div className="flex flex-col gap-1.5">
                <Label>Quais</Label>
                <SelectField value={quaisValue} />
                <p className="text-[11px] text-gray-400">{hint}</p>
            </div>
        </div>
    );
}

/** Campos compartilhados do prontuário / pré-consulta. */
export function HealthFields({ withSectionTitles = false }: { withSectionTitles?: boolean }) {
    return (
        <div className="flex flex-col gap-5">
            {withSectionTitles && (
                <div>
                    <h3 className="text-sm font-bold text-gray-900">Dados Básicos</h3>
                    <p className="text-xs text-gray-400">Forneça informações básicas sobre você para auxiliar em seus exames.</p>
                </div>
            )}

            <div className="grid grid-cols-2 gap-3">
                <div className="flex flex-col gap-1.5"><Label>Qual sua Altura?</Label><TextField placeholder="Ex. 1.75" /></div>
                <div className="flex flex-col gap-1.5"><Label>Qual seu Peso?</Label><TextField placeholder="Ex. 70" /></div>
            </div>

            <div className="flex flex-col gap-1.5">
                <Label>Qual sua Pressão Arterial média?</Label>
                <div className="grid grid-cols-2 gap-3 items-center">
                    <TextField placeholder="12" />
                    <div className="flex items-center gap-2">
                        <span className="text-gray-400">/</span>
                        <TextField placeholder="08" suffix="mmHg" />
                    </div>
                </div>
            </div>

            {withSectionTitles && (
                <div className="pt-2">
                    <h3 className="text-sm font-bold text-gray-900">Doenças Crônicas</h3>
                    <p className="text-xs text-gray-400">Forneça informações sobre doenças crônicas que você possa possuir, como diabetes, hipertensão, hiv entre outras...</p>
                </div>
            )}
            <QuestionPair question="Você possui alguma doença crônica?" quaisValue="Diabetes" hint="É possível selecionar mais de uma doença." />

            {withSectionTitles && (
                <div className="pt-2">
                    <h3 className="text-sm font-bold text-gray-900">Alergias</h3>
                    <p className="text-xs text-gray-400">Forneça informações sobre alergias que você possa possuir, como alimentar, poeira, pelo de animais entre outras...</p>
                </div>
            )}
            <QuestionPair question="Você possui alguma alergia?" quaisValue="Glúten" hint="É possível selecionar mais de uma alergia." />

            {withSectionTitles && (
                <div className="pt-2">
                    <h3 className="text-sm font-bold text-gray-900">Cirurgias</h3>
                    <p className="text-xs text-gray-400">Forneça informações sobre cirurgias que você já realizou.</p>
                </div>
            )}
            <QuestionPair question="Você já realizou alguma cirurgia?" quaisValue="Esterectomia" hint="É possível selecionar mais de uma cirurgia." />
        </div>
    );
}
