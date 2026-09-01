import { useState } from 'react';
import { ChevronLeft, Mic, MicOff, Video, VideoOff, MessageSquare, Share2, MoreHorizontal, PhoneOff } from 'lucide-react';
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

            {/* Barra de navegação + controles */}
            <div className="w-full border-b border-gray-100 flex items-center justify-between px-4 md:px-8 h-14">
                <button onClick={() => navigate(-1)} className="flex items-center gap-1 text-gray-800 font-bold text-sm hover:text-[#407BFF]">
                    <ChevronLeft size={18} /> Consulta Online
                </button>
                <div className="flex items-center gap-3">
                    <span className="flex items-center gap-1.5 text-xs font-bold text-emerald-600">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" /> 43:59
                    </span>
                    <span className="text-xs text-gray-400">4009-BE2025</span>
                    <div className="flex items-center gap-2 text-gray-500">
                        <button className="hover:text-[#407BFF]"><Share2 size={16} /></button>
                        <button className="hover:text-[#407BFF]"><MessageSquare size={16} /></button>
                        <button className="hover:text-[#407BFF]"><MoreHorizontal size={16} /></button>
                        <button onClick={() => navigate('/minha-saude/pos-consulta')} className="w-7 h-7 rounded-md bg-red-500 text-white flex items-center justify-center hover:bg-red-600">
                            <PhoneOff size={14} />
                        </button>
                    </div>
                </div>
            </div>

            {/* Palco de vídeo */}
            <div className="flex-1 relative bg-gray-100 flex items-center justify-center">
                {/* Remoto (profissional) */}
                <div className="text-center">
                    <Avatar name="Dra. Maria Glenda" size={110} ring />
                    <p className="text-sm font-bold text-gray-700 mt-3">Dra. Maria Glenda</p>
                </div>

                {/* Local (PiP) */}
                <div className="absolute top-6 right-6 w-40 h-28 rounded-xl bg-gray-300 flex items-center justify-center">
                    {camOff ? <VideoOff size={24} className="text-gray-500" /> : <span className="text-xs font-semibold text-gray-600">Você</span>}
                </div>

                {/* Controles inferiores */}
                <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-4">
                    <button onClick={() => setMuted((v) => !v)} className="w-12 h-12 rounded-full bg-white shadow flex items-center justify-center text-gray-700 hover:bg-gray-50">
                        {muted ? <MicOff size={20} /> : <Mic size={20} />}
                    </button>
                    <button onClick={() => setCamOff((v) => !v)} className="w-12 h-12 rounded-full bg-white shadow flex items-center justify-center text-gray-700 hover:bg-gray-50">
                        {camOff ? <VideoOff size={20} /> : <Video size={20} />}
                    </button>
                    <button onClick={() => navigate('/minha-saude/pos-consulta')} className="w-14 h-14 rounded-full bg-red-500 hover:bg-red-600 text-white flex items-center justify-center">
                        <PhoneOff size={24} />
                    </button>
                </div>
            </div>
        </div>
    );
}
