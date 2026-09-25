import { create } from 'zustand';

interface AppState {
    unreadMessagesCount: number;
    incrementUnreadMessages: () => void;
    clearUnreadMessages: () => void;
}

export const useAppStore = create<AppState>((set) => ({
    unreadMessagesCount: 0,
    incrementUnreadMessages: () => set((state) => ({ unreadMessagesCount: state.unreadMessagesCount + 1 })),
    clearUnreadMessages: () => set({ unreadMessagesCount: 0 }),
}));
