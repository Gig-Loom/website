"use client";

import { useEffect, useState, useRef } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { Card, Button, Input, Spinner, Avatar } from "@nextui-org/react";
import { Send } from "lucide-react";
import toast from "react-hot-toast";
import { BASE_URL } from "../BASE_URL";

interface Message {
  id: string;
  text: string;
  senderId: string;
  createdAt: Date;
}

type Conversation = {
  content: string;
  id: number;
  room: number;
  sender: number;
  sender_name: string;
  timestamp: string;
};

interface UserProfile {
  id: string;
  name: string;
  phone_number: string;
}

export default function ChatDetailPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const chatRoomId = searchParams.get('id');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState("");
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [socket, setSocket] = useState<WebSocket | null>(null);
  const [loading, setLoading] = useState(true);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const fetchProfile = async () => {
    try {
      const userInfo = localStorage.getItem("userInfo");
      if (!userInfo) {
        router.push("/login");
        return;
      }

      const { token } = JSON.parse(userInfo);

      const response = await fetch(`${BASE_URL}/accounts/get-my-info/`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        if (response.status === 401) {
          router.push("/login");
          return;
        }
        throw new Error("Failed to fetch profile");
      }

      const data = await response.json();
      setProfile(data.user);
    } catch (error) {
      toast.error("Failed to fetch profile");
      router.push("/chat");
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  useEffect(() => {
    let ws: WebSocket | null = null;
    let reconnectAttempts = 0;
    const maxReconnectAttempts = 5;

    const connectWebSocket = async () => {
      const userInfo = localStorage.getItem("userInfo");
      if (!userInfo) return;

      const { token } = JSON.parse(userInfo);
      const domain = BASE_URL?.replace(/(^\w+:|^)\/\//, "").replace(/\/$/, "");
      const wsUrl = `ws://${domain}/ws/chat/${chatRoomId}/?token=${token}`;

      ws = new WebSocket(wsUrl);

      ws.onopen = () => {
        setSocket(ws);
        reconnectAttempts = 0;
      };

      ws.onmessage = (event) => {
        const data = JSON.parse(event.data);
        const newMessage = {
          id: Date.now().toString(),
          text: data.message,
          senderId: data.sender_id,
          createdAt: new Date(),
        };
        // Check if this message already exists to prevent duplicates
        setMessages((prevMessages) => {
          // If the message with same text and sender exists within last second, don't add it
          const isDuplicate = prevMessages.some(
            (msg) =>
              msg.text === newMessage.text &&
              msg.senderId === newMessage.senderId &&
              Math.abs(
                new Date(msg.createdAt).getTime() -
                  new Date(newMessage.createdAt).getTime()
              ) < 1000
          );

          if (isDuplicate) {
            return prevMessages;
          }
          return [...prevMessages, newMessage];
        });
      };

      ws.onerror = () => {
        toast.error("Connection error. Trying to reconnect...");
      };

      ws.onclose = () => {
        setSocket(null);
        if (reconnectAttempts < maxReconnectAttempts) {
          setTimeout(() => {
            reconnectAttempts++;
            connectWebSocket();
          }, 2000 * reconnectAttempts);
        } else {
          toast.error("Unable to connect. Please try again later.");
        }
      };
    };

    connectWebSocket();

    return () => {
      if (ws) {
        ws.close();
      }
    };
  }, [chatRoomId]);

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const userInfo = localStorage.getItem("userInfo");
        if (!userInfo) {
          router.push("/login");
          return;
        }

        const { token } = JSON.parse(userInfo);

        const response = await fetch(
          `${BASE_URL}/chats/chatrooms/${chatRoomId}/messages/`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );

        if (!response.ok) {
          throw new Error("Failed to fetch messages");
        }

        const data = await response.json();
        const chatMessages = data.data.map((msg: Conversation) => ({
          id: msg.id,
          text: msg.content,
          senderId: msg.sender,
          createdAt: new Date(msg.timestamp),
        }));
        setMessages(
          chatMessages.sort(
            (a: Message, b: Message) =>
              new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
          )
        );
      } catch (error) {
        toast.error("Failed to load messages");
      } finally {
        setLoading(false);
      }
    };

    fetchMessages();
  }, [chatRoomId]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();

    if (!inputMessage?.trim() || !profile || !socket) return;

    const message = {
      message: inputMessage,
    };

    socket.send(JSON.stringify(message));
    setInputMessage("");
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSendMessage(e);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Spinner size="lg" color="success" />
      </div>
    );
  }

  return (
    <div className="flex justify-center bg-gray-50">
      <div className="flex flex-col h-screen max-w-2xl w-full">
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${
                message.senderId === profile?.id
                  ? "justify-end"
                  : "justify-start"
              }`}
            >
              <div
                className={`max-w-[70%] rounded-lg px-4 py-2 ${
                  message.senderId === profile?.id
                    ? "bg-green-500 text-white"
                    : "bg-white border border-gray-200 text-black"
                }`}
              >
                <p className="break-words">{message.text}</p>
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        <div className="border-t border-gray-200 bg-white p-4">
          <form onSubmit={handleSendMessage} className="flex gap-2">
            <Input
              type="text"
              placeholder="Type a message..."
              value={inputMessage}
              onValueChange={setInputMessage}
              onKeyDown={handleKeyPress}
              variant="bordered"
              className="flex-1 text-black"
            />
            <Button
              type="submit"
              isDisabled={!socket}
              color="success"
              className="min-w-[100px]"
            >
              <Send size={20} />
              Send
            </Button>
          </form>

          <Button
            color="success"
            className="w-full mt-4"
            onPress={() =>
              router.push(`/complete-service?chatRoomId=${chatRoomId}`)
            }
          >
            Complete Service
          </Button>
        </div>
      </div>
    </div>
  );
}
