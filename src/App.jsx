import Chat from "./components/chat/chat";
import List from "./components/list/list";
import Detail from "./components/detail/detail";
import Login from "./components/login/Login";
import Notification from "./components/notification/Notification";
import { useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "./lib/firebase";
import { useUserStore } from "./lib/userStore";
import "./index.css";
import { useChatStore } from "./lib/chatStore";

const App = () => {
  const { currentUser, isLoading, fetchUserInfo } = useUserStore();
  const { chatId } = useChatStore();
  
  const [isDeviceCompatible, setIsDeviceCompatible] = useState(true); // State to track compatibility message

  useEffect(() => {
    const unSub = onAuthStateChanged(auth, (user) => {
      if (user) {
        fetchUserInfo(user?.uid);
      } else {
        fetchUserInfo(null);
      }
    });

    const handleResize = () => {
      setIsDeviceCompatible(window.innerWidth > 1024);
    };

    window.addEventListener("resize", handleResize);
    handleResize(); // Initial check on mount

    return () => {
      unSub();
      window.removeEventListener("resize", handleResize);
    };
  }, [fetchUserInfo]);

  // Show loading indicator while the user info is being fetched
  if (isLoading) return <div className="loading">Loading....</div>;

  // Render the Chat page if user is authenticated
  return (
    <div className="container">
      {isDeviceCompatible ? (
        currentUser ? (
          <>
            <List />
            {chatId && <Chat />}
            {chatId && <Detail />}
          </>
        ) : (
          <Login /> // Show Chat even if the user is not authenticated
        )
      ) : (
        <div style={styles.compatibilityMessage}>
          No compatible width with Your device
        </div>
      )}

      <Notification />
    </div>
  );
};

// Inline styles for the compatibility message
const styles = {
  compatibilityMessage: {
    position: "fixed",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    padding: "20px",
    backgroundColor: "rgba(255, 0, 0, 0.8)",
    color: "#fff",
    borderRadius: "8px",
    textAlign: "center",
    fontSize: "1.5em",
    animation: "fadeIn 0.5s ease-in-out",
    zIndex: 1000,
  },
};

export default App;
