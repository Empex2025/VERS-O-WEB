// Tipos da rede social. Os dados agora vêm todos da API (sem mock).

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
    /** Contadores numéricos crus (para incrementar na UI). */
    likesCount?: number;
    commentsCount?: number;
    sharesCount?: number;
    /** Id do autor (para enriquecer/roteirizar). */
    authorId?: number;
}
