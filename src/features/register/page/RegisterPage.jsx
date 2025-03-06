import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { BiPencil } from "react-icons/bi";
import { toast } from "react-toastify";
import { auth, db } from "../../../lib/firebase";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";

const RegisterPage = () => {
  const [loading, setLoading] = useState(false);
  const navigation = useNavigate();
  // const [formData, setFormData] = useState({
  //   email: "",
  //   password: "",
  //   image: null,
  // });
  // const [previewImage, setPreviewImage] = useState(null);

  const handleChange = (e) => {
    e.preventDefault();
  };

  // const handleImageChange = (e) => {
  //   const file = e.target.files[0];
  //   if (file) {
  //     setFormData({
  //       ...formData,
  //       image: file,
  //     });
  //     setPreviewImage(URL.createObjectURL(file));
  //   }
  // };

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData(e.target);
    const { username, email, password } = Object.fromEntries(formData);

    try {
      // Firstly Registration
      const res = await createUserWithEmailAndPassword(auth, email, password);

      //Then add 2data to database
      await setDoc(doc(db, "users", res.user.uid), {
        username,
        email,
        id: res.user.uid,
        blocked: [],
      });

      await setDoc(doc(db, "userchats", res.user.uid), {
        chats: [],
      });

      toast.success("Account created successfully! You can login Now!");
      navigation("/login");
    } catch (err) {
      console.log(err);
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
    // Handle register logic here
  };

  return (
    <div className="min-h-screen bg-stone-300 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900">Register</h1>
          <Link
            to="/login"
            className="text-blue-600 hover:text-blue-700 font-medium transition-colors"
          >
            Login
          </Link>
        </div>

        <form onSubmit={handleRegister} className="space-y-6">
          <div className="flex flex-col items-center">
            <div className="relative">
              {/* <div className="w-32 h-32 rounded-full border-2 border-gray-300 overflow-hidden">
                {previewImage ? (
                  <img
                    src={previewImage}
                    alt="Profile"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                    <span className="text-gray-400">No image</span>
                  </div>
                )}
              </div> */}
              {/* Avatar Image Uploader  */}
              {/* <label
                htmlFor="image-upload"
                className="absolute bottom-0 right-0 bg-blue-600 text-white p-2 rounded-full cursor-pointer hover:bg-blue-700 transition-colors"
              >
                <BiPencil size={16} />
                <input
                  type="file"
                  id="image-upload"
                  name="image"
                  onChange={handleImageChange}
                  className="hidden"
                  accept="image/*"
                />
              </label> */}
            </div>
          </div>

          <div>
            <label
              htmlFor="username"
              className="block text-sm font-medium text-gray-700"
            >
              UserName
            </label>
            <input
              type="username"
              id="username"
              name="username"
              // value={formData.username}
              // onChange={handleChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              placeholder="Enter your username"
              required
            />
          </div>

          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700"
            >
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              // value={formData.email}
              // onChange={handleChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              placeholder="Enter your email"
              required
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700"
            >
              Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              // value={formData.password}
              // onChange={handleChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              placeholder="Enter your password"
              required
            />
          </div>

          <button
            disabled={loading}
            type="submit"
            className=" disabled:pointer-events-none disabled:bg-blue-950 w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
          >
            {loading ? "Loading..." : "Register"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default RegisterPage;
