import React, { useState } from "react";
import { BiSearch } from "react-icons/bi";
import { HiX } from "react-icons/hi";
import { db } from "../../../../lib/firebase";
import { collection, getDocs, query, where } from "firebase/firestore";

const AddPopUp = ({ setShowAddPopup }) => {
  const [user, setUser] = useState(null);
  const handleSearch = async (e) => {
    e.preventDefault();

    const formData = new FormData(e.target);
    const username = formData.get("username");

    try {
      const userRef = collection(db, "users");

      const q = query(userRef, where("username", "==", username));

      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        setUser(querySnapshot.docs[0].data());
      }
      
    } catch (err) {
      console.log(err);
    }
    // Add your search logic here
  };

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold">Add New Chat</h3>
        <button
          onClick={() => setShowAddPopup(false)}
          className="p-1 hover:bg-gray-100 rounded-full"
        >
          <HiX size={20} className="text-gray-500" />
        </button>
      </div>
      <div className="space-y-4">
        <form onSubmit={handleSearch} className="relative">
          <input
            type="text"
            placeholder="Search username..."
            name="username"
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-blue-500"
          />
          <button
            type="submit"
            className=" duration-200 cursor-pointer active:bg-gray-100 hover:text-gray-600 absolute right-3 top-2.5 text-gray-400"
          >
            <BiSearch size={20} />
          </button>
        </form>
        <div className="max-h-60 overflow-y-auto">
          {user && (
            <div
              key={user}
              className="flex items-center space-x-3 p-2 hover:bg-gray-50 rounded-lg cursor-pointer"
            >
              <div className="w-10 h-10 rounded-full bg-gray-300"></div>
              <div>
                <h4 className="font-medium capitalize">{user.username}</h4>
                <p className="text-sm text-gray-500">{user.email}</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AddPopUp;
