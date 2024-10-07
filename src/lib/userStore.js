import { doc, getDoc } from "firebase/firestore";
import { create } from "zustand";
import { db } from "./firebase";

export const useUserStore = create((set) => ({
  currentUser: null,
  isLoading: true, // renamed to isLoading for better readability

  fetchUserInfo: async (uid) => {
    if (!uid) {
      // If no UID, set the currentUser to null and stop loading
      set({ currentUser: null, isLoading: false });
      return;
    }

    try {
      const docRef = doc(db, "users", uid);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        // If document exists, update the store with user data
        set({ currentUser: docSnap.data(), isLoading: false });
      } else {
        // If no document, set currentUser to null
        set({ currentUser: null, isLoading: false });
      }
    } catch (err) {
      console.log(err);
      // Handle errors by setting currentUser to null and stopping loading
      set({ currentUser: null, isLoading: false });
    }
  },
}));
