import { X } from 'lucide-react';

interface JitsiRoomProps {
    /** Nome da sala (opaco) — os dois participantes precisam usar o mesmo. */
    room: string;
    displayName?: string;
    email?: string;
    /** Voz apenas: entra com a câmera desligada. */
    audioOnly?: boolean;
    /** Chamado ao fechar (botão da moldura). */
    onEnd: () => void;
    /** true = preenche o container pai; false = overlay modal em tela cheia. */
    embedded?: boolean;
}

/**
 * Sala de vídeo/voz via Jitsi (meet.jit.si) por IFRAME direto — sem o
 * @jitsi/react-sdk (que embute outra cópia do React e quebra com hooks no
 * React 19). A config vai pelo hash da URL do Jitsi.
 */
export function JitsiRoom({ room, displayName, audioOnly = false, onEnd, embedded = false }: JitsiRoomProps) {
    const cfg = [
        'config.prejoinPageEnabled=false',
        'config.disableModeratorIndicator=true',
        `config.startWithVideoMuted=${audioOnly ? 'true' : 'false'}`,
        'config.startWithAudioMuted=false',
        `userInfo.displayName=${encodeURIComponent(`"${displayName || 'Usuário iSaúde'}"`)}`,
    ].join('&');
    const src = `https://meet.jit.si/${encodeURIComponent(room)}#${cfg}`;

    const iframe = (
        <iframe
            title="Chamada iSaúde"
            src={src}
            allow="camera; microphone; fullscreen; display-capture; autoplay; clipboard-write"
            className="w-full h-full border-0"
        />
    );

    if (embedded) return <div className="w-full h-full">{iframe}</div>;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
            <div className="relative w-full max-w-5xl h-[80vh] bg-zinc-900 rounded-xl overflow-hidden shadow-2xl">
                <button
                    onClick={onEnd}
                    className="absolute top-4 right-4 z-50 p-2 bg-red-600 hover:bg-red-700 text-white rounded-full transition-colors"
                    aria-label="Encerrar chamada"
                >
                    <X size={22} />
                </button>
                {iframe}
            </div>
        </div>
    );
}
