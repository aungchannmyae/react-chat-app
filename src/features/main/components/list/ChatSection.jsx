import React, { useEffect, useState } from "react";
import { BiPlus, BiSearch } from "react-icons/bi";
import useUserStore from "../../../../lib/userStore";
import { doc, getDoc, onSnapshot, updateDoc } from "firebase/firestore";
import { db } from "../../../../lib/firebase";
import useChatStore from "../../../../lib/chatStore";

const ChatSection = ({ setShowAddPopup, showAddPopup }) => {
  const [chats, setChats] = useState([]);
  const [input, setInput] = useState("");

  const { currentUser, isLoading } = useUserStore();
  const { chatId, changeChat } = useChatStore();

  const filteredChats = chats.filter((c) =>
    c.user.username.toLowerCase().includes(input.toLowerCase())
  );

  //fetch user chat
  useEffect(() => {
    if (!isLoading && currentUser) {
      const unSub = onSnapshot(
        doc(db, "userchats", currentUser.id),
        async (res) => {
          const items = res.data().chats;
          const promises = items.map(async (item) => {
            const userDocRef = doc(db, "users", item.receiverId);

            const userDocSnap = await getDoc(userDocRef);

            const user = userDocSnap.data();
            return { ...item, user };
          });
          const chatData = await Promise.all(promises);
          setChats(chatData.sort((a, b) => b.updatedAt - a.updatedAt));
        }
      );
      return () => {
        unSub();
      };
    }
  }, [isLoading, currentUser, currentUser?.id]);

  const handleSelect = async (chat) => {
    const userChats = chats.map((item) => {
      const { user, ...rest } = item;
      return rest;
    });

    const chatIndex = userChats.findIndex(
      (item) => item.chatId === chat.chatId
    );

    userChats[chatIndex].isSeen = true;

    const userChatsRef = doc(db, "userchats", currentUser.id);

    try {
      await updateDoc(userChatsRef, {
        chats: userChats,
      });
      changeChat(chat.chatId, chat.user);
    } catch (err) {
      console.log(err);
    }
  };
  return (
    <>
      <div className="p-4 flex justify-between items-center">
        <h2 className="text-xl font-bold text-gray-800 capitalize">
          {currentUser?.username}
        </h2>
        <button
          onClick={() => setShowAddPopup(!showAddPopup)}
          className="p-1 text-white rounded-full hover:bg-gray-100 transition-colors"
        >
          <BiPlus size={20} className="text-black" />
        </button>
      </div>
      <div
        onClick={() => showAddPopup && setShowAddPopup(false)}
        className={`flex-1 flex flex-col transition-all duration-300 ${
          showAddPopup ? "blur-sm" : ""
        }`}
      >
        <div className="px-4 py-3 border-b">
          <div className="relative">
            <input
              type="text"
              placeholder="Search chats..."
              onChange={(e) => setInput(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-lg border focus:outline-none focus:border-blue-500"
            />
            <BiSearch
              className="absolute left-3 top-3 text-gray-400"
              size={20}
            />
          </div>
        </div>
        {filteredChats.map((chat) => (
          <div key={chat.chatId} className="flex-1 overflow-y-auto">
            {chats.map((chat) => (
              <div
                key={chat.chatId}
                onClick={() => handleSelect(chat)}
                className={`p-4 border-b  cursor-pointer ${
                  chat?.isSeen ? "bg-transparent" : " bg-blue-400"
                } `}
              >
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 rounded-full bg-gray-300"></div>
                  <div className="flex-1">
                    <div className="flex justify-between">
                      <h3 className="font-semibold capitalize">
                        <span>
                          {chat.user.blocked.includes(currentUser.id)
                            ? "User"
                            : chat.user.username}
                        </span>
                      </h3>
                      <span className="text-sm text-gray-500">{chat.time}</span>
                    </div>
                    <p className="text-sm text-gray-600 truncate">
                      {chat.lastMessage}
                    </p>
                  </div>
                  {chat.unread > 0 && (
                    <span className="bg-blue-600 text-white rounded-full px-2 py-1 text-xs">
                      {chat.unread}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        ))}
      </div>
    </>
  );
};

export default ChatSection;
