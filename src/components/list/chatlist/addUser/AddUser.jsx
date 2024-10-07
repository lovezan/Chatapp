import { useState } from "react";
import {
  collection,
  query,
  where,
  getDocs,
  serverTimestamp,
  setDoc,
  doc,
  arrayUnion,
  updateDoc,
  getDoc,
} from "firebase/firestore";
import { db } from "../../../../lib/firebase";
import "./addUser.css";
import { toast } from "react-toastify";
import { useUserStore } from "../../../../lib/userStore";

const AddUser = () => {
  const [user, setUser] = useState(null);
  const { currentUser } = useUserStore();

  const handleSearch = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const username = formData.get("username");

    try {
      const userRef = collection(db, "users");
      const q = query(userRef, where("username", "==", username));
      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        setUser(querySnapshot.docs[0].data());
      } else {
        toast.error("User not found.");
      }
    } catch (err) {
      console.log(err);
      toast.error("An error occurred while searching for the user.");
    }
  };

  const handleAdd = async () => {
    const chatRef = collection(db, "chats");
    const userchatRef = collection(db, "userchats");

    try {
      // Get the current user's chat document
      const currentUserChatDocRef = doc(userchatRef, currentUser.id);
      const currentUserChatDoc = await getDoc(currentUserChatDocRef);

      if (currentUserChatDoc.exists()) {
        const existingChats = currentUserChatDoc.data().chats || [];

        // Check if a chat with this user already exists
        const isChatExist = existingChats.some(
          (chat) => chat.reciverId === user.id
        );

        if (isChatExist) {
          toast.error("Chat with this user already exists.");
          return;
        }
      }

      // Create a new chat document
      const newChatRef = doc(chatRef);
      await setDoc(newChatRef, {
        createdAt: serverTimestamp(),
        messages: [],
      });

      // Update the user chat document with the new chat information
      await updateDoc(doc(userchatRef, user.id), {
        chats: arrayUnion({
          chatId: newChatRef.id,
          lastmessage: [],
          reciverId: currentUser.id,
          updatedAt: Date.now(),
        }),
      });

      // Update the current user's chat document with the new chat information
      await updateDoc(currentUserChatDocRef, {
        chats: arrayUnion({
          chatId: newChatRef.id,
          lastmessage: [],
          reciverId: user.id,
          updatedAt: Date.now(),
        }),
      });

      toast.success("User added successfully!"); // Notify success
    } catch (err) {
      console.log(err);
      toast.error("An error occurred while adding the user.");
    }
  };

  return (
    <div className="addUser">
      <form onSubmit={handleSearch}>
        <input type="text" placeholder="UserName" name="username" required />
        <button type="submit">Search</button>
      </form>

      {user && (
        <div className="user">
          <div className="detail">
            <img src={user.avatar || "./avatar.png"} alt="User Avatar" />
            <h2>{user.username}</h2>
          </div>
          <button onClick={handleAdd}>Add User</button>
        </div>
      )}
    </div>
  );
};

export default AddUser;
