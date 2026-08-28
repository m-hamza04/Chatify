import { create } from 'zustand';

export const useChatStore = create((set, get) => ({
    allContacts: [],
    chats: [],
    messages: [],
    activeTab: "chats",
    selectedUser: null,
    isUserLoading: false,
    isMessagesLoading: false,
    isSoundEnabled: localStorage.getItem("isSoundEnabled") === "true",

    toggleSound: () => {
        const newValue = !get().isSoundEnabled;
        localStorage.setItem("isSoundEnabled", newValue);
        set({ isSoundEnabled: newValue });
    },
    setActiveTab: (tab) => set({ activeTab: tab }),
    setSelectedUser: (selectedUser) => set({ selectedUser }),
    getAllContacts: async () => {
        set({ isUserLoading: true });
        try {
            const res = await axios.get('/messages/contacts');
            set({ allContacts: res.data });
        } catch (error) {
            toast.error(error.response.data.messages);
        } finally {
            set({ isUserLoading: false });
        }
    },
    getMyChatPartners: async () => {
        set({ isUserLoading: true });
        try {
            const res = await axios.get('/messages/chats');
            set({ chats: res.data });
        } catch (error) {
            toast.error(error.response.data.messages);
        } finally {
            set({ isUserLoading: false });
        }
    },
}));