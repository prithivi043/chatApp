import { useState } from "react";
import Sidebar from "./components/Sidebar";
import ChatWindow from "./components/ChatWindow";

export default function App() {
  const [currentRoom, setCurrentRoom] = useState("");
  const [username, setUsername] = useState("");
  const [nameSubmitted, setNameSubmitted] = useState(false);

  return (
    <div className="flex h-screen bg-sky-100">
      {!nameSubmitted ? (
        <div className="flex-1 flex flex-col items-center justify-center text-gray-800 space-y-4 px-4">
          <h1 className="text-2xl font-semibold">Enter Your Name</h1>
          <input
            type="text"
            placeholder="Your Name"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="px-4 py-2 rounded border w-full max-w-xs"
          />
          <button
            onClick={() => {
              if (username.trim() !== "") setNameSubmitted(true);
            }}
            className="bg-sky-500 text-white px-4 py-2 rounded hover:bg-sky-600"
          >
            Continue
          </button>
        </div>
      ) : (
        <>
          <Sidebar setCurrentRoom={setCurrentRoom} currentRoom={currentRoom} />
          <ChatWindow currentRoom={currentRoom} username={username} />
        </>
      )}
    </div>
  );
}
