import { useState } from 'react';
import { ChevronLeft, Mic, MicOff, Video, VideoOff, MessageSquare, MoreHorizontal, PhoneOff, Volume2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Avatar } from '../../components/ui/Avatar';
import logoImage from '../../assets/login/logo-login.png';

export function ConsultaOnline() {
    const navigate = useNavigate();
    const [muted, setMuted] = useState(false);
    const [camOff, setCamOff] = useState(false);

    return (
        <div className="min-h-screen flex flex-col bg-white font-sans">
            {/* Header azul */}
            <header className="w-full bg-[#407BFF] h-16 flex items-center px-4 md:px-12 shadow-sm">
                <img src={logoImage} alt="iSaúde" className="h-8 object-contain brightness-0 invert" />
            </header>

            {/* Barra de navegação */}
            <div className="w-full border-b border-gray-100 px-4 md:px-8 h-12 flex items-center">
                <button onClick={() => navigate(-1)} className="flex items-center gap-1 text-gray-800 font-bold text-sm hover:text-[#407BFF]">
                    <ChevronLeft size={18} /> Consulta Online
                </button>
            </div>

            {/* Sub-barra: timer + código + controles */}
            <div className="w-full flex items-center justify-between px-4 md:px-8 h-12 bg-[#F9FAFB]">
                <div className="flex items-center gap-3">
                    <span className="flex items-center gap-1.5 text-xs font-bold text-gray-700 bg-white border border-gray-100 rounded-md px-2 py-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-rose-500" /> 01:34
                    </span>
                    <span className="text-xs text-gray-400">4S59-BE2025</span>
                </div>
                <div className="flex items-center gap-1.5 text-gray-500">
                    <Ctrl onClick={() => {}}><Volume2 size={16} /></Ctrl>
                    <Ctrl onClick={() => setMuted((v) => !v)}>{muted ? <MicOff size={16} /> : <Mic size={16} />}</Ctrl>
                    <Ctrl onClick={() => setCamOff((v) => !v)}>{camOff ? <VideoOff size={16} /> : <Video size={16} />}</Ctrl>
                    <Ctrl onClick={() => {}}><MessageSquare size={16} /></Ctrl>
                    <Ctrl onClick={() => {}}><MoreHorizontal size={16} /></Ctrl>
                    <button onClick={() => navigate('/minha-saude/pos-consulta')} className="w-9 h-8 rounded-lg bg-red-500 text-white flex items-center justify-center hover:bg-red-600 ml-1">
                        <PhoneOff size={15} />
                    </button>
                </div>
            </div>

            {/* Palco de vídeo */}
            <div className="flex-1 relative bg-gray-100 flex items-center justify-center">
                {/* Remoto (profissional) */}
                <div className="text-center">
                    <Avatar name="Dra. Maria Glenda" size={110} ring />
                    <span className="block mt-3 text-xs font-semibold text-gray-600 bg-white/70 rounded px-2 py-0.5 mx-auto w-fit">Dra. Maria Glenda</span>
                </div>

                {/* Local (PiP) */}
                <div className="absolute top-6 right-6 w-44 h-32 rounded-xl bg-gray-300 flex items-center justify-center">
                    {camOff ? <VideoOff size={24} className="text-gray-500" /> : (
                        <div className="text-center">
                            <Avatar name="Carlos José" size={56} ring />
                            <span className="block mt-2 text-[11px] font-semibold text-gray-600 bg-white/70 rounded px-2 py-0.5 mx-auto w-fit">Carlos José</span>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

function Ctrl({ children, onClick }: { children: React.ReactNode; onClick?: () => void }) {
    return (
        <button onClick={onClick} className="w-8 h-8 rounded-lg bg-white border border-gray-100 flex items-center justify-center hover:text-[#407BFF] hover:border-[#407BFF]/40 transition-colors">
            {children}
        </button>
    );
}
