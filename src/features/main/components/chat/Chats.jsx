import EmojiPicker from "emoji-picker-react";
import {
  arrayUnion,
  doc,
  getDoc,
  onSnapshot,
  updateDoc,
} from "firebase/firestore";
import React, { useCallback, useEffect, useState } from "react";
import { BiDotsVerticalRounded, BiSend } from "react-icons/bi";
import { BsEmojiSmile } from "react-icons/bs";
import { IoImageOutline } from "react-icons/io5";
import { db } from "../../../../lib/firebase";
import useChatStore from "../../../../lib/chatStore";
import useUserStore from "../../../../lib/userStore";

const Chats = ({ showChatDetails, setShowChatDetails }) => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [chats, setChats] = useState([]);
  const [text, setText] = useState("");
  const [img, setImg] = useState({
    file: null,
    url: "",
  });

  const { currentUser } = useUserStore();
  const { chatId, user, isCurrentUserBlocked, isReceiverBlocked } = useChatStore();

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
    setText((prevMessage) => prevMessage + emojiObject.emoji);
  }, []);

  const handleImg = (e) => {
    if (e.target.files[0]) {
      setImg({
        file: e.target.files[0],
        url: URL.createObjectURL(e.target.files[0]),
      });
    }
  };

  const handleSend = async () => {
    if (text === "") return;

    try {
      await updateDoc(doc(db, "chats", chatId), {
        messages: arrayUnion({
          senderId: currentUser.id,
          text,
          createdAt: new Date(),
        }),
      });
      const userIDs = [currentUser.id, user.id];
      userIDs.forEach(async (id) => {
        const userChatsRef = doc(db, "userchats", id);
        const userChatsSnapShot = await getDoc(userChatsRef);

        if (userChatsSnapShot.exists()) {
          const userChatData = userChatsSnapShot.data();

          const chatIndex = userChatData.chats.findIndex(
            (chat) => chat.chatId === chatId
          );

          userChatData.chats[chatIndex].lastMessage = text;
          userChatData.chats[chatIndex].isSeen =
            id === currentUser.id ? true : false;
          userChatData.chats[chatIndex].updatedAt = Date.now();

          await updateDoc(userChatsRef, {
            chats: userChatData.chats,
          });
        }
      });
    } catch (err) {
      console.log(err);
    } finally {
      setText("");
    }
  };

  //chats
  useEffect(() => {
    if (chatId) {
      const unSub = onSnapshot(doc(db, "chats", chatId), (res) => {
        setChats(res.data());
      });

      return () => {
        unSub();
      };
    }
  }, [chatId]);

  return (
    <>
      <div className="md:rounded-md overflow-hidden flex-1 flex flex-col bg-white">
        <>
          <div className="p-4 border-b flex justify-between items-center">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-full bg-gray-300"></div>
              <h2 className="font-semibold">{user?.username}</h2>
            </div>
            <button
              onClick={() => setShowChatDetails(!showChatDetails)}
              className=" p-2 hover:bg-gray-100 rounded-full"
            >
              <BiDotsVerticalRounded size={24} className="text-gray-600" />
            </button>
          </div>
          <div className="flex-1 overflow-y-auto p-4 space-y-4 scroll-smooth">
            {chats?.messages?.map((message) => (
              <div key={message?.createdAt} className={`flex ${message.senderId === currentUser?.id ? 'justify-end' : ' justify-start'} `}>
                <div className={`${message.senderId === currentUser?.id ? 'bg-blue-600' : ' bg-gray-600'} text-white rounded-lg p-3 max-w-xs`}>
                  {message.text}
                </div>
              </div>
            ))}
          </div>
          <div className="p-4 bg-gray-100 relative mt-auto">
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
                    onChange={handleImg}
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
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder={
                  isCurrentUserBlocked || isReceiverBlocked
                    ? "You cannot send a message"
                    : "Type a message..."
                }
                disabled={isCurrentUserBlocked || isReceiverBlocked}
                className="flex-1 px-4 py-2 border rounded-full focus:outline-none focus:border-blue-500"
              />
              <button
                onClick={handleSend}
                className="text-white rounded-full hover:animate-pulse"
              >
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
      </div>
    </>
  );
};

export default Chats;
