import { JitsiMeeting } from '@jitsi/react-sdk';
import { X } from 'lucide-react';

interface JitsiRoomProps {
    /** Nome da sala (opaco) — os dois participantes precisam usar o mesmo. */
    room: string;
    displayName?: string;
    email?: string;
    /** Voz apenas: entra com a câmera desligada. */
    audioOnly?: boolean;
    /** Chamado ao encerrar (hangup do Jitsi ou botão fechar). */
    onEnd: () => void;
    /** true = preenche o container pai; false = overlay modal em tela cheia. */
    embedded?: boolean;
}

/** Sala de vídeo/voz via Jitsi (meet.jit.si) — reutilizada em consulta e conversas. */
export function JitsiRoom({ room, displayName, email, audioOnly = false, onEnd, embedded = false }: JitsiRoomProps) {
    const meeting = (
        <JitsiMeeting
            domain="meet.jit.si"
            roomName={room}
            configOverwrite={{
                startWithAudioMuted: false,
                startWithVideoMuted: audioOnly,
                prejoinPageEnabled: false,
                disableModeratorIndicator: true,
                enableEmailInStats: false,
            }}
            interfaceConfigOverwrite={{ DISABLE_JOIN_LEAVE_NOTIFICATIONS: true }}
            userInfo={{ displayName: displayName || 'Usuário iSaúde', email: email || '' }}
            onReadyToClose={onEnd}
            getIFrameRef={(iframeRef) => {
                iframeRef.style.height = '100%';
                iframeRef.style.width = '100%';
            }}
        />
    );

    if (embedded) return <div className="w-full h-full">{meeting}</div>;

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
                {meeting}
            </div>
        </div>
    );
}
