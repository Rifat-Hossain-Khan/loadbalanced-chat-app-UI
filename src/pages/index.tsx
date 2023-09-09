import { FormEvent, useEffect, useRef, useState } from "react";
import useSocket from "@/hooks/useSocket";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

const CONNECTION_COUNT_UPDATED_CHANNEL = "chat:connection-count-updated";
const NEW_MSG_CHANNEL = "chat:new-message";

type Message = {
  message: string;
  id: string;
  createdAt: string;
  port: string;
};

type Count = {
  count: number;
};

export default function Home() {
  const messageListRef = useRef<HTMLOListElement | null>(null);
  const [newMessage, setNewMessage] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [connectionCount, setConnectionCount] = useState(0);
  const socket = useSocket();

  const scrollToBottom = () => {
    if (messageListRef.current) {
      messageListRef.current.scrollTop =
        messageListRef.current.scrollHeight + 1000;
    }
  };

  useEffect(() => {
    socket?.on("connect", () => {
      console.log("Connected to Socket");
    });

    socket?.on(NEW_MSG_CHANNEL, (message: Message) => {
      setMessages((preMessage) => [...preMessage, message]);
      setTimeout(() => {
        scrollToBottom();
      }, 0);
    });

    socket?.on(CONNECTION_COUNT_UPDATED_CHANNEL, ({ count }: Count) => {
      setConnectionCount(count);
    });
  }, [socket]);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    setNewMessage("");

    socket?.emit(NEW_MSG_CHANNEL, { message: newMessage });
  };

  return (
    <main className="flex flex-col p-4 w-full max-w-3xl m-auto h-full">
      <h1 className="text-4xl font-bold text-center mb-4">
        Chat ({connectionCount})
      </h1>
      <ol
        className="flex-1 overflow-y-scroll overflow-x-hidden"
        ref={messageListRef}
      >
        {messages.map((message) => (
          <li
            className="bg-gray-100 rounded-lg p-4 my-2 break-all"
            key={message.id}
          >
            <p className="text-sm text-gray-500">{message.createdAt}</p>
            <p className="text-sm text-gray-500">{message.port}</p>
            <p>{message.message}</p>
          </li>
        ))}
      </ol>
      <form onSubmit={handleSubmit} className="flex items-center">
        <Textarea
          className="rounded-lg mr-4"
          placeholder="Tell us what's on your mind"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          maxLength={255}
        />

        <Button className="h-full" type="submit">
          Send Message
        </Button>
      </form>
    </main>
  );
}
