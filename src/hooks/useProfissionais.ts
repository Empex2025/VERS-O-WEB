import { teleconsultaService } from '../services/teleconsultaService';
import { profileService } from '../services/profileService';
import { useApiData } from './useApiData';

export interface Prof {
    id: number;
    nome: string;
    especialidade: string;
    preco: number;
    modalidades: string[];
    clinica_nome?: string;
    cidade?: string;
    estado?: string;
}

interface RawProf {
    id: number;
    nome?: string;
    especialidade?: string;
    preco?: number;
    modalidades?: string[];
    clinica_nome?: string;
    cidade?: string;
    estado?: string;
}

/** Catálogo real de profissionais (`GET /api/teleconsulta/profissionais`), com nome enriquecido. */
export async function fetchProfissionais(): Promise<Prof[]> {
    const raw = await teleconsultaService.profissionais.list<{ results?: RawProf[] } | RawProf[]>();
    const list = Array.isArray(raw) ? raw : raw?.results ?? [];
    return Promise.all(
        list.map(async (p): Promise<Prof> => {
            let nome = p.nome || '';
            if (!nome || /^Profissional\s*\d*$/i.test(nome)) {
                try {
                    const u = await profileService.getPublicUser<{ nome?: string }>(p.id);
                    if (u?.nome) nome = u.nome;
                } catch { /* mantém o que veio */ }
            }
            return {
                id: p.id,
                nome: nome || `Profissional ${p.id}`,
                especialidade: p.especialidade || 'Clínica Geral',
                preco: Number(p.preco ?? 0),
                modalidades: p.modalidades || ['Teleconsulta', 'Presencial'],
                clinica_nome: p.clinica_nome,
                cidade: p.cidade,
                estado: p.estado,
            };
        }),
    );
}

/** Lista de profissionais do catálogo (dados reais + estado vazio). */
export function useProfissionais() {
    return useApiData<Prof[]>(fetchProfissionais, [], []);
}

export function money(v: number) {
    return `R$ ${v.toFixed(2).replace('.', ',')}`;
}
