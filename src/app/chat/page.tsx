'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, Spinner, User, Navbar, Button, NavbarBrand, NavbarContent, NavbarItem } from "@nextui-org/react";
import toast from 'react-hot-toast';
import { BASE_URL } from '../BASE_URL';
import Image from 'next/image';

interface Conversation {
  chat_room_id: string;
  other_person_name: string;
  last_message: string;
  last_message_time: string;
}

export default function ChatListPage() {
  const router = useRouter();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchConversations = async () => {
    try {
      setLoading(true);
      const userInfo = localStorage.getItem('userInfo');
      
      if (!userInfo) {
        router.push('/login');
        return;
      }

      const { token } = JSON.parse(userInfo);

      const response = await fetch(`${BASE_URL}/chats/chatrooms/`, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        if (response.status === 401) {
          router.push('/login');
          return;
        }
        throw new Error('Failed to fetch conversations');
      }

      const data = await response.json();
      if (data.success) {
        console.log(data.data)
        setConversations(data.data);
      } else {
        throw new Error(data.message || 'Failed to fetch conversations');
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : 'An error occurred';
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchConversations();
  }, []);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const diffDays = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (diffDays === 0) {
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } else if (diffDays === 1) {
      return 'Yesterday';
    } else if (diffDays < 7) {
      return date.toLocaleDateString([], { weekday: 'short' });
    } else {
      return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
    }
  };

  if (loading && conversations.length === 0) {
    return (
      <div className="flex min-h-screen bg-gray-50 pb-16">
        <div className="flex justify-center items-center w-full">
          <Spinner size="lg" color="success" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar isBordered className="h-16">
              <div className="max-w-7xl mx-auto w-full px-4 flex items-center justify-between">
                <NavbarBrand>
                  <Image
                    src="/icon.png"
                    alt="icon"
                    width={75}
                    height={50}
                    className="object-cover"
                  />
                </NavbarBrand>
                <NavbarContent justify="center" className="flex gap-8">
                  <NavbarItem
                    onClick={() => router.push("/home")}
                    className="cursor-pointer hover:text-green-600 text-gray-500"
                  >
                    Home
                  </NavbarItem>
                  <NavbarItem
                    isActive className="cursor-pointer text-green-600"
                  >
                    Chat
                  </NavbarItem>
                  <NavbarItem onClick={() => router.push("/profile")}
                    className="cursor-pointer hover:text-green-600 text-gray-500">
                    Profile
                  </NavbarItem>
                </NavbarContent>
              </div>
            </Navbar>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {conversations.length === 0 ? (
          <div className="flex justify-center items-center h-64">
            <p className="text-gray-500">No conversations yet</p>
          </div>
        ) : (
          <div className="space-y-2">
            {conversations.map((conversation) => (
              <Card
                key={conversation.chat_room_id}
                isPressable
                onPress={() => router.push(`/chatroom?id=${conversation.chat_room_id}`)}
                className="w-full"
              >
                <div className="p-4 flex items-center gap-4">
                  <User
                    name={conversation.other_person_name}
                    className='text-black'
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start">
                      <p className="text-sm text-gray-500 truncate">
                        {conversation.last_message}
                      </p>
                      <span className="text-xs text-gray-400 whitespace-nowrap ml-4">
                        {formatDate(conversation.last_message_time)}
                      </span>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
