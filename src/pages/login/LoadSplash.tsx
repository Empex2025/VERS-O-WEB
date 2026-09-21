import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import logoImage from '../../assets/login/logo-login.png';

/** Splash "Load" — logo + pontinhos, avança para o feed após um breve delay. */
export function LoadSplash() {
    const navigate = useNavigate();

    useEffect(() => {
        const t = setTimeout(() => navigate('/inicio', { replace: true }), 1600);
        return () => clearTimeout(t);
    }, [navigate]);

    return (
        <div className="min-h-screen w-full flex flex-col items-center justify-center bg-[#407BFF] font-sans">
            <img src={logoImage} alt="iSaúde" className="h-12 object-contain brightness-0 invert" />
            <div className="flex gap-2 mt-6">
                {[0, 1, 2, 3].map((i) => (
                    <span
                        key={i}
                        className="w-2 h-2 rounded-full bg-white/60 animate-pulse"
                        style={{ animationDelay: `${i * 150}ms` }}
                    />
                ))}
            </div>
        </div>
    );
}
