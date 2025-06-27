# 💬 ChatApp – Real-Time Web Chat Platform

**ChatApp** is a real-time web chat application built using **React**, **Socket.io**, **Express**, **MongoDB**, and **Tailwind CSS**. It enables dynamic room management, file sharing, emoji usage, live online status, reply features, and avatar support.

---

## 🔥 Features

- ✅ Real-time chat with Socket.io
- ✅ Dynamic room creation and switching
- ✅ User avatars (auto-generated with initials)
- ✅ Online user status indicator
- ✅ Message reply functionality
- ✅ File upload and preview (using Multer)
- ✅ Emoji picker integration
- ✅ Responsive UI (mobile-friendly)
- ✅ Scroll-to-bottom on new messages
- ✅ MongoDB for message persistence

---

## 📁 Project Structure

chatapp/
│
├── client/ # React frontend
│ ├── App.jsx
│ ├── Sidebar.jsx
│ ├── ChatWindow.jsx
│ └── index.css
│
├── server/ # Node.js + Express backend
│ ├── index.js
│ └── uploads/ # Folder for uploaded files
│
├── README.md # Project documentation
└── package.json # Backend dependencies

yaml
Copy
Edit

---

## 🖥️ Tech Stack

### Frontend
- React
- Socket.io-client
- Emoji Picker
- Tailwind CSS

### Backend
- Node.js
- Express
- Socket.io
- MongoDB
- Mongoose
- Multer (file upload)
- CORS

---

## 🚀 How to Run the App

### 📌 Step 1: Clone the Repo

```bash
git clone https://github.com/your-username/chatapp.git
cd chatapp
📌 Step 2: Setup Backend (Server)
bash
Copy
Edit
cd server
npm install
Make sure MongoDB is running locally (mongodb://127.0.0.1:27017)

Then start the server:

bash
Copy
Edit
node index.js
📍 Server runs at: http://localhost:5000

📌 Step 3: Setup Frontend (Client)
bash
Copy
Edit
cd client
npm install
npm start
📍 React app runs at: http://localhost:3000

📂 API Endpoints
Method	Endpoint	Description
POST	/upload	Upload files
GET	/uploads/:file	Access uploaded file

🧠 Functionality Overview
Feature	Details
Real-Time Chat	Messages sent and received instantly via WebSockets
Rooms	Select predefined rooms or create new rooms dynamically
Reply Message	Tap on a message to reply inline with reference
Emoji Support	Emoji picker integrated inside message input
File Upload	Upload documents/images and preview or download
Online Users	See who is currently online in the chat
User Avatars	User avatars generated using initials (via ui-avatars.com)


✨ Author
👤 PrithiviRaj

🧑‍💻 Final Year B.Tech (CSBS)

📬 prithivigithub043@gmail.com

🌐 https://www.linkedin.com/in/prithiviraj-t-35a930291/

📄 License
This project is licensed under the MIT License.

🙌 Contribute
Pull requests and feature suggestions are always welcome!
If you find a bug or have a feature request, open an issue on the repository.

📦 To-Do (Optional Enhancements)
✅ Typing indicator

✅ Dark mode support

⏳ Message delete/edit

⏳ Notification sound

⏳ Group chat with invite

yaml
Copy
Edit

---

###  Ready to Use

If you need:
- This as a downloadable `.md` file  
- A version with screenshot placeholders or GitHub badge integration  
- Deployment guide for **Render**, **Vercel**, or **Heroku**

Let me know! I can generate those for you.