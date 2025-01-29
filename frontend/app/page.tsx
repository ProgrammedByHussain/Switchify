"use client";

import { useState, useEffect } from "react";

// MusicKit
declare global {
  interface Window {
    MusicKit: any;
  }
}

export default function Home() {
  const [playlists, setPlaylists] = useState([]);
  const [error, setError] = useState("");
  const [appleMusicAuthorized, setAppleMusicAuthorized] = useState(false);
  // Utility function to handle unknown errors
  const getErrorMessage = (error: unknown): string => {
    if (error instanceof Error) return error.message;
    return String(error);
  };

  // Spotify Login
  const handleSpotifyLogin = () => {
    window.location.href = "http://localhost:3000/api/spotify/login";
  };

  // Apple Music Login
  const handleAppleMusicLogin = async () => {
    try {
      if (!window.MusicKit) throw new Error("MusicKit not loaded");

      // Get or create instance
      const music =
        window.MusicKit.getInstance() ||
        new window.MusicKit.MusicKitInstance({
          developerToken: "placeholder", // Will be overwritten
          app: { name: "App", build: "1.0" },
        });

      await music.authorize();
      setAppleMusicAuthorized(true);
    } catch (error) {
      setError(getErrorMessage(error));
    }
  };

  // Transfer Playlist to Apple Music
  const transferToAppleMusic = async (playlistId: string) => {
    try {
      if (!appleMusicAuthorized) {
        await handleAppleMusicLogin();
      }

      const music = window.MusicKit.getInstance();
      const userToken = music.musicUserToken;

      const response = await fetch(
        "http://localhost:3000/api/apple-music/create-playlist",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            playlistId,
            appleUserToken: userToken,
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to transfer playlist");
      }

      alert("Playlist transferred successfully!");
    } catch (error) {
      console.error("Error transferring playlist:", error);
      if (error instanceof Error) {
        setError(error.message);
      }
    }
  };

  // Fetch Spotify Playlists
  const fetchPlaylists = async () => {
    try {
      const token = new URLSearchParams(window.location.search).get(
        "access_token"
      );
      console.log("Got token:", token?.substring(0, 20) + "...");

      if (!token) {
        setError("No access token found");
        return;
      }

      console.log("Fetching playlists...");
      const response = await fetch(
        "http://localhost:3000/api/spotify/playlists",
        {
          headers: {
            Authorization: token.startsWith("Bearer ")
              ? token
              : `Bearer ${token}`,
          },
        }
      );

      console.log("Response status:", response.status);

      if (!response.ok) {
        const errorText = await response.text();
        console.error("Error response:", errorText);
        setError(`Failed to fetch playlists: ${response.status}`);
        throw new Error(`Failed to fetch playlists: ${response.status}`);
      }

      const data = await response.json();
      console.log("Got playlists:", data);
      setPlaylists(data);
    } catch (error) {
      console.error("Error in fetchPlaylists:", error);
      if (error instanceof Error) {
        setError(error.message);
      }
    }
  };

  // Initialize Apple Music
  useEffect(() => {
    const setupAppleMusic = async () => {
      try {
        // Fix endpoint and method
        const response = await fetch(
          "http://localhost:3000/api/apple-music/user-token",
          {
            method: "POST", // Add POST method
          }
        );

        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(`Token request failed: ${errorText}`);
        }

        const { token } = await response.json();

        // Initialize even if MusicKit exists
        window.MusicKit.configure({
          developerToken: token,
          app: {
            name: "Playlist Transfer",
            build: "1.0.0",
          },
        });

        console.log("MusicKit configured!");
      } catch (error) {
        console.error("Setup error:", error);
        setError(getErrorMessage(error));
      }
    };

    // Check if MusicKit is already loaded
    if (window.MusicKit) {
      setupAppleMusic();
    } else {
      // If MusicKit is not loaded, load it dynamically
      const script = document.createElement("script");
      script.src = "https://js-cdn.music.apple.com/musickit/v3/musickit.js";
      script.onload = () => {
        console.log("MusicKit script loaded");
        setupAppleMusic();
      };
      script.onerror = () => {
        console.error("Failed to load MusicKit script");
        setError("Failed to load Apple Music library");
      };
      document.body.appendChild(script);
    }
  }, []);

  // Fetch Spotify playlists on component mount
  useEffect(() => {
    console.log("Component mounted");
    const token = new URLSearchParams(window.location.search).get(
      "access_token"
    );
    if (token) {
      console.log("Found token in URL, fetching playlists");
      fetchPlaylists();
    }
  }, []);

  return (
    <main className="min-h-screen p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-8">Playlist Transfer</h1>

        <div className="flex gap-4 mb-8">
          <button
            onClick={handleSpotifyLogin}
            className="bg-green-500 text-white px-6 py-2 rounded-full hover:bg-green-600"
          >
            Login with Spotify
          </button>
          <button
            onClick={handleAppleMusicLogin}
            className="bg-pink-500 text-white px-6 py-2 rounded-full hover:bg-pink-600"
          >
            Login with Apple Music
          </button>
        </div>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        <div className="grid gap-4">
          {playlists.map((playlist: any) => (
            <div
              key={playlist.id}
              className="border p-4 rounded-lg shadow hover:shadow-md transition-shadow"
            >
              <div className="flex justify-between items-center">
                <div>
                  <h2 className="text-xl font-semibold">{playlist.name}</h2>
                  <p className="text-gray-600">
                    Tracks: {playlist.tracks.total}
                  </p>
                </div>
                <button
                  onClick={() => transferToAppleMusic(playlist.id)}
                  className="bg-pink-500 text-white px-4 py-2 rounded hover:bg-pink-600"
                >
                  Transfer to Apple Music
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
