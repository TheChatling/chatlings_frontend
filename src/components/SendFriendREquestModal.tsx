import React, { useState } from "react";
import { FaAngleRight } from "react-icons/fa6";
import { setIsSendingFriendRequest } from "@/features/user/userSlice";
import { useDispatch, useSelector } from "react-redux";
import { ReduxUserState } from "@/dataTypes";
import createAlert from "@/utils/createAlert";
import { io } from "socket.io-client";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
const socket = io(process.env.NEXT_PUBLIC_API_URL);

const SendFriendRequestModal = () => {
  const dispatch = useDispatch();
  const [friendName, setFriendName] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const user = useSelector((state: ReduxUserState) => state.userData.user);

  const handleAddingFriend = async () => {
    if (!user) return;
    setIsLoading(true);
    if (!friendName) {
      createAlert(
        dispatch,
        "The username can be at least 4 letters long",
        "red"
      );
      setIsLoading(false);
      return;
    }
    if (user.friends.find((item) => item.name === friendName)) {
      createAlert(dispatch, "The user is already in your friends list", "red");
      setIsLoading(false);
      return;
    }

    socket.emit(
      "send_friend_request",
      {
        friendName,
        userId: user._id,
        userName: user.name,
      },
      (response: { success: boolean; message: string }) => {
        if (!response.success) {
          createAlert(dispatch, response.message, "red");
          setIsLoading(false);
          return;
        }
        createAlert(dispatch, response.message, "green");
        setIsLoading(false);
        dispatch(setIsSendingFriendRequest(false));
      }
    );
  };
  return (
    <div className="absolute top-0 left-0 right-0 bottom-0 flex items-center justify-center z-30">
      <div className=" w-80 h-44 bg-black rounded-lg flex flex-col items-center justify-between p-8 relative">
        <h2 className="text-lg text-gray-200 font-bold">
          Send A Friend Request
        </h2>
        <div
          onClick={() => {
            dispatch(setIsSendingFriendRequest(false));
          }}
          className="absolute top-2 right-2 cursor-pointer opacity-75 hover:opacity-100 transition"
        >
          <FaAngleRight className="w-8 h-8" />
        </div>

        <div>
          <div className="flex">
            <input
              type="text"
              placeholder="Friend's Name"
              value={friendName}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  handleAddingFriend();
                }
              }}
              onChange={(e) => {
                setFriendName(e.target.value);
              }}
              className="m-0 mr-2 bg-transparent border-t-0 border-r-0 border-l-0 rounded-none border-gray-300 border-b-2"
            />
            <button
              onClick={handleAddingFriend}
              className="bg-sky-500 py-1 px-2 rounded-md hover:bg-sky-600 transition disabled:bg-sky-600"
              disabled={isLoading}
            >
              {isLoading ? (
                <AiOutlineLoading3Quarters className="animate-spin w-5 h-5 mx-1" />
              ) : (
                "Add"
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SendFriendRequestModal;
