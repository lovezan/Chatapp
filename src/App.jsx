import Chat from "./components/chat/chat";
import List from "./components/list/list";
import Detail from "./components/detail/detail";
import Login from "./components/login/Login";
import Notification from "./components/notification/Notification";
import { useEffect } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "./lib/firebase";
import { useUserStore } from "./lib/userStore";
import "./index.css";
import { useChatStore } from "./lib/chatStore";

const App = () => {
  // Get currentUser, isLoading, and fetchUserInfo from the store
  const { currentUser, isLoading, fetchUserInfo } = useUserStore();
  const { chatId } = useChatStore();

  useEffect(() => {
    const unSub = onAuthStateChanged(auth, (user) => {
      if (user) {
        // If user is logged in, fetch user info
        fetchUserInfo(user?.uid);
      } else {
        // If user is not logged in, set currentUser to null
        fetchUserInfo(null);
      }
    });

    return () => {
      unSub(); // Unsubscribe from onAuthStateChanged listener
    };
  }, [fetchUserInfo]); // Fetch user info when the component mounts
  // console.log(currentUser)

  // Show loading indicator while the user info is being fetched
  if (isLoading) return <div className="loading">Loading....</div>;

  // Render the Chat page if user is authenticated
  return (
    <div className="container">
      {currentUser ? (
        <>
          <List />
         {chatId &&  <Chat />}
         {chatId && <Detail />}
        </>
      ) : (
        <Login /> // Show Chat even if the user is not authenticated
      )}

      <Notification />
    </div>
  );
};

export default App;
