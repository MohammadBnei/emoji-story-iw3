"use client";

import { useEffect, useState } from "react";
import { Socket, io } from "socket.io-client";
import {
  ClientToServerEvent,
  ServerToClientEvent,
  Story,
} from "interface/event";
import Step from "@/component/UI/step";

const socket: Socket<ServerToClientEvent, ClientToServerEvent> = io(
  process.env.NEXT_PUBLIC_SOCKET_URL || "http://localhost:4000"
);
export default function Home() {
  const [story, setStory] = useState<Story>();
  useEffect(() => {
    socket.on("story-update", (data) => {
      setStory(data);
    });

    return () => {
      socket.disconnect();
    };
  }, []);
  return (
    <main className="flex min-h-screen flex-col items-center justify-between lg:p-24">
      <h1 className="text-6xl font-bold">Emoji Story</h1>
      {story?.steps?.[0] && (
        <Step
          key={story?.steps[0].order}
          step={story?.steps[0]}
          onVote={(data) => {
            socket.emit("step-vote", data);
          }}
        />
      )}
    </main>
  );
}
