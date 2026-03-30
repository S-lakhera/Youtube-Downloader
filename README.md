# 🎥 TubeDL - YouTube Video Downloader

![TubeDL UI Preview](./frontend/src/assets/youtube.webp)

TubeDL is a modern, responsive, and completely free YouTube video downloader built with a React frontend and Node.js/Express backend. With a user-friendly glassmorphism design, it allows you to quickly fetch video information and download your favorite YouTube content in various high-quality video (MP4) and audio (MP3, WAV, M4A) formats.

---

## ✨ Features

- **🚀 High-Speed Downloads:** Fetch and download media blazingly fast.
- **🎧 Multiple Audio Formats:** Download audio-only versions in MP3, M4A, or WAV formats.
- **📺 High-Quality Video:** Supports downloading videos in all available resolutions (ranging from 144p up to 4K / 2160p encoded with MP4).
- **🎨 Modern UI/UX:** Built with Tailwind CSS and Lucide React, featuring smooth hover animations, custom gradients, and a sleek glassmorphism aesthetic.
- **📱 Fully Responsive:** Works seamlessly on Desktop, Tablet, and Mobile devices.
- **🔧 Reliable Backend Engine:** Powered by `@distube/ytdl-core` and `play-dl` for stable and secure video processing.

---

## 💻 Tech Stack

### Frontend
- **Framework:** [React 19](https://react.dev/) + [Vite](https://vitejs.dev/)
- **Styling:** [Tailwind CSS 4](https://tailwindcss.com/)
- **Icons:** [Lucide React](https://lucide.dev/)
- **HTTP Client:** [Axios](https://axios-http.com/)

### Backend
- **Framework:** [Express.js 5](https://expressjs.com/)
- **Core Processors:** `@distube/ytdl-core`, `play-dl`
- **Media Transcoding:** `fluent-ffmpeg`, `@ffmpeg-installer/ffmpeg`, `@ffprobe-installer/ffprobe`
- **Middleware:** `cors`

---

## 🛠️ Prerequisites

Before you begin, ensure you have met the following requirements:
* **Node.js:** Make sure you have Node (v18 or higher) installed on your local machine.
* **npm:** Node Package Manager (comes with Node.js).

---

## ⚙️ Installation & Setup

1. **Clone the repository:**
   ```bash
   git clone https://github.com/S-lakhera/Youtube-Downloader.git
   cd Youtube-Downloader
   ```

2. **Setup the Backend:**
   ```bash
   cd backend
   npm install
   ```
   Start the backend development server:
   ```bash
   npm run dev
   ```
   *(The backend server will run on port 5000 by default).*

3. **Setup the Frontend:**
   Open a new terminal window inside the main project directory and run:
   ```bash
   cd frontend
   npm install
   ```

4. **Environment Variables:**
   Create a `.env.local` file inside the `frontend` folder to point the frontend to your backend.
   ```env
   VITE_API_URL=http://localhost:5000/api
   ```

5. **Run the Frontend Server:**
   ```bash
   npm run dev
   ```
   *(The app UI will be accessible at http://localhost:5173).*

---

## 📖 Usage

1. Open your browser and navigate to `http://localhost:5173`.
2. Find the YouTube video you want to download and copy its URL.
3. Paste the URL into the search bar inside **TubeDL** and hit "Fetch".
4. The requested video details will dynamically appear.
5. Select your desired Audio or Video format from the selector menu to begin the download instantly.

---

## ⚠️ Disclaimer

**TubeDL** is created for **educational purposes only**. Please respect the copyright of the content creators and the terms of service of YouTube. Do not use this tool to download copyrighted materials without explicit permission from the original creator. The developers of this project assume no liability for the misuse of this tool.

---

## 🤝 Contributing

Contributions, issues, and feature requests are welcome! Feel free to check the [issues page](https://github.com/S-lakhera/Youtube-Downloader/issues) if you want to contribute.

---

## 📝 License

This project is licensed under the **ISC License**.
