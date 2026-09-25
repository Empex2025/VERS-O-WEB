import { useEffect, useState } from 'react';
import { ChevronLeft, PhoneOff, Loader2 } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { JitsiRoom } from '../../components/video/JitsiRoom';
import { teleconsultaService } from '../../services/teleconsultaService';
import { useAuthStore } from '../../store/useAuthStore';
import logoImage from '../../assets/login/logo-login.png';

/**
 * Sala de teleconsulta (Jitsi). Recebe o id do agendamento via `location.state`
 * e resolve a sala real em `GET /agendamento-consulta/:id/call-room` (só
 * participantes). Sem id (demo), cai numa sala genérica.
 */
export function ConsultaOnline() {
    const navigate = useNavigate();
    const location = useLocation();
    const user = useAuthStore((s) => s.user);
    const agendamentoId: number | undefined = location.state?.agendamentoId;

    const [room, setRoom] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        let alive = true;
        (async () => {
            try {
                if (agendamentoId) {
                    const r = await teleconsultaService.agendamentos.callRoom<{ room: string }>(agendamentoId);
                    if (alive) setRoom(r.room);
                } else {
                    if (alive) setRoom('isaude-consulta-demo');
                }
            } catch {
                if (alive) setRoom(`isaude-consulta-${agendamentoId ?? 'demo'}`);
            } finally {
                if (alive) setLoading(false);
            }
        })();
        return () => { alive = false; };
    }, [agendamentoId]);

    const encerrar = () => navigate('/minha-saude/pos-consulta');

    return (
        <div className="min-h-screen flex flex-col bg-white font-sans">
            {/* Header azul */}
            <header className="w-full bg-[#407BFF] h-16 flex items-center px-4 md:px-12 shadow-sm">
                <img src={logoImage} alt="iSaúde" className="h-8 object-contain brightness-0 invert" />
            </header>

            {/* Barra de navegação + encerrar */}
            <div className="w-full border-b border-gray-100 px-4 md:px-8 h-12 flex items-center justify-between">
                <button onClick={() => navigate(-1)} className="flex items-center gap-1 text-gray-800 font-bold text-sm hover:text-[#407BFF]">
                    <ChevronLeft size={18} /> Consulta Online
                </button>
                <button onClick={encerrar} className="flex items-center gap-1.5 bg-red-500 hover:bg-red-600 text-white font-bold text-xs px-3 py-1.5 rounded-lg transition-colors">
                    <PhoneOff size={14} /> Encerrar
                </button>
            </div>

            {/* Palco de vídeo (Jitsi real) */}
            <div className="flex-1 relative bg-zinc-900 flex items-center justify-center">
                {loading || !room ? (
                    <div className="flex flex-col items-center gap-3 text-white/80">
                        <Loader2 size={28} className="animate-spin" />
                        <span className="text-sm">Conectando à consulta…</span>
                    </div>
                ) : (
                    <JitsiRoom
                        room={room}
                        displayName={user?.nome || 'Paciente'}
                        email={user?.email}
                        onEnd={encerrar}
                        embedded
                    />
                )}
            </div>
        </div>
    );
}
