import React, { useState, useEffect, useCallback } from "react";
import { HiMenu, HiX } from "react-icons/hi";
import {
  BiSearch,
  BiDotsVerticalRounded,
  BiSend,
  BiBlock,
} from "react-icons/bi";
import { FiLogOut } from "react-icons/fi";
import { BiPlus } from "react-icons/bi";
import { NavLink, useNavigate } from "react-router-dom";
import EmojiPicker from "emoji-picker-react";
import { BsEmojiSmile } from "react-icons/bs";
import { IoImageOutline } from "react-icons/io5";
import { onAuthStateChanged } from "firebase/auth";
import useUserStore from "../../../lib/userStore";
import { auth, db } from "../../../lib/firebase";
import { doc, getDoc, onSnapshot } from "firebase/firestore";
import AddPopUp from "../components/list/AddPopUp";
import ChatSection from "../components/list/ChatSection";
import Chats from "../components/chat/Chats";
import ChatDetail from "../components/detail/ChatDetail";
import useChatStore from "../../../lib/chatStore";

const MainPage = () => {
  const { currentUser, isLoading, fetchUserInfo } = useUserStore();
  const { chatId } = useChatStore();
  const navigation = useNavigate();

  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [selectedChat, setSelectedChat] = useState(null);
  const [showChatDetails, setShowChatDetails] = useState(true);
  const [showAddPopup, setShowAddPopup] = useState(false);

  const handleClickOutside = useCallback((e) => {
    if (
      window.innerWidth < 768 &&
      !e.target.closest(".sidebar") &&
      !e.target.closest(".menu-button")
    ) {
      setIsSidebarOpen(false);
    }
  }, []);

  //login and register check
  useEffect(() => {
    const unSub = onAuthStateChanged(auth, (user) => {
      if (user) {
        fetchUserInfo(user?.uid);
      } else {
        navigation("/register");
        return null;
      }
    });
    return () => {
      unSub();
    };
  }, [fetchUserInfo]);

  //sidebar toggle
  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [handleClickOutside]);

  if (isLoading) return <div>Loading...</div>;

  return (
    <div className="h-screen p-2 flex gap-2 overflow-hidden bg-stone-300">
      <button
        className="md:hidden fixed top-4 left-4 z-50 menu-button p-2 rounded-md bg-blue-600 text-white"
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
      >
        {isSidebarOpen ? <HiX size={24} /> : <HiMenu size={24} />}
      </button>
      <div
        className={`overflow-hidden lg:rounded-md sidebar fixed md:static w-80 h-full bg-white shadow-lg transform transition-transform duration-300 ease-in-out ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        } md:translate-x-0 z-40`}
      >
        <button
          className="md:hidden fixed top-4 left-4 z-50 menu-button p-2 rounded-md bg-blue-600 text-white"
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
        >
          {isSidebarOpen ? <HiX size={24} /> : <HiMenu size={24} />}
        </button>
        <div className="h-full flex flex-col">
          <ChatSection
            showAddPopup={showAddPopup}
            setShowAddPopup={setShowAddPopup}
          />
          <div
            className={`absolute bottom-0 left-0 right-0 bg-white rounded-t-xl transform transition-transform duration-300 ease-in-out ${
              showAddPopup ? "translate-y-0" : "translate-y-full"
            }`}
          >
            <AddPopUp setShowAddPopup={setShowAddPopup} />
          </div>
        </div>
      </div>

      {chatId ? (
        <Chats
          showChatDetails={showChatDetails}
          setShowChatDetails={setShowChatDetails}
        />
      ) : (
        <div className="flex-1 flex items-center justify-center">
          <h2 className="text-2xl font-semibold text-gray-500">
            Select a chat to start messaging
          </h2>
        </div>
      )}
      {chatId && (
        <div
          className={`${showChatDetails ? "block" : "hidden"} lg:block w-80`}
        >
          <ChatDetail />
        </div>
      )}
    </div>
  );
};

export default MainPage;
