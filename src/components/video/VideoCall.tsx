import { JitsiMeeting } from '@jitsi/react-sdk';
import { useAppStore } from '../../store/useAppStore';
import { X } from 'lucide-react';

export function VideoCall() {
    const { isVideoCallOpen, activeRoomName, closeVideoCall } = useAppStore();

    if (!isVideoCallOpen || !activeRoomName) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm">
            <div className="relative w-full max-w-5xl h-[80vh] bg-zinc-900 rounded-xl overflow-hidden shadow-2xl">

                {/* Botão de Fechar Customizado */}
                <button
                    onClick={closeVideoCall}
                    className="absolute top-4 right-4 z-50 p-2 bg-red-600 hover:bg-red-700 text-white rounded-full transition-colors"
                >
                    <X size={24} />
                </button>

                <JitsiMeeting
                    domain="meet.jit.si"
                    roomName={activeRoomName}
                    configOverwrite={{
                        startWithAudioMuted: true,
                        disableModeratorIndicator: true,
                        startScreenSharing: true,
                        enableEmailInStats: false
                    }}
                    interfaceConfigOverwrite={{
                        DISABLE_JOIN_LEAVE_NOTIFICATIONS: true
                    }}
                    userInfo={{
                        displayName: 'Usuário Rede Social'
                    }}
                    getIFrameRef={(iframeRef) => {
                        iframeRef.style.height = '100%';
                        iframeRef.style.width = '100%';
                    }}
                />
            </div>
        </div>
    );
}
