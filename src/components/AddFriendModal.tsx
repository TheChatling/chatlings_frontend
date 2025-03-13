import { ReduxUserState } from "@/dataTypes";
import {
  addFriend,
  removeFriendRequest,
  setIsAddingFriend,
} from "@/features/user/userSlice";
import React, { useState } from "react";
import { FaAngleRight } from "react-icons/fa6";
import { useDispatch, useSelector } from "react-redux";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { io } from "socket.io-client";
import createAlert from "@/utils/createAlert";
import apiClient from "@/utils/api";
const socket = io(process.env.NEXT_PUBLIC_API_URL);

const AddFriendModal = () => {
  const user = useSelector((state: ReduxUserState) => state.userData.user);
  const dispatch = useDispatch();
  const [loading, setLoading] = useState({ isLoading: false, state: "" });
  const handleAccept = (friendId: string, friendName: string) => {
    if (!user) return;
    setLoading({ isLoading: true, state: "accept" });
    socket.emit(
      "accept_friend_request",
      { userId: user._id, friendId },
      (response: { success: boolean; message: string }) => {
        if (!response.success) {
          createAlert(dispatch, response.message, "red");
          setLoading({ isLoading: false, state: "" });
          return;
        }
        dispatch(addFriend({ name: friendName, _id: friendId }));
        dispatch(removeFriendRequest({ friendId }));
        setLoading({ isLoading: false, state: "" });
      }
    );
  };
  const handleReject = async (friendId: string) => {
    try {
      setLoading({ isLoading: true, state: "reject" });
      await apiClient.post("/deny_friend_request", {
        id: friendId,
      });
      dispatch(removeFriendRequest({ friendId }));
      setLoading({ isLoading: false, state: "" });
    } catch {
      setLoading({ isLoading: false, state: "" });
      createAlert(dispatch, "There was an error please try again later", "red");
    }
  };

  if (!user)
    return (
      <div className="flex items-center justify-center absolute top-0 left-0 right-0 bottom-0 z-40">
        <div className="w-72 min-h-96 h-[90%] md:w-80 lg:w-96 bg-black flex justify-center items-center relative">
          <div className="absolute top-2 left-6 right-2 flex items-center justify-between">
            <h2 className="font-semibold text-lg text-gray-300">
              Friend Requests
            </h2>
            <div
              onClick={() => {
                dispatch(setIsAddingFriend(false));
              }}
              className="cursor-pointer opacity-75 hover:opacity-100 transition"
            >
              <FaAngleRight className="w-8 h-8" />
            </div>
          </div>
          <AiOutlineLoading3Quarters className="animate-spin w-12 h-12" />
        </div>
      </div>
    );
  if (user.friend_requests.length <= 0)
    return (
      <div className="flex items-center justify-center absolute top-0 left-0 right-0 bottom-0 z-40">
        <div className="px-2 w-72 min-h-96 h-[90%] md:w-80 lg:w-96 bg-black flex justify-center items-center relative">
          <div className="absolute top-2 left-6 right-2 flex items-center justify-between">
            <h2 className="font-semibold text-lg text-gray-300">
              Friend Requests
            </h2>
            <div
              onClick={() => {
                dispatch(setIsAddingFriend(false));
              }}
              className="cursor-pointer opacity-75 hover:opacity-100 transition"
            >
              <FaAngleRight className="w-8 h-8" />
            </div>
          </div>
          <h2 className="text-gray-400 text-center">
            You dont have any friends requests
          </h2>
        </div>
      </div>
    );
  return (
    <div className="flex items-center justify-center absolute top-0 left-0 right-0 bottom-0 z-40">
      <div className=" w-72 min-h-96 h-[90%] md:w-80 lg:w-96 bg-black flex flex-col justify-start items-center pt-16 relative">
        <div className="absolute top-2 left-6 right-2 flex items-center justify-between">
          <h2 className="font-semibold text-lg text-gray-300">
            Friend Requests
          </h2>
          <div
            onClick={() => {
              dispatch(setIsAddingFriend(false));
            }}
            className="cursor-pointer opacity-75 hover:opacity-100 transition"
          >
            <FaAngleRight className="w-8 h-8" />
          </div>
        </div>
        {user.friend_requests.map((item) => (
          <div
            key={item._id}
            className="w-[90%] bg-slate-600 py-4 px-3 rounded-sm mb-3 flex items-center justify-between"
          >
            <h2>{item.name}</h2>
            <div className="flex">
              <button
                onClick={() => handleAccept(item._id, item.name)}
                disabled={loading.isLoading}
                className="bg-white text-black disabled:bg-opacity-50 bg-opacity-85 py-1 px-2 rounded-sm mx-1 hover:bg-opacity-100 transition"
              >
                {loading.state === "accept" ? (
                  <AiOutlineLoading3Quarters className="animate-spin w-5 h-5 mx-3" />
                ) : (
                  "Accept"
                )}
              </button>
              <button
                onClick={() => handleReject(item._id)}
                disabled={loading.isLoading}
                className="border-2 border-gray-300 py-1 disabled:bg-opacity-50 disabled:hover:text-gray-200 disabled:hover:border-gray-300 px-2 rounded-sm mx-1 hover:border-white hover:text-white transition"
              >
                {loading.state === "reject" ? (
                  <AiOutlineLoading3Quarters className="animate-spin w-5 h-5 mx-3" />
                ) : (
                  "Cancel"
                )}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AddFriendModal;
