import { useEffect, useState } from "react";
import "./chatlist.css";
import AddUser from "./addUser/AddUser";
import { useUserStore } from "../../../lib/userStore";
import { doc, getDoc, onSnapshot, updateDoc } from "firebase/firestore";
import { db } from "../../../lib/firebase";
import { useChatStore } from "../../../lib/chatStore";

const ChatList = () => {
  const [addMode, setAddMode] = useState(false);
  const [chats, setChats] = useState([]);
  const [input, setInput] = useState("");

  const { currentUser } = useUserStore();
  const { changeChat, chatId } = useChatStore();

  useEffect(() => {
    const unsub = onSnapshot(
      doc(db, "userchats", currentUser.id),
      async (res) => {
        const items = res.data().chats;

        const promises = items.map(async (item) => {
          const userDocRef = doc(db, "users", item.reciverId); // Fixed receiverId typo
          const userDocSnap = await getDoc(userDocRef);
          const user = userDocSnap.data();

          return { ...item, user }; // Spread chat item data and attach user details
        });

        const chatData = await Promise.all(promises);
        setChats(chatData.sort((a, b) => b.updatedAt - a.updatedAt)); // Fixed sort logic
      }
    );

    return () => {
      unsub();
    };
  }, [currentUser.id]);

  const handleSelect = async (chat) => {
    const userChats = chats.map((item) => {
      const { user, ...rest } = item;
      return rest;
    });
  
    const chatIndex = userChats.findIndex(
      (item) => item.chatId === chat.chatId
    );
  
    userChats[chatIndex].isSeen = true;
  
    const userChatsRef = doc(db, "userchats", currentUser.id);
  
    try {
      await updateDoc(userChatsRef, {
        chats: userChats,
      });
      changeChat(chat.chatId, chat.user);
      
      
    } catch (err) {
      console.log(err);
    }
  };
  

  const filteredChats = chats.filter(c =>
    c.user.username.toLowerCase().includes(input.toLowerCase()) // Corrected toLowerCase() and includes()
  );

  return (
    <div className="chatList">
      <div className="search">
        <div className="searchBar">
          <img src="./search.png" alt="Search Icon" className="searchIcon" />
          <input
            type="text"
            placeholder="Search"
            className="searchInput"
            onChange={(e) => setInput(e.target.value)}
          />
        </div>
        <img
          src={addMode ? "./minus.png" : "./plus.png"}
          alt="Add Icon"
          className={`addIcon ${addMode ? "rotate" : ""}`}
          onClick={() => setAddMode((prev) => !prev)}
        />
      </div>

      <div className="itemContainer">
        {chats.length > 0 ? (
          filteredChats.map((chat) => (
            <div
              className="item"
              key={chat.chatId}
              onClick={() => handleSelect(chat)}
              style={{
                backgroundColor: chat?.isSeen
                  ? "transparent"
                  : "rgba(144, 238, 144, 0.5)", // Light green transparent
              }}
            >
              <img
                src={chat.user?.avatar || "./avatar.png"}
                alt="User Avatar"
                className="avatar"
              />
              <div className="texts">
                <span className="userName">{chat.user?.username}</span>
                <p className="userMessage">
                  {chat.lastMessage || "No messages yet Click + for ADD"}
                </p>
              </div>
            </div>
          ))
        ) : (
          <p>No chats available</p>
        )}

        {addMode && <AddUser />}
      </div>
    </div>
  );
};

export default ChatList;
