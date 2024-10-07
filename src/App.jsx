import React, { useEffect, useState } from "react";
import Chat from "./components/chat/chat";
import List from "./components/list/list";
import Detail from "./components/detail/detail";
import Login from "./components/login/Login";
import Notification from "./components/notification/Notification";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "./lib/firebase";
import { useUserStore } from "./lib/userStore";
import { useChatStore } from "./lib/chatStore";
import Compatible from "./AppComponents/Compatible"; // Import the new component
import Loading from "./AppComponents/Loading"; // Import the new component

const App = () => {
  const { currentUser, isLoading, fetchUserInfo } = useUserStore();
  const { chatId } = useChatStore();
  const [isDeviceCompatible, setIsDeviceCompatible] = useState(true); 

  useEffect(() => {
    const unSub = onAuthStateChanged(auth, (user) => {
      if (user) {
        fetchUserInfo(user?.uid);
      } else {
        fetchUserInfo(null);
      }
    });

    const handleResize = () => {
      setIsDeviceCompatible(window.innerWidth >720 );
    };

    window.addEventListener("resize", handleResize);
    handleResize();

    return () => {
      unSub();
      window.removeEventListener("resize", handleResize);
    };
  }, [fetchUserInfo]);
  if (isLoading) return <Loading />;

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
          <Login />
        )
      ) : (
        <Compatible /> // Use the new Compatible component here
      )}

      <Notification />
    </div>
  );
};

export default App;
