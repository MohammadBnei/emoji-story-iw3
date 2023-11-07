"use client";

import { useEffect } from "react";
import { io } from "socket.io-client";

const socket = io(
  process.env.NEXT_PUBLIC_SOCKET_URL || "http://localhost:4000"
);
export default function Home() {
  useEffect(() => {
    socket.on("story-update", (data) => {
      console.log({ data });
    });

    return () => {
      socket.disconnect();
    };
  }, []);
  return (
    <main className="flex min-h-screen flex-col items-center justify-between lg:p-24">
      <h1 className="text-6xl font-bold">Emoji Story</h1>
    </main>
  );
}
