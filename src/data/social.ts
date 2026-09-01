// Dados mock da rede social. Substituir por dados reais da API.

export interface Person {
    handle: string;
    name: string;
    role: string;
    verified?: boolean;
}

export interface Post {
    id: string;
    author: Person;
    location?: string;
    time: string;
    text: string;
    hasImage?: boolean;
    likes: string;
    comments: string;
    shares: string;
}

export const currentUser: Person = {
    handle: '@voce',
    name: 'Você',
    role: 'Paciente',
};

export const suggestions: Person[] = [
    { handle: '@dra.mariaglenda', name: 'Dra. Maria Glenda', role: 'Clínico Geral', verified: true },
    { handle: '@dr.marcostoledo', name: 'Dr. Marcos Toledo', role: 'Clínico Geral', verified: true },
    { handle: '@luanapaiva', name: 'Luana Paiva', role: 'Clínico Geral', verified: true },
    { handle: '@isaude', name: 'iSaúde', role: 'Perfil Oficial', verified: true },
    { handle: '@jamilecorrea', name: 'Jamile Correa', role: 'Clínico Geral', verified: true },
];

export const flashPeople: Person[] = [
    { handle: '@dra.mariaglenda', name: 'Dra. Maria Glenda', role: 'Clínico Geral', verified: true },
    { handle: '@dr.marcostoledo', name: 'Dr. Marcos Toledo', role: 'Clínico Geral', verified: true },
    { handle: '@jamilecorrea', name: 'Jamile Correa', role: 'Clínico Geral', verified: true },
    { handle: '@anapaulanutri', name: 'Ana Paula Nutri', role: 'Nutricionista', verified: true },
    { handle: '@dr.walter.alencar', name: 'Dr. Walter Alencar', role: 'Clínico Geral', verified: true },
];

export const feedPosts: Post[] = [
    {
        id: 'p1',
        author: { handle: '@jorgezikenay', name: 'Jorge Zikenay', role: 'Academia FitNarrowy', verified: true },
        location: 'Academia FitNarrowy',
        time: 'Há 3 dias',
        text: 'Demonstração rápida de 3 exercícios para aliviar dor nas costas no home office.',
        hasImage: true,
        likes: '2K',
        comments: '2K Comentários',
        shares: '32K Compartilhamentos',
    },
    {
        id: 'p2',
        author: { handle: '@anapaulanutri', name: 'Ana Paula Nutri', role: 'Nutricionista', verified: true },
        time: 'Há 21 horas',
        text: '5 ALIMENTOS QUE FORTALECEM SUA IMUNIDADE 🍊',
        hasImage: true,
        likes: '1.2K',
        comments: '340 Comentários',
        shares: '5K Compartilhamentos',
    },
    {
        id: 'p3',
        author: { handle: '@dr.walter.alencar', name: 'Dr. Walter Alencar', role: 'Clínico Geral', verified: true },
        time: 'Há 5 dias',
        text: '😴 Você sabia que seu cérebro faz uma "faxina" enquanto você dorme? Sim, é verdade! Durante o sono profundo...',
        hasImage: true,
        likes: '25K',
        comments: '2K Comentários',
        shares: '2K Compartilhamentos',
    },
];
