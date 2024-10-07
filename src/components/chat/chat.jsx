import "./chat.css";
import { useEffect, useState, useRef } from "react";
import EmojiPicker from "emoji-picker-react";
import {
  arrayUnion,
  doc,
  getDoc,
  onSnapshot,
  updateDoc,
} from "firebase/firestore";
import { FiSend } from "react-icons/fi";
import { db } from "../../lib/firebase";
import { useChatStore } from "../../lib/chatStore";
import { useUserStore } from "../../lib/userStore";
import { toast } from "react-toastify";
import upload from "../../lib/upload";

const Chat = () => {
  const [chat, setChat] = useState();
  const [open, setOpen] = useState(false);
  const [text, setText] = useState("");
  const [mediaDescription, setMediaDescription] = useState("");
  const [media, setMedia] = useState({
    file: null,
    url: "",
    type: "",
  });
  const [isUploading, setIsUploading] = useState(false);
  const [isSending, setIsSending] = useState(false);

  const { currentUser } = useUserStore();
  const { chatId, user, isCurrentUserBlocked, isReciverBlocked } =
    useChatStore();

  const endref = useRef(null);
  const textInputRef = useRef(null);

  useEffect(() => {
    endref.current?.scrollIntoView({ behavior: "smooth" });
  }, [chat?.messages]);

  useEffect(() => {
    textInputRef.current?.focus();
  }, [chatId]);

  useEffect(() => {
    const unSub = onSnapshot(doc(db, "chats", chatId), (res) => {
      setChat(res.data());
    });

    return () => {
      unSub();
    };
  }, [chatId]);


  

  const handleEmoji = (e) => {
    setText((prev) => prev + e.emoji);
    setOpen(false);
  };

  const handleMedia = (e) => {
    if (e.target.files[0]) {
      const file = e.target.files[0];
      const fileType = file.type.startsWith("image/")
        ? "image"
        : file.type.startsWith("video/")
        ? "video"
        : file.type.startsWith("audio/") // Added for audio files
        ? "audio"
        : file.type.startsWith("application/pdf")
        ? "pdf"
        : file.type.startsWith(
            "application/vnd.openxmlformats-officedocument.presentationml.presentation"
          ) // PowerPoint
        ? "ppt"
        : file.type.startsWith(
            "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
          ) // Word
        ? "doc"
        : file.type.startsWith("application/zip") // ZIP
        ? "zip"
        : "";

      if (fileType) {
        setMedia({
          file,
          url: URL.createObjectURL(file),
          type: fileType,
        });
      } else {
        toast.error(
          "Unsupported file type. Please upload an image, video, audio, PDF, PPT, DOC, or ZIP file."
        );
      }
    }
  };

  const handleSend = async () => {
    if (text.trim() === "" && !media.file) return;

    let mediaUrl = null;
    let lastMessageText = text.trim();

    try {
      setIsUploading(true);
      setIsSending(true); // Show sending message

      if (media.file) {
        mediaUrl = await upload(media.file);
        lastMessageText =
          media.type === "image"
            ? `📷 Image Sent`
            : media.type === "video"
            ? `🎥 Video Sent`
            : media.type === "audio"
            ? `🎵 Audio Sent` // Added for audio files
            : media.type === "pdf"
            ? `📄 PDF Sent`
            : media.type === "ppt"
            ? `📊 PowerPoint Sent`
            : media.type === "doc"
            ? `📝 Word Document Sent`
            : media.type === "zip"
            ? `📦 ZIP File Sent`
            : "";
      }

      const messageData = {
        senderId: currentUser.id,
        text: text.trim(),
        mediaDescription: mediaDescription.trim(),
        createdAt: new Date(),
        ...(mediaUrl && { [media.type]: mediaUrl }),
      };

      await updateDoc(doc(db, "chats", chatId), {
        messages: arrayUnion(messageData),
      });

      const userIDs = [currentUser.id, user.id];
      for (const id of userIDs) {
        const userChatsRef = doc(db, "userchats", id);
        const userChatsSnapShot = await getDoc(userChatsRef);

        if (userChatsSnapShot.exists()) {
          const userChatsData = userChatsSnapShot.data();
          const chatIndex = userChatsData.chats.findIndex(
            (c) => c.chatId === chatId
          );

          userChatsData.chats[chatIndex].lastMessage = lastMessageText;
          userChatsData.chats[chatIndex].isSeen = id === currentUser.id;
          userChatsData.chats[chatIndex].updatedAt = Date.now();

          await updateDoc(userChatsRef, {
            chats: userChatsData.chats,
          });
        }
      }

      setText("");
      setMediaDescription("");
      setMedia({ file: null, url: "", type: "" });
    } catch (err) {
      console.log(err);
      toast.error("Failed to send message");
    } finally {
      setIsUploading(false);
      setIsSending(false); // Hide sending message
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleSend();
    }
  };

  const renderMessageText = (text) => {
  // Regular expression to detect URLs
  const urlPattern = /(https?:\/\/[^\s]+)/g;

  // If the text contains URLs, replace them with clickable links
  const formattedText = text.split(" ").map((part, index) =>
    urlPattern.test(part) ? (
      <a
        key={index}
        href={part}
        target="_blank"
        rel="noopener noreferrer"
        className="message-link" // Add a class for styling
      >
        {part}
      </a>
    ) : (
      <span key={index}>{part} </span>
    )
  );

  return formattedText;
};


  return (
    <div className="chat">
      <div className="top">
        <div className="user">
          <img src={user?.avatar || "./avatar.png"} alt="" />
          <div className="texts">
            <span>{user?.username || "User"}</span>
            <p>Lorem ipsum dolor sit amet.</p>
          </div>
        </div>
        <div className="icons">
          {/* <img src="./phone.png" alt="" />
          <img src="./video.png" alt="" /> */}
          <img src="./info.png" alt="" />
        </div>
      </div>
      <div className="center">
        {chat?.messages?.map((message) => (
        
          <div
            className={`message ${
              message.senderId === currentUser.id ? "own" : ""
            }`}
            key={message?.createdAt}
          >
            <div className="texts">
              {message.image && <img src={message.image} alt="" />}
              {message.video && (
                <video controls>
                  <source src={message.video} type="video/mp4" />
                  Your browser does not support the video tag.
                </video>
              )}
              {message.audio && ( // Added for audio files
                <audio controls>
                  <source src={message.audio} type="audio/mpeg" />
                  Your browser does not support the audio tag.
                </audio>
              )}
              {message.pdf && (
                <a href={message.pdf} target="_blank" rel="noopener noreferrer">
                  📄 PDF File
                </a>
              )}
              {message.ppt && (
                <a href={message.ppt} target="_blank" rel="noopener noreferrer">
                  📊 PowerPoint File
                </a>
              )}
              {message.doc && (
                <a href={message.doc} target="_blank" rel="noopener noreferrer">
                  📝 Word Document
                </a>
              )}
              {message.zip && (
                <a href={message.zip} target="_blank" rel="noopener noreferrer">
                  📦 ZIP File
                </a>
              )}
              {message.text && <p>{renderMessageText(message.text)}</p>}
  {message.mediaDescription && <p><i>{message.mediaDescription}</i></p>}
            </div>
          </div>
        ))}

        {media.url && (
          <div className="message own">
            <div className="text">
              {media.type === "image" ? (
                <img src={media.url} alt="Uploaded" />
              ) : media.type === "video" ? (
                <video controls>
                  <source src={media.url} type="video/mp4" />
                  Your browser does not support the video tag.
                </video>
              ) : media.type === "audio" ? ( // Added for audio files
                <audio controls>
                  <source src={media.url} type="audio/mpeg" />
                  Your browser does not support the audio tag.
                </audio>
              ) : media.type === "pdf" ? (
                <a href={media.url} target="_blank" rel="noopener noreferrer">
                  📄 PDF File
                </a>
              ) : media.type === "ppt" ? (
                <a href={media.url} target="_blank" rel="noopener noreferrer">
                  📊 PowerPoint File
                </a>
              ) : media.type === "doc" ? (
                <a href={media.url} target="_blank" rel="noopener noreferrer">
                  📝 Word Document
                </a>
              ) : media.type === "zip" ? (
                <a href={media.url} target="_blank" rel="noopener noreferrer">
                  📦 ZIP File
                </a>
              ) : null}
              <p>
                <i>Waiting for description...</i>
              </p>
            </div>
          </div>
        )}

        {isSending && <p className="sending-message">Sending...</p>}

        <div ref={endref}></div>
      </div>
      <div className="bottom">
        <div className="icons">
          <label htmlFor="file">
            <img src="./img.png" alt="" />
          </label>
          <input
            type="file"
            id="file"
            style={{ display: "none" }}
            onChange={handleMedia}
          />
        
          <div className="emoji">
            <img
              src="./emoji.png"
              alt=""
              onClick={() => setOpen((prev) => !prev)}
            />
            {open && (
              <div className="picker">
                <EmojiPicker onEmojiClick={handleEmoji} />
              </div>
            )}
          </div>
        </div>
        <input
          type="text"
          placeholder="Type your message..."
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={handleKeyDown}
          ref={textInputRef}
        />
  
        <button
          onClick={handleSend}
          disabled={isSending || isCurrentUserBlocked || isReciverBlocked}
        >
          <FiSend /> {/* Reply icon */}
        </button>
          <img src="./mic.png" alt="" />
          <img src="./camera.png" alt="" />
      </div>
    </div>
  );
};

export default Chat;
