import { ReduxUserState } from "@/dataTypes";
import React, { useState } from "react";
import { FaBars, FaPlus } from "react-icons/fa6";
import {
  setIsAddingFriend,
  setRoom,
  setInRoomWith,
  setIsSendingFriendRequest,
  removeFriend,
  logoutUser,
} from "@/features/user/userSlice";
import { useDispatch, useSelector } from "react-redux";
import apiClient from "@/utils/api";
import { IoMdSettings } from "react-icons/io";
import { io } from "socket.io-client";
import createAlert from "@/utils/createAlert";
import { useRouter } from "next/navigation";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
const socket = io(process.env.NEXT_PUBLIC_API_URL);

const Dashboard = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  const user = useSelector((state: ReduxUserState) => state.userData.user);
  const inRoomWith = useSelector(
    (state: ReduxUserState) => state.userData.inRoomWith
  );

  const [friendOptions, setFriendOptions] = useState("");
  const [isUserOptions, setIsUserOptions] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [removingFriend, setRemovingFriend] = useState("");

  const handleChangeRoom = (id: string, room: string) => {
    if (user) {
      dispatch(setRoom(room));
      dispatch(setInRoomWith(id));
    }
  };
  const handleRemoveFriend = (friendId: string) => {
    if (!user) return;
    setRemovingFriend(friendId);
    socket.emit(
      "remove_friend",
      { friendId, userId: user._id },
      (response: { success: boolean; message: string }) => {
        if (!response.success) {
          setRemovingFriend("");
          createAlert(dispatch, response.message, "red");
          return;
        }
        setRemovingFriend("");
        createAlert(dispatch, response.message, "green");
        dispatch(removeFriend({ friendId }));
      }
    );
  };

  const handleLogout = async () => {
    try {
      setIsLoading(true);
      await apiClient.get("/logout");
      dispatch(logoutUser());

      router.push("/");
      setIsLoading(false);
    } catch {
      setIsLoading(false);
      createAlert(
        dispatch,
        "There was an error while logging out please try again later",
        "red"
      );
    }
  };
  if (!user) return;
  return (
    <div className="h-full w-1/4 bg-gray-700/30">
      <div className="flex items-center h-1/6 bg-gray-600/80 px-4 my-2 relative">
        {isUserOptions && (
          <div className="absolute top-10 left-10 flex flex-col items-center justify-center text-sm z-20 bg-gray-900 rounded-lg w-20">
            <button
              disabled={isLoading}
              onClick={(e) => {
                e.stopPropagation();

                handleLogout();
              }}
              className="w-full disabled:bg-sky-600 disabled:cursor-default py-1 hover:bg-sky-500 transition text-center cursor-pointer"
            >
              {isLoading ? (
                <AiOutlineLoading3Quarters className="mx-auto h-5 w-5 animate-spin" />
              ) : (
                "Logout"
              )}
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                setIsUserOptions(false);
              }}
              className="w-full py-1 hover:bg-sky-500 transition text-center cursor-pointer"
            >
              Cancel
            </button>
          </div>
        )}
        <div
          onClick={(e) => {
            e.stopPropagation();
            setIsUserOptions(!isUserOptions);
          }}
          className="w-14 h-14 group cursor-pointer hover:bg-sky-800 transition rounded-full border border-black border-opacity-15 bg-blue-600 bg-opacity-75 text-center items-center justify-center flex text-white text-3xl font-bold mr-2 relative"
        >
          <IoMdSettings className="absolute transition left-3 right-0 top-3 bottom-0 opacity-0 group-hover:opacity-100" />
          <h2 className="group-hover:opacity-0 transition">{user.name[0]}</h2>
        </div>
        <h2 className="lg:text-lg">{user.name}</h2>
      </div>
      <div className="px-3 text-lg overflow-y-scroll custom-scrollbar h-4/6">
        {user.friends.map((item) => {
          return (
            <div
              onClick={() => handleChangeRoom(item._id, item.room)}
              key={item._id}
              className={`${
                inRoomWith === item._id ? "bg-sky-600" : "hover:bg-sky-800"
              } border-b-2 border-gray-400 w-full h-16 flex items-center cursor-pointer relative`}
            >
              {friendOptions === item._id && (
                <div className="absolute top-5 left-5 flex flex-col items-center justify-center text-sm z-20 bg-gray-900 rounded-lg w-20">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleChangeRoom(item._id, item.room);
                      setFriendOptions("");
                    }}
                    className="w-full py-1 hover:bg-sky-500 transition text-center cursor-pointer"
                  >
                    Chat
                  </button>
                  <button
                    disabled={removingFriend.length > 0}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleRemoveFriend(item._id);
                      setFriendOptions("");
                    }}
                    className="w-full py-1 hover:bg-sky-500 disabled:cursor-default disabled:bg-sky-600 transition text-center cursor-pointer"
                  >
                    {removingFriend === item._id ? (
                      <AiOutlineLoading3Quarters className="w-5 h-5 mx-auto animate-spin" />
                    ) : (
                      "Remove"
                    )}
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setFriendOptions("");
                    }}
                    className="w-full py-1 hover:bg-sky-500 transition text-center cursor-pointer"
                  >
                    Cancel
                  </button>
                </div>
              )}

              <div
                onClick={(e) => {
                  e.stopPropagation();
                  setFriendOptions(item._id);
                }}
                className="w-10 h-10 hover:bg-sky-800 group rounded-full border border-black border-opacity-15 bg-blue-600 bg-opacity-75 text-center items-center justify-center flex text-white text-2xl font-bold mr-2 relative"
              >
                <h2 className="group-hover:opacity-0 transition">
                  {item.name[0]}
                </h2>

                <IoMdSettings className="absolute transition left-2 right-0 top-2 bottom-0 opacity-0 group-hover:opacity-100" />
              </div>
              <div>{item.name}</div>
              {item.newMessages > 0 && (
                <div className="absolute font-semibold top-2 right-2 bg-red-600 rounded-full p-1 w-6 h-6 text-center flex items-center justify-center text-sm">
                  {item.newMessages > 99 ? "99+" : item.newMessages}
                </div>
              )}
            </div>
          );
        })}
        <div className="text-center font-bold text-3xl flex items-center justify-center">
          <button
            onClick={() => dispatch(setIsSendingFriendRequest(true))}
            className="mx-2 text-base p-1 border-4 border-gray-200 opacity-60 rounded-lg hover:opacity-100 transition my-4 w-full h-12 items-center justify-center flex"
          >
            <FaPlus className="w-6 h-6" />
          </button>
        </div>
      </div>
      <div
        onClick={() => dispatch(setIsAddingFriend(true))}
        className="w-full py-5 border-t-2 border-b-2 border-gray-200 flex items-center px-2 cursor-pointer hover:bg-sky-700 transition relative"
      >
        <FaBars className="mr-2 w-6 h-6" /> Friend Requests
        {user.friend_requests.length > 0 && (
          <div className="absolute font-semibold top-2 right-2 bg-red-600 rounded-full p-1 w-6 h-6 text-center flex items-center justify-center text-sm">
            {user.friend_requests.length > 99
              ? "99+"
              : user.friend_requests.length}
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
