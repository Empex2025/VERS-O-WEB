import { ChevronLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface PageHeaderProps {
    title: string;
    to?: string;
    right?: React.ReactNode;
}

/** Cabeçalho "< Título" das telas internas (voltar + título). */
export function PageHeader({ title, to, right }: PageHeaderProps) {
    const navigate = useNavigate();
    return (
        <div className="flex items-center gap-2 mb-5">
            <button
                onClick={() => (to ? navigate(to) : navigate(-1))}
                className="text-gray-700 hover:text-[#407BFF] transition-colors"
            >
                <ChevronLeft size={20} />
            </button>
            <h1 className="text-base font-bold text-gray-900 flex-1">{title}</h1>
            {right}
        </div>
    );
}
