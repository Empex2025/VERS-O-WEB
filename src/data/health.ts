// Tipos da área Minha Saúde (consultas e exames). Os dados vêm da API (sem mock).

export interface Exam {
    id: string;
    date: string;
    status: 'Em Liberação' | 'Liberado';
    detail: string;
    lab: string;
}

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

export interface TimeSlot { time: string; available: boolean }
