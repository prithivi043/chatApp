import { useState } from "react";

// Default rooms
const defaultRooms = [
  "General",
  "CSBS",
  "CSE",
  "ECE",
  "EEE",
  "CIVIL",
  "BIO-MEDICAL",
  "Sports"
];

export default function Sidebar({ setCurrentRoom, currentRoom }) {
  const [rooms, setRooms] = useState(defaultRooms);
  const [newRoom, setNewRoom] = useState("");

  const handleAddRoom = () => {
    const trimmed = newRoom.trim();
    if (trimmed && !rooms.includes(trimmed)) {
      setRooms([...rooms, trimmed]);
      setNewRoom("");
      setCurrentRoom(trimmed); // auto-switch to new room
    }
  };

  return (
    <div className="w-1/3 bg-sky-200 text-gray-900 p-4 flex flex-col justify-between">
      <div>
        <h2 className="text-xl font-bold mb-4">Chats</h2>
        {rooms.map((room, i) => (
          <div
            key={i}
            onClick={() => setCurrentRoom(room)}
            className={`cursor-pointer px-4 py-2 rounded-lg mb-2 ${currentRoom === room
              ? "bg-sky-400 text-white"
              : "hover:bg-sky-300"
              }`}
          >
            {room}
          </div>
        ))}
      </div>

      {/* Add New Room */}
      <div className="mt-20 border-t pt-4" style={{ position: "sticky", bottom: 0, marginTop: "200px" }}>
        <input
          type="text"
          placeholder="Enter new room"
          value={newRoom}
          onChange={(e) => setNewRoom(e.target.value)}
          className="w-full px-3 py-2 mb-2 rounded border border-gray-300 focus:outline-none text-sm"
        />
        <button
          onClick={handleAddRoom}
          className="w-full bg-sky-500 text-white py-2 rounded hover:bg-sky-600 text-sm"
        >
          ➕ Add Room
        </button>
      </div>
    </div>
  );
}
