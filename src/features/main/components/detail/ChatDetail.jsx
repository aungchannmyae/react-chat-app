import React from "react";
import { BiBlock } from "react-icons/bi";
import { FiLogOut } from "react-icons/fi";
import useUserStore from "../../../../lib/userStore";
import useChatStore from "../../../../lib/chatStore";
import { arrayRemove, arrayUnion, doc, updateDoc } from "firebase/firestore";
import { db } from "../../../../lib/firebase";

const ChatDetail = () => {
  const { currentUser } = useUserStore();
  const { chatId, user, isCurrentUserBlocked, isReceiverBlocked, changeBlock } =
    useChatStore();

  const handleLogout = () => {
    navigation("/login");
    auth.signOut();
    // Add your logout logic here
  };

  const handleBlock = async () => {
    if (!user) return;

    const userDocRef = doc(db, "users", currentUser.id);

    try {
      await updateDoc(userDocRef, {
        blocked: isReceiverBlocked ? arrayRemove(user.id) : arrayUnion(user.id),
      });
      changeBlock();
    } catch (err) {
      console.log(err);
    }
  };
  return (
    <>
      <div className="h-full flex flex-col gap-2">
        <div className="flex-1 p-4 lg:rounded-md bg-white">
          <div className="flex flex-col items-center space-y-4">
            <div className="w-24 h-24 rounded-full bg-gray-300"></div>
            <h2 className="font-semibold text-xl">{user?.username}</h2>
            <div className="text-center text-gray-600">
              <p></p>
              <p className="mt-2"></p>
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
            <span>
              {isCurrentUserBlocked
                ? "You are Blocked!"
                : isReceiverBlocked
                ? "User blocked"
                : "Block User"}
            </span>
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
    </>
  );
};

export default ChatDetail;
