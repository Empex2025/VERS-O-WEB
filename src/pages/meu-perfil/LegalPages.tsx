import { AppShell } from '../../components/layout/AppShell';
import { PageHeader } from '../../components/layout/PageHeader';

interface Section {
    heading: string;
    paragraphs: string[];
}

function LegalPage({ title, updated, intro, sections }: { title: string; updated: string; intro: string; sections: Section[] }) {
    return (
        <AppShell rightRail={null}>
            <div className="max-w-2xl mx-auto">
                <PageHeader title={title} to="/meu-perfil/opcoes" />
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 sm:p-8">
                    <p className="text-xs text-gray-400 mb-4">Última atualização: {updated}</p>
                    <p className="text-sm text-gray-600 leading-relaxed mb-6">{intro}</p>

                    <div className="flex flex-col gap-6">
                        {sections.map((s, i) => (
                            <section key={i}>
                                <h2 className="text-sm font-bold text-gray-900 mb-2">{i + 1}. {s.heading}</h2>
                                {s.paragraphs.map((p, j) => (
                                    <p key={j} className="text-sm text-gray-600 leading-relaxed mb-2">{p}</p>
                                ))}
                            </section>
                        ))}
                    </div>

                    <p className="text-xs text-gray-400 mt-8">© 2025 iSaúde & bem-estar. Todos os direitos reservados.</p>
                </div>
            </div>
        </AppShell>
    );
}

export function PoliticaPrivacidade() {
    return (
        <LegalPage
            title="Política de Privacidade"
            updated="10 de outubro de 2025"
            intro="No iSaúde, sua privacidade é prioridade. Esta política descreve como coletamos, usamos, armazenamos e protegemos suas informações pessoais e de saúde ao utilizar nossa plataforma."
            sections={[
                { heading: 'Informações que coletamos', paragraphs: ['Coletamos dados fornecidos por você no cadastro (nome, CPF, e-mail, telefone), informações de saúde que você opta por registrar, e dados de uso da plataforma.', 'Com o seu consentimento, também podemos coletar localização para conectar você a profissionais e serviços próximos.'] },
                { heading: 'Como usamos seus dados', paragraphs: ['Utilizamos suas informações para viabilizar consultas, exames e o funcionamento da rede social, personalizar seu conteúdo e melhorar nossos serviços.'] },
                { heading: 'Compartilhamento', paragraphs: ['Seus dados de saúde só são compartilhados com profissionais que você autorizar durante um atendimento. Nunca vendemos suas informações pessoais.'] },
                { heading: 'Segurança', paragraphs: ['Adotamos medidas técnicas e organizacionais para proteger seus dados, incluindo criptografia e controle de acesso.'] },
                { heading: 'Seus direitos', paragraphs: ['Você pode acessar, corrigir ou excluir seus dados a qualquer momento nas configurações do perfil, conforme previsto na LGPD.'] },
            ]}
        />
    );
}

export function TermosUso() {
    return (
        <LegalPage
            title="Termos de Uso"
            updated="10 de outubro de 2025"
            intro="Estes Termos de Uso regem o acesso e a utilização da plataforma iSaúde. Ao criar uma conta, você concorda com as condições descritas abaixo."
            sections={[
                { heading: 'Aceitação dos termos', paragraphs: ['Ao utilizar o iSaúde, você declara ter lido e concordado com estes Termos e com a Política de Privacidade.'] },
                { heading: 'Cadastro e conta', paragraphs: ['Você é responsável por manter a confidencialidade dos seus dados de acesso e por todas as atividades realizadas em sua conta.', 'Profissionais de saúde devem manter registros e certificações válidas para oferecer atendimentos.'] },
                { heading: 'Uso da plataforma', paragraphs: ['É proibido publicar conteúdo ilegal, ofensivo ou que viole direitos de terceiros. Reservamo-nos o direito de remover conteúdo e suspender contas que descumpram estas regras.'] },
                { heading: 'Consultas e pagamentos', paragraphs: ['Agendamentos, teleconsultas e pagamentos seguem as condições apresentadas no momento da contratação, incluindo políticas de cancelamento e reembolso.'] },
                { heading: 'Limitação de responsabilidade', paragraphs: ['O iSaúde é uma plataforma de conexão e não substitui o julgamento clínico do profissional de saúde responsável pelo atendimento.'] },
            ]}
        />
    );
}
