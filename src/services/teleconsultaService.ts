import { api } from './http';
import { makeCrud, qs } from './crud';

const T = '/api/teleconsulta';

/** Serviço de teleconsulta: agendamentos, exames, documentos, profissionais (`/api/teleconsulta`). */
export const teleconsultaService = {
    agendamentos: {
        ...makeCrud(T, 'agendamento-consulta'),
        aggregates: <R = unknown>() => api<R>(`${T}/agendamento-consulta/aggregates`),
        callRoom: <R = unknown>(id: number | string) => api<R>(`${T}/agendamento-consulta/${id}/call-room`),
        cancelar: (id: number | string, body?: unknown) => api(`${T}/agendamento-consulta/${id}/cancelar`, { method: 'POST', body: body ?? {} }),
        reagendar: (id: number | string, body: unknown) => api(`${T}/agendamento-consulta/${id}/reagendar`, { method: 'POST', body }),
        concluir: (id: number | string, body?: unknown) => api(`${T}/agendamento-consulta/${id}/concluir`, { method: 'POST', body: body ?? {} }),
        noShow: (id: number | string) => api(`${T}/agendamento-consulta/${id}/no-show`, { method: 'POST', body: {} }),
    },
    exames: makeCrud(T, 'exam-agendamento'),
    documentos: makeCrud(T, 'document'),
    avaliacoes: makeCrud(T, 'avaliacao'),
    profissionais: makeCrud(T, 'profissionais'),
    servicos: makeCrud(T, 'profissional-servico'),
    precos: makeCrud(T, 'preco-profissional'),
    disponibilidade: makeCrud(T, 'disponibilidade-horario'),
    enderecoAtendimento: makeCrud(T, 'endereco-atendimento'),
    clinics: makeCrud(T, 'clinic'),
    clinicExams: makeCrud(T, 'clinic-exam'),
    conexoes: makeCrud(T, 'conexao-profissional-clinica'),

    // Pagamentos de consulta / exame
    consultaPayment: {
        ...makeCrud(T, 'consulta-payment'),
        refundEligibility: (id: number | string) => api(`${T}/consulta-payment/${id}/refund-eligibility`),
        refund: (id: number | string) => api(`${T}/consulta-payment/${id}/refund`, { method: 'POST', body: {} }),
    },
    examPayment: makeCrud(T, 'exam-payment'),

    // Chave Pix (recebimento do profissional)
    chavePix: {
        list: <R = unknown>(query?: Record<string, unknown>) => api<R>(`${T}/chave-pix${qs(query)}`),
        create: (body: unknown) => api(`${T}/chave-pix/create`, { method: 'POST', body }),
        update: (id: number | string, body: unknown) => api(`${T}/chave-pix/${id}`, { method: 'PUT', body }),
        remove: (id: number | string) => api(`${T}/chave-pix/${id}`, { method: 'DELETE' }),
    },

    // Carteira / planos
    carteira: {
        get: <R = unknown>() => api<R>(`${T}/carteira`),
        saque: (body: unknown) => api(`${T}/carteira/saque`, { method: 'POST', body }),
    },
    planos: {
        catalogo: <R = unknown>() => api<R>(`${T}/planos/catalogo`),
        ativo: <R = unknown>() => api<R>(`${T}/planos/ativo`),
        assinar: (body: unknown) => api(`${T}/planos/assinar`, { method: 'POST', body }),
    },
};
