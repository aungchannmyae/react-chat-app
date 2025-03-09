import React from "react";
import { BiPlus, BiSearch } from "react-icons/bi";

const ChatSection = ({
  currentUser,
  setShowAddPopup,
  showAddPopup,
  setSelectedChat,
  selectedChat,
  chats,
}) => {
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
              className="w-full pl-10 pr-4 py-2 rounded-lg border focus:outline-none focus:border-blue-500"
            />
            <BiSearch
              className="absolute left-3 top-3 text-gray-400"
              size={20}
            />
          </div>
        </div>
        <div className="flex-1 overflow-y-auto">
          {chats.map((chat) => (
            <div
              key={chat.chatId}
              onClick={() => setSelectedChat(chat)}
              className={`p-4 border-b hover:bg-gray-50 cursor-pointer ${
                selectedChat?.id === chat.id ? "bg-blue-50" : ""
              }`}
            >
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 rounded-full bg-gray-300"></div>
                <div className="flex-1">
                  <div className="flex justify-between">
                    <h3 className="font-semibold capitalize">{chat.user.username}</h3>
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
      </div>
    </>
  );
};

export default ChatSection;
