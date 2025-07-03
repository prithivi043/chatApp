import { useState } from "react";
import Sidebar from "./components/Sidebar";
import ChatWindow from "./components/ChatWindow";

export default function App() {
  const [currentRoom, setCurrentRoom] = useState("");
  const [username, setUsername] = useState("");
  const [nameSubmitted, setNameSubmitted] = useState(false);

  return (
    <div className="flex h-screen bg-gradient-to-r from-blue-200 to-purple-500">

      {!nameSubmitted ? (

        <div className="flex-1 flex flex-col items-center justify-center  text-gray-800 space-y-4 px-4">
          <h1 className="text-center text-2xl text-yellow-100">Welcome To My Chat App</h1>
          <div className="border-white/10 border-2 h-1/2 rounded-lg  bg-opacity-30 backdrop-filter backdrop-blur-lg  bg-slate-400 flex flex-col items-center justify-center p-10 shadow-indigo-500/50">
            <h1 className="text-2xl font-semibold z-10 text-white">Enter Your Name</h1>
            <input
              type="text"
              placeholder="Your Name"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="px-4 py-2 rounded border w-full max-w-xs my-3 mt-4"
            />
            <button
              onClick={() => {
                if (username.trim() !== "") setNameSubmitted(true);
              }}
              className="bg-sky-600 text-white px-4 py-2 rounded hover:bg-sky-500"
            >
              Continue
            </button>
          </div>
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
