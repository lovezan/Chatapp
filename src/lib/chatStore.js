import { doc, getDoc } from "firebase/firestore";
import { create } from "zustand";
import { db } from "./firebase";
import { useUserStore } from "./userStore";

export const useChatStore = create((set) => ({
  chatId: null,
  user: null,
  isCurrentUserBlocked: false,
  isReciverBlocked: false,
  changeChat: (chatId, user) => {
    const currentUser = useUserStore.getState().currentUser;

    // Ensure that `user` and `blocked` properties exist before using `includes()`
    if (
      user &&
      Array.isArray(user.blocked) &&
      user.blocked.includes(currentUser.id)
    ) {
      return set({
        chatId,
        user: null,
        isCurrentUserBlocked: true,
        isReciverBlocked: false,
      });
    }
    // Ensure `currentUser.blocked` exists and is an array
    else if (
      currentUser &&
      Array.isArray(currentUser.blocked) &&
      currentUser.blocked.includes(user.id)
    ) {
      return set({
        chatId,
        user: user,
        isCurrentUserBlocked: false,
        isReciverBlocked: true,
      });
    } else {
      set({
        chatId,
        user,
        isCurrentUserBlocked: false,
        isReciverBlocked: false,
      });
    }
  },

  changeBlock: () => {
    set((state) => ({ ...state, isReciverBlocked: !state.isReciverBlocked }));
  },
}));
