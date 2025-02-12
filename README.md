# Apple Music Playlist Converter

This project allows users to authenticate with Apple Music and create playlists from their Spotify data. It utilizes Apple Music's MusicKit.js for user authentication and Express.js for backend API handling.

## 🚀 Features

- **User Authentication**: Log in with Apple Music via MusicKit.js.
- **Playlist Creation**: Convert Spotify playlists to Apple Music.
- **Secure Token Handling**: Uses Apple Developer Token and Music-User-Token for API access.

## 🛠️ Setup Instructions

### Backend Setup

1. Clone the repository:
   ```sh
   git clone https://github.com/ProgrammedByHussain/Switchify.git
   ```
2. Install dependencies:
   ```sh
   npm install
   ```
3. Create a `.env` file and add the following credentials:
   ```env
   APPLE_MUSIC_DEVELOPER_TOKEN=your_developer_token_here
   APPLE_TEAM_ID=your_team_id
   APPLE_KEY_ID=your_key_id
   APPLE_PRIVATE_KEY_PATH=path_to_your_private_key.p8
   ```
4. Start the backend server:
   ```sh
   npm start
   ```

### Frontend Setup

1. Include MusicKit.js in your frontend:
   ```html
   <script src="https://js-cdn.music.apple.com/musickit/v1/musickit.js"></script>
   ```
2. Fetch the developer token from the backend and initialize MusicKit:
   ```js
   MusicKit.configure({
     developerToken: "your_backend_fetched_token",
     app: { name: "Playlist Converter", build: "1.0.0" },
   });
   ```
3. Implement user login and token retrieval:
   ```js
   const music = MusicKit.getInstance();
   document
     .getElementById("apple-music-login")
     .addEventListener("click", async () => {
       const userToken = await music.authorize();
       console.log("User Token:", userToken);
     });
   ```
