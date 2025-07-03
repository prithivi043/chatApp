import { useState, useEffect, useRef } from "react";
import { io } from "socket.io-client";
import EmojiPicker from "emoji-picker-react";

const socket = io("http://localhost:5000");

export default function ChatWindow({ currentRoom, username }) {
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [messages, setMessages] = useState([]);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [message, setMessage] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  const [replyTo, setReplyTo] = useState(null);
  const bottomRef = useRef(null);
  // Add inside your component (ChatWindow)
  const deleteMessage = (messageId) => {
    if (window.confirm("Are you sure you want to delete this message?")) {
      socket.emit("delete_message", { messageId, room: currentRoom });
      setMessages((prev) => prev.filter((msg) => msg._id !== messageId));
    }
  };

  // Listen for message deletion
  useEffect(() => {
    const deleteHandler = (deletedId) => {
      setMessages((prev) => prev.filter((msg) => msg._id !== deletedId));
    };
    socket.on("message_deleted", deleteHandler);
    return () => socket.off("message_deleted", deleteHandler);
  }, []);


  // USER CONNECT + ONLINE USERS FETCH

  useEffect(() => {
    if (username) {
      socket.emit("user_connected", username);
      socket.on("update_online_users", (users) => {
        setOnlineUsers(users); // object: {socketId: username}
      });
    }

    return () => socket.off("update_online_users");
  }, [username]);


  // ROOM JOIN + MESSAGES FETCH 
  useEffect(() => {
    if (currentRoom) {
      socket.emit("join_room", currentRoom);
      setMessages([]);
      socket.once("previous_messages", (msgs) => {
        setMessages(msgs);
      });
    }
  }, [currentRoom]);

  // INCOMING MESSAGES 
  useEffect(() => {
    const receiveHandler = (data) => {
      if (data.username !== username) {
        setMessages((prev) => [...prev, data]);
      }
    };
    socket.on("receive_message", receiveHandler);
    return () => socket.off("receive_message", receiveHandler);
  }, [username]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  //  SEND TEXT MESSAGE TO SERVER
  const sendMessage = () => {
    if (message.trim() && currentRoom) {
      const messageData = {
        room: currentRoom,
        username,
        text: message,
        replyTo,
        time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", hour12: true }),
      };
      setMessages((prev) => [...prev, { ...messageData, self: true }]);
      socket.emit("send_message", messageData);
      setMessage("");
      setReplyTo(null);
    }
  };

  //  HANDLE FILE CHANGE
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) setSelectedFile(file);
  };

  //  SEND FILE TO SERVER
  const sendFile = async () => {
    if (!selectedFile || !currentRoom) return;
    const formData = new FormData();
    formData.append("file", selectedFile);

    try {
      const res = await fetch("http://localhost:5000/upload", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();

      const fileMsg = {
        room: currentRoom,
        username,
        text: data.fileUrl,
        fileName: selectedFile.name,
        isFile: true,
        replyTo,
        time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", hour12: true }),
      };

      setMessages((prev) => [...prev, { ...fileMsg, self: true }]);
      socket.emit("send_message", fileMsg);
      setSelectedFile(null);
      setReplyTo(null);
    } catch (err) {
      console.error("Error uploading file", err);
    }
  };

  //  EMOJI SELECT FUNCTION
  const onEmojiClick = (emojiData) => {
    setMessage((prev) => prev + emojiData.emoji);
  };

  if (!currentRoom) {
    return (
      <div className="flex-1 bg-white flex items-center justify-center text-gray-500 text-lg">
        Select a chat to start messaging 💬
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col bg-white relative">
      {/* Floating Emoji Picker */}
      {showEmojiPicker && (
        <div className="absolute bottom-24 left-4 z-50 shadow-lg bg-white rounded-md border p-2">
          <div className="flex justify-end">
            <button
              onClick={() => setShowEmojiPicker(false)}
              className="text-gray-500 text-xs px-2 py-1 rounded hover:bg-gray-100"
            >
              ❌ Close
            </button>
          </div>
          <EmojiPicker onEmojiClick={onEmojiClick} />
        </div>
      )}

      <div className="p-4 border-b border-gray-300 font-semibold text-lg bg-sky-300 text-white">
        Room: {currentRoom}
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4 ">
        {messages.map((msg, i) => (
          <div key={i} className={`flex items-start gap-2 ${msg.self ? "justify-end" : "justify-start"}`}>
            {!msg.self && (
              <img
                src={`https://api.dicebear.com/7.x/initials/svg?seed=${msg.username}`}
                alt="avatar"
                className="rounded-full mx-1 w-8 h-8"

              />
            )}

            <div
              className={`px-4 py-2 rounded-lg ${msg.self ? "bg-sky-400 text-white" : "bg-sky-200 text-gray-900"
                }`}
              style={{ wordBreak: "break-word", width: "55%", marginBottom: "10px" }}
            >
              {/* Reply Preview */}
              {msg.replyTo && (
                <div className="border-l-2 border-gray-400 pl-2 mb-1 text-xs italic text-gray-900">
                  Reply to <strong>{msg.replyTo.username}:</strong>{" "}
                  {msg.replyTo.isFile ? msg.replyTo.fileName : msg.replyTo.text}
                </div>
              )}

              {/* Online User Indicator */}
              <div className="font-normal flex items-center gap-1">
                {msg.username}
                {Object.values(onlineUsers || {}).includes(msg.username) && (
                  <span className="text-green-500 text-xs ml-1">(online)</span>
                )}

              </div>

              {msg.isFile ? (
                <a href={msg.text} target="_blank" rel="noopener noreferrer" className="underline break-all">
                  📎 {msg.fileName}
                </a>
              ) : (
                <div className="font-semibold">{msg.text}</div>
              )}

              <div className="text-right text-xs text-gray-600 mt-1">{msg.time}</div>
            </div>

            <div className="text-xs text-gray-900 mt-1">
              <div className="cursor-pointer " onClick={() => setReplyTo(msg)} title="Reply">
                <button className=" bg-sky-500 text-white px-1 ml-2 mb-1 py-1 rounded hover:bg-sky-600">
                  ↩Reply
                </button>
              </div>
              <div
                className="cursor-pointer text-red-500 ml-2 underline"
                onClick={() => deleteMessage(msg._id)}
              >
                <button className=" bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600">
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))}
        <div ref={bottomRef} />

      </div>

      <div className="p-3 border-t border-gray-300 flex flex-col gap-1">
        {replyTo && (
          <div className="px-2 py-1 bg-gray-100 border rounded text-sm text-gray-700 flex justify-between items-center">
            <div>
              <span className="font-semibold">{replyTo.username}: </span>
              <span className="italic">{replyTo.isFile ? replyTo.fileName : replyTo.text}</span>
            </div>
            <button
              onClick={() => setReplyTo(null)}
              className="text-gray-500 text-xs ml-2"
            >
              ❌
            </button>
          </div>
        )}

        <div className="flex items-center gap-2">
          <button onClick={() => setShowEmojiPicker((prev) => !prev)} className="text-2xl">
            😊
          </button>

          <input type="file" onChange={handleFileChange} className="hidden" id="fileInput" />
          <label htmlFor="fileInput" className="cursor-pointer text-2xl">📎</label>

          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault(); // Prevent new line if using textarea
                selectedFile ? sendFile() : sendMessage();
              }
            }}
            placeholder="Type a message..."
            className="flex-1 px-3 py-2 mb-0 rounded border border-gray-300 focus:outline-none"
          />


          <button
            onClick={selectedFile ? sendFile : sendMessage}
            className="bg-sky-500 text-white px-4 py-2 rounded hover:bg-sky-600"
          >
            {selectedFile ? "Upload" : "Send"}
          </button>
        </div>
      </div>
    </div>
  );
}
