import { create } from 'zustand';

interface AppState {
    isVideoCallOpen: boolean;
    activeRoomName: string | null;
    unreadMessagesCount: number;
    openVideoCall: (roomName: string) => void;
    closeVideoCall: () => void;
    incrementUnreadMessages: () => void;
    clearUnreadMessages: () => void;
}

export const useAppStore = create<AppState>((set) => ({
    isVideoCallOpen: false,
    activeRoomName: null,
    unreadMessagesCount: 0,

    openVideoCall: (roomName) => set({ isVideoCallOpen: true, activeRoomName: roomName }),
    closeVideoCall: () => set({ isVideoCallOpen: false, activeRoomName: null }),

    incrementUnreadMessages: () => set((state) => ({ unreadMessagesCount: state.unreadMessagesCount + 1 })),
    clearUnreadMessages: () => set({ unreadMessagesCount: 0 }),
}));
