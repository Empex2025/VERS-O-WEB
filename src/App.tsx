import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Login } from './pages/login/Login';
import { Home } from './pages/home/Home';
import { Register } from './pages/cadastro/Register';
import { RegisterPatient } from './pages/cadastro/RegisterPatient';
import { RegisterProfessional } from './pages/cadastro/RegisterProfessional';
import { PhoneVerification } from './pages/cadastro/PhoneVerification';
import { ForgotPassword } from './pages/recuperar-senha/ForgotPassword';
import { NoPhoneAccess } from './pages/recuperar-senha/NoPhoneAccess';
import { ForgotPasswordCode } from './pages/recuperar-senha/ForgotPasswordCode';
import { NewPassword } from './pages/recuperar-senha/NewPassword';
import { PasswordSuccess } from './pages/recuperar-senha/PasswordSuccess';
import { Explorar } from './pages/explorar/Explorar';
import { Pulses } from './pages/pulses/Pulses';
import { Notificacoes } from './pages/notificacoes/Notificacoes';
import { Perfil, PerfilPaciente, PerfilPrivado } from './pages/perfil/Perfil';
import { MeuPerfil } from './pages/meu-perfil/MeuPerfil';
import { EditarPerfil } from './pages/meu-perfil/EditarPerfil';
import { OpcoesPerfil } from './pages/meu-perfil/OpcoesPerfil';
import { Salvos } from './pages/meu-perfil/Salvos';
import { PoliticaPrivacidade, TermosUso } from './pages/meu-perfil/LegalPages';
import { CentralAjuda } from './pages/meu-perfil/CentralAjuda';
import { HistoricoConta } from './pages/meu-perfil/HistoricoConta';
import { PerfilProfissional } from './pages/perfil/PerfilProfissional';
import { PainelRecursos } from './pages/area-profissional/PainelRecursos';
import { AgendaAtendimentos } from './pages/area-profissional/AgendaAtendimentos';
import { HorariosAtendimento } from './pages/area-profissional/HorariosAtendimento';
import { PerguntasPreConsulta } from './pages/area-profissional/PerguntasPreConsulta';
import { NovaPergunta } from './pages/area-profissional/NovaPergunta';
import { MeusVinculos } from './pages/area-profissional/MeusVinculos';
import { Financeiro } from './pages/area-profissional/Financeiro';
import { PropostaVinculo } from './pages/area-profissional/PropostaVinculo';
import { ClinicaVinculada } from './pages/area-profissional/ClinicaVinculada';
import { DiasHorariosAtendimento } from './pages/area-profissional/DiasHorariosAtendimento';
import { AtendimentoConcluido } from './pages/area-profissional/AtendimentoConcluido';
import { PosAtendimento } from './pages/area-profissional/PosAtendimento';
import { ResumoAtendimento } from './pages/area-profissional/ResumoAtendimento';
import { ComentarioPaciente } from './pages/area-profissional/ComentarioPaciente';
import { GerarAtestado } from './pages/area-profissional/GerarAtestado';
import { CriarPrescricao } from './pages/area-profissional/CriarPrescricao';
import { SolicitarExames } from './pages/area-profissional/SolicitarExames';
import { TermosVinculacao } from './pages/area-profissional/TermosVinculacao';
import { VinculoConfirmado } from './pages/area-profissional/VinculoConfirmado';
import { AssinarPrescricao, AssinarAtestado } from './pages/area-profissional/AssinarDocumento';
import { VerificacaoDocumentos } from './pages/verificacao-documentos/VerificacaoDocumentos';
import { Pagamento } from './pages/minha-saude/Pagamento';
import { InformacoesProfissionais } from './pages/verificacao-profissional/InformacoesProfissionais';
import { HorarioFuncionamento } from './pages/verificacao-profissional/HorarioFuncionamento';
import { EnderecoAtendimento } from './pages/verificacao-profissional/EnderecoAtendimento';
import { ModalidadeAtendimento } from './pages/verificacao-profissional/ModalidadeAtendimento';
import { ChavePix } from './pages/verificacao-profissional/ChavePix';
import { VerificacaoConcluida } from './pages/verificacao-profissional/VerificacaoConcluida';
import { CriarPost } from './pages/criar-post/CriarPost';
import { Conversas } from './pages/conversas/Conversas';
import { Flashs } from './pages/placeholder/ComingSoon';
import { MinhaSaude } from './pages/minha-saude/MinhaSaude';
import { ResultadosExames } from './pages/minha-saude/ResultadosExames';
import { DocumentoMedico } from './pages/minha-saude/DocumentoMedico';
import { InformacoesSaude } from './pages/minha-saude/InformacoesSaude';
import { MeusAgendamentos } from './pages/minha-saude/MeusAgendamentos';
import { AgendamentoDetalhe } from './pages/minha-saude/AgendamentoDetalhe';
import { ConsultaOnline } from './pages/minha-saude/ConsultaOnline';
import { Reagendar, AgendarRetorno } from './pages/minha-saude/ScheduleIntro';
import { ConfirmacaoAgendamento } from './pages/minha-saude/ConfirmacaoAgendamento';
import { PreConsulta } from './pages/minha-saude/PreConsulta';
import { PosConsulta } from './pages/minha-saude/PosConsulta';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/inicio" element={<Home />} />
        <Route path="/explorar" element={<Explorar />} />
        <Route path="/pulses" element={<Pulses />} />
        <Route path="/notificacoes" element={<Notificacoes />} />
        <Route path="/conversas" element={<Conversas />} />
        <Route path="/criar-post" element={<CriarPost />} />
        <Route path="/meu-perfil" element={<MeuPerfil />} />
        <Route path="/meu-perfil/editar" element={<EditarPerfil />} />
        <Route path="/meu-perfil/opcoes" element={<OpcoesPerfil />} />
        <Route path="/meu-perfil/salvos" element={<Salvos />} />
        <Route path="/meu-perfil/politica" element={<PoliticaPrivacidade />} />
        <Route path="/meu-perfil/termos" element={<TermosUso />} />
        <Route path="/meu-perfil/ajuda" element={<CentralAjuda />} />
        <Route path="/meu-perfil/historico" element={<HistoricoConta />} />
        <Route path="/perfil/:handle" element={<Perfil />} />
        <Route path="/perfil-paciente" element={<PerfilPaciente />} />
        <Route path="/perfil-privado" element={<PerfilPrivado />} />
        <Route path="/perfil-profissional" element={<PerfilProfissional />} />
        <Route path="/perfil-profissional/:id" element={<PerfilProfissional />} />
        <Route path="/area-profissional" element={<PainelRecursos />} />
        <Route path="/area-profissional/agenda" element={<AgendaAtendimentos />} />
        <Route path="/area-profissional/horarios" element={<HorariosAtendimento />} />
        <Route path="/area-profissional/pre-consulta" element={<PerguntasPreConsulta />} />
        <Route path="/area-profissional/pre-consulta/nova" element={<NovaPergunta />} />
        <Route path="/area-profissional/vinculos" element={<MeusVinculos />} />
        <Route path="/area-profissional/financeiro" element={<Financeiro />} />
        <Route path="/area-profissional/vinculos/proposta" element={<PropostaVinculo />} />
        <Route path="/area-profissional/vinculos/clinica" element={<ClinicaVinculada />} />
        <Route path="/area-profissional/vinculos/termos" element={<TermosVinculacao />} />
        <Route path="/area-profissional/vinculos/confirmado" element={<VinculoConfirmado />} />
        <Route path="/area-profissional/dias-horarios" element={<DiasHorariosAtendimento />} />
        <Route path="/area-profissional/atendimento/concluido" element={<AtendimentoConcluido />} />
        <Route path="/area-profissional/atendimento/pos" element={<PosAtendimento />} />
        <Route path="/area-profissional/atendimento/resumo" element={<ResumoAtendimento />} />
        <Route path="/area-profissional/atendimento/comentario" element={<ComentarioPaciente />} />
        <Route path="/area-profissional/atendimento/atestado" element={<GerarAtestado />} />
        <Route path="/area-profissional/atendimento/prescricao" element={<CriarPrescricao />} />
        <Route path="/area-profissional/atendimento/exames" element={<SolicitarExames />} />
        <Route path="/area-profissional/atendimento/prescricao/assinar" element={<AssinarPrescricao />} />
        <Route path="/area-profissional/atendimento/atestado/assinar" element={<AssinarAtestado />} />
        <Route path="/verificacao" element={<InformacoesProfissionais />} />
        <Route path="/verificacao/horario" element={<HorarioFuncionamento />} />
        <Route path="/verificacao/endereco" element={<EnderecoAtendimento />} />
        <Route path="/verificacao/modalidade" element={<ModalidadeAtendimento />} />
        <Route path="/verificacao/pix" element={<ChavePix />} />
        <Route path="/verificacao/concluido" element={<VerificacaoConcluida />} />
        <Route path="/verificacao-documentos" element={<VerificacaoDocumentos />} />
        <Route path="/minha-saude" element={<MinhaSaude />} />
        <Route path="/minha-saude/exames" element={<ResultadosExames />} />
        <Route path="/minha-saude/documento" element={<DocumentoMedico />} />
        <Route path="/minha-saude/informacoes" element={<InformacoesSaude />} />
        <Route path="/minha-saude/agendamentos" element={<MeusAgendamentos />} />
        <Route path="/minha-saude/agendamentos/:id" element={<AgendamentoDetalhe />} />
        <Route path="/minha-saude/consulta" element={<ConsultaOnline />} />
        <Route path="/minha-saude/pos-consulta" element={<PosConsulta />} />
        <Route path="/minha-saude/pre-consulta" element={<PreConsulta />} />
        <Route path="/minha-saude/reagendar" element={<Reagendar />} />
        <Route path="/minha-saude/agendar-retorno" element={<AgendarRetorno />} />
        <Route path="/minha-saude/pagamento" element={<Pagamento />} />
        <Route path="/minha-saude/agendamento-confirmado" element={<ConfirmacaoAgendamento />} />
        <Route path="/flashs" element={<Flashs />} />
        <Route path="/cadastro" element={<Register />} />
        <Route path="/cadastro/paciente" element={<RegisterPatient />} />
        <Route path="/cadastro/profissional" element={<RegisterProfessional />} />
        <Route path="/cadastro/telefone" element={<PhoneVerification />} />
        <Route path="/recuperar-senha" element={<ForgotPassword />} />
        <Route path="/recuperar-senha/sem-acesso" element={<NoPhoneAccess />} />
        <Route path="/recuperar-senha/codigo" element={<ForgotPasswordCode />} />
        <Route path="/recuperar-senha/nova-senha" element={<NewPassword />} />
        <Route path="/recuperar-senha/sucesso" element={<PasswordSuccess />} />
        {/* Qualquer rota desconhecida volta para o login */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
