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

const MainPage = () => {
  const { currentUser, isLoading, fetchUserInfo } = useUserStore();
  const navigation = useNavigate();

  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [selectedChat, setSelectedChat] = useState(null);
  const [message, setMessage] = useState("");
  const [showChatDetails, setShowChatDetails] = useState(true);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [showAddPopup, setShowAddPopup] = useState(false);
  const [chats, setChats] = useState([]);

  const handleFileChange = useCallback((e) => {
    const file = e.target.files[0];
    if (
      file &&
      (file.type.startsWith("image/") || file.type.startsWith("video/"))
    ) {
      setSelectedFile(file);
    }
  }, []);

  const onEmojiClick = useCallback((emojiObject) => {
    setMessage((prevMessage) => prevMessage + emojiObject.emoji);
  }, []);

  const handleClickOutside = useCallback((e) => {
    if (
      window.innerWidth < 768 &&
      !e.target.closest(".sidebar") &&
      !e.target.closest(".menu-button")
    ) {
      setIsSidebarOpen(false);
    }
  }, []);

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
  }, [isLoading, currentUser]);

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [handleClickOutside]);

  if (isLoading) return <div>Loading...</div>;

  const handleLogout = () => {
    navigation("/login");
    auth.signOut();
    // Add your logout logic here
  };

  const handleBlock = () => {
    // Add your block user logic here
  };

  console.log(chats);

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
            currentUser={currentUser}
            selectedChat={selectedChat}
            setSelectedChat={setSelectedChat}
            showAddPopup={showAddPopup}
            setShowAddPopup={setShowAddPopup}
            chats={chats}
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

      <div className="md:rounded-md overflow-hidden flex-1 flex flex-col bg-white">
        {selectedChat ? (
          <>
            <div className="p-4 border-b flex justify-between items-center">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-full bg-gray-300"></div>
                <h2 className="font-semibold">{selectedChat.name}</h2>
              </div>
              <button
                onClick={() => setShowChatDetails(!showChatDetails)}
                className="lg:hidden p-2 hover:bg-gray-100 rounded-full"
              >
                <BiDotsVerticalRounded size={24} className="text-gray-600" />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-4 space-y-4 scroll-smooth">
              <div className="flex justify-end">
                <div className="bg-blue-600 text-white rounded-lg p-3 max-w-xs">
                  Hello! How are you?
                </div>
              </div>
              <div className="flex justify-start">
                <div className="bg-gray-200 rounded-lg p-3 max-w-xs">
                  I'm doing great, thanks!
                </div>
              </div>
              <div className="flex justify-end">
                <div className="bg-blue-600 text-white rounded-lg p-3 max-w-xs">
                  Hello! How are you?
                </div>
              </div>
              <div className="flex justify-start">
                <div className="bg-gray-200 rounded-lg p-3 max-w-xs">
                  I'm doing great, thanks!
                </div>
              </div>
              <div className="flex justify-end">
                <div className="bg-blue-600 text-white rounded-lg p-3 max-w-xs">
                  Hello! How are you?
                </div>
              </div>
              <div className="flex justify-start">
                <div className="bg-gray-200 rounded-lg p-3 max-w-xs">
                  Lorem ipsum dolor sit amet consectetur adipisicing elit.
                  Expedita doloribus quaerat deserunt amet itaque quas corporis
                  cupiditate eius porro soluta.
                </div>
              </div>
              <div className="flex justify-end">
                <div className="max-w-sm rounded-lg overflow-hidden">
                  <img
                    src="/Sample.jpg"
                    alt="Sample received image"
                    className="rounded-lg"
                  />
                </div>
              </div>
              <div className="flex justify-end">
                <div className="bg-blue-600 text-white rounded-lg p-3 max-w-xs">
                  Check out these photos!
                </div>
              </div>
              <div className="flex justify-start">
                <div className="bg-gray-200 rounded-lg p-3 max-w-xs">
                  Lorem ipsum dolor sit amet consectetur adipisicing elit.
                  Expedita doloribus quaerat deserunt amet itaque quas corporis
                  cupiditate eius porro soluta.
                </div>
              </div>
            </div>
            <div className="p-4 bg-gray-100 relative">
              <div className="flex space-x-2">
                <div className="relative flex space-x-2">
                  <button
                    onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                    className="p-2 hover:bg-gray-200 rounded-full transition-colors"
                  >
                    <BsEmojiSmile size={24} className="text-gray-600" />
                  </button>
                  <label className="p-2 hover:bg-gray-200 rounded-full transition-colors cursor-pointer">
                    <IoImageOutline size={24} className="text-gray-600" />
                    <input
                      type="file"
                      className="hidden"
                      accept="image/*,video/*"
                      onChange={handleFileChange}
                    />
                  </label>
                  {showEmojiPicker && (
                    <div className="absolute bottom-14 left-0">
                      <div className="shadow-lg rounded-lg">
                        <EmojiPicker
                          onEmojiClick={onEmojiClick}
                          width={300}
                          height={400}
                        />
                      </div>
                    </div>
                  )}
                </div>
                <input
                  type="text"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Type a message..."
                  className="flex-1 px-4 py-2 border rounded-full focus:outline-none focus:border-blue-500"
                />
                <button className="text-white rounded-full hover:animate-pulse">
                  <BiSend size={30} className="text-blue-600" />
                </button>
              </div>
              {selectedFile && (
                <div className="mt-2 p-2 bg-gray-200 rounded-lg flex items-center justify-between">
                  <span className="text-sm text-gray-600 truncate">
                    {selectedFile.name}
                  </span>
                  <button
                    onClick={() => setSelectedFile(null)}
                    className="ml-2 text-gray-500 hover:text-gray-700"
                  >
                    ×
                  </button>
                </div>
              )}
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center text-gray-500">
            Select a chat to start messaging
          </div>
        )}
      </div>

      <div className={`${showChatDetails ? "block" : "hidden"} lg:block w-80`}>
        {selectedChat && (
          <div className="h-full flex flex-col gap-2">
            <div className="flex-1 p-4 lg:rounded-md bg-white">
              <div className="flex flex-col items-center space-y-4">
                <div className="w-24 h-24 rounded-full bg-gray-300"></div>
                <h2 className="font-semibold text-xl">{selectedChat.name}</h2>
                <div className="text-center text-gray-600">
                  <p>Online</p>
                  <p className="mt-2">Joined 2023</p>
                </div>
                <div className="w-full pt-4 border-t mt-4">
                  <h3 className="font-semibold mb-2">Shared Media</h3>
                  <div className="grid grid-cols-3 gap-2">
                    {[1, 2, 3].map((i) => (
                      <div
                        key={i}
                        className="aspect-square bg-gray-200 rounded"
                      ></div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
            <div className="p-4 lg:rounded-md bg-white space-y-2">
              <button
                onClick={handleBlock}
                className="w-full flex items-center justify-center space-x-2 py-2 px-4 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition-colors"
              >
                <BiBlock size={20} />
                <span>Block User</span>
              </button>
              <button
                onClick={handleLogout}
                className="w-full flex items-center justify-center space-x-2 py-2 px-4 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
              >
                <FiLogOut size={20} />
                <span>Logout</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MainPage;
