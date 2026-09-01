/** Tempo relativo curto em pt-BR (ex.: "Há 2 horas", "Há 3 dias"). */
export function timeAgo(date: string | Date | null | undefined): string {
    if (!date) return '';
    const d = typeof date === 'string' ? new Date(date) : date;
    const diff = Date.now() - d.getTime();
    if (Number.isNaN(diff)) return '';
    const min = Math.floor(diff / 60000);
    if (min < 1) return 'Agora';
    if (min < 60) return `Há ${min} min`;
    const h = Math.floor(min / 60);
    if (h < 24) return `Há ${h} ${h === 1 ? 'hora' : 'horas'}`;
    const days = Math.floor(h / 24);
    if (days < 30) return `Há ${days} ${days === 1 ? 'dia' : 'dias'}`;
    const months = Math.floor(days / 30);
    return `Há ${months} ${months === 1 ? 'mês' : 'meses'}`;
}

/** Formata números grandes (1200 → "1.2K", 32000 → "32K"). */
export function compactNumber(n: number | string | null | undefined): string {
    const num = typeof n === 'string' ? Number(n) : n ?? 0;
    if (!Number.isFinite(num)) return String(n ?? '0');
    if (num < 1000) return String(num);
    if (num < 1_000_000) return `${(num / 1000).toFixed(num % 1000 === 0 ? 0 : 1).replace('.0', '')}K`;
    return `${(num / 1_000_000).toFixed(1).replace('.0', '')}M`;
}
