// Dados mock da área Minha Saúde (consultas e exames). Substituir por API.

export interface Exam {
    id: string;
    date: string;
    status: 'Em Liberação' | 'Liberado';
    detail: string;
    lab: string;
}

export const exams: Exam[] = [
    { id: 'e1', date: 'Exames de 27 de Abril', status: 'Em Liberação', detail: 'Parcialmente Liberado', lab: 'Laboratório Exames TOP' },
    { id: 'e2', date: 'Exames de 21 de Abril', status: 'Liberado', detail: 'Liberado em 22 de Abril de 2025', lab: 'Clínica Mais Saúde' },
];

export interface Appointment {
    id: string;
    professional: string;
    role: string;
    type: string;
    channel: 'Teleconsulta' | 'Presencial';
    date: string;
    time: string;
    price: string;
    status: 'Confirmado' | 'Pendente';
}

export const appointments: Appointment[] = [
    { id: 'a1', professional: 'Dra. Maria Glenda', role: 'Clínico Geral', type: 'Consulta Geral', channel: 'Teleconsulta', date: 'Segunda, 28 de Abril', time: '9:30', price: 'R$ 50,90', status: 'Confirmado' },
    { id: 'a2', professional: 'Clínica Mais Saúde', role: 'Laboratório', type: 'Coleta de Hemograma', channel: 'Presencial', date: 'Terça, 29 de Abril', time: '9:30', price: 'R$ 89,00', status: 'Confirmado' },
    { id: 'a3', professional: 'Dra. Maria Glenda', role: 'Clínico Geral', type: 'Consulta Geral', channel: 'Teleconsulta', date: 'Quinta, 1 de Maio', time: '9:30', price: 'R$ 50,90', status: 'Pendente' },
];

export interface TimeSlot { time: string; available: boolean }

export const timeSlots: TimeSlot[] = [
    { time: '08:00', available: true }, { time: '09:00', available: true }, { time: '09:30', available: false },
    { time: '10:00', available: true }, { time: '10:30', available: true }, { time: '11:00', available: false },
    { time: '15:00', available: true }, { time: '15:30', available: true }, { time: '16:00', available: true },
];

export const professional = {
    name: 'Dra. Maria Glenda',
    handle: '@dra.mariaglenda',
    role: 'Clínico Geral',
    verified: true,
    crm: 'CRM 5410994-RJ',
    bio: 'Clínica geral com 15 anos de experiência formada pela UNIFESP. Média divulgação em matérias baseadas em fontes que passam sob a lei de bem estar.',
    stats: { followers: '2.093', posts: '1.253', ratings: '23 mil' },
    ratingAverage: 4.9,
    services: [
        { label: 'Teleconsulta', desc: 'Atendimento por vídeo chamada', price: 'a partir de R$ 49,90' },
        { label: 'Consulta Presencial', desc: 'Atendimento no consultório', price: 'a partir de R$ 99,90' },
    ],
};
