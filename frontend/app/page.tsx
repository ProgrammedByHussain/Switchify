"use client";

import { useState, useEffect } from "react";

export default function Home() {
  const [playlists, setPlaylists] = useState([]);
  const [error, setError] = useState("");

  const handleLogin = () => {
    window.location.href = "http://localhost:3000/api/spotify/login";
  };

  const fetchPlaylists = async () => {
    try {
      const token = new URLSearchParams(window.location.search).get(
        "access_token"
      );
      console.log("Got token:", token?.substring(0, 20) + "..."); // Log first 20 chars of token

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
      setError((error as Error).message);
    }
  };

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
        <h1 className="text-4xl font-bold mb-8">Spotify Playlists</h1>

        <button
          onClick={handleLogin}
          className="bg-green-500 text-white px-6 py-2 rounded-full mb-8 hover:bg-green-600"
        >
          Login with Spotify
        </button>

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
              <h2 className="text-xl font-semibold">{playlist.name}</h2>
              <p className="text-gray-600">Tracks: {playlist.tracks.total}</p>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
