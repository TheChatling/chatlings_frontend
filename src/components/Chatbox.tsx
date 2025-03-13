import { messageType, ReduxUserState } from "@/dataTypes";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { io } from "socket.io-client";
import { FaAngleRight } from "react-icons/fa6";
import {
  addFriend,
  addFriendRequest,
  removeFriend,
  setFriendsNewMessages,
} from "@/features/user/userSlice";
import apiClient from "@/utils/api";
import { AiOutlineLoading3Quarters } from "react-icons/ai";

const socket = io(process.env.NEXT_PUBLIC_API_URL);

const Chatbox = () => {
  const user = useSelector((state: ReduxUserState) => state.userData.user);
  const userID = useSelector(
    (state: ReduxUserState) => state.userData.user?._id
  );
  const currentRoom = useSelector(
    (state: ReduxUserState) => state.userData.room
  );
  const dispatch = useDispatch();
  //chatbox functionality
  const ref = useRef<HTMLDivElement | null>(null);
  const [message, setMessage] = useState("");
  const [messageList, setMessageList] = useState<messageType[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // handling sending messages
  const handleSendMessage = () => {
    if (user && message) {
      const friend = user.friends.find((item) => item.room === currentRoom);
      if (!friend) return;
      const date = Date.now();
      socket.emit("send_message", {
        room: currentRoom,
        sender: user._id,
        recipient: friend._id,
        status: "sent",
        date,
        message,
      });
      setMessageList((prev) => [
        ...prev,
        {
          room: currentRoom,
          sender: user._id,
          date,
          message,
          status: "sent",
          recipient: friend._id,
        },
      ]);
      setMessage("");
    }
  };

  // handling receiving messages and updates
  const handleReceiveMessage = useCallback(
    (room: string, sender: string, date: number, message: string) => {
      if (!user) return;
      if (currentRoom === room) {
        setMessageList((prev) => [
          ...prev,
          { message, sender, room, status: "seen", date, recipient: user._id },
        ]);
        if (user && currentRoom) {
          socket.emit("send_update", { room: currentRoom, userId: user._id });
        }
        return;
      }
      setMessageList((prev) => [
        ...prev,
        {
          message,
          sender,
          room,
          status: "received",
          date,
          recipient: user._id,
        },
      ]);
    },
    [currentRoom, user]
  );
  const handleReceiveUpdate = useCallback((room: string, userId: string) => {
    setMessageList((prev) =>
      prev.map((item) => {
        if (room === item.room && item.sender !== userId)
          return { ...item, status: "seen" };
        return item;
      })
    );
  }, []);

  const handleReceiveFriendRequest = useCallback(
    (friendId: string, friendName: string) => {
      dispatch(addFriendRequest({ friendId, friendName }));
    },
    [dispatch]
  );
  const handelAddFriend = useCallback(
    ({ name, _id }: { name: string; _id: string }) => {
      dispatch(addFriend({ name, _id }));
    },
    [dispatch]
  );

  const handelRemoveFriendUpdate = useCallback(
    (friendId: string) => {
      console.log("receieved a friend remove update");
      dispatch(removeFriend({ friendId }));
    },
    [dispatch]
  );
  useEffect(() => {
    if (!userID) return;
    const getMessages = async () => {
      try {
        setIsLoading(true);
        const response = await apiClient.post("/messages", { id: userID });
        if (response.data.messages) {
          console.log(response.data.messages);
          setMessageList(response.data.messages);
          setIsLoading(false);
        }
        setIsLoading(false);
      } catch {
        setIsLoading(false);
      }
    };
    getMessages();
  }, [userID]);
  useEffect(() => {
    if (user?.friends) {
      user.friends.map((item) => {
        socket.emit("join_room", { room: item.room });
      });
    }
  }, [user?.friends]);

  useEffect(() => {
    if (userID) {
      socket.emit("join_room", { room: userID });
    }
  }, [userID]);

  useEffect(() => {
    socket.on("receive_message", handleReceiveMessage);
    socket.on("receive_update", handleReceiveUpdate);
    socket.on("receive_friend_request", handleReceiveFriendRequest);
    socket.on("add_friend", handelAddFriend);
    socket.on("remove_friend_update", handelRemoveFriendUpdate);

    return () => {
      socket.off("receive_message");
      socket.off("receive_update");
      socket.off("receive_friend_request");
      socket.off("add_friend");
      socket.off("remove_friend_update");
    };
  }, [
    userID,
    handleReceiveMessage,
    handleReceiveUpdate,
    handleReceiveFriendRequest,
    handelAddFriend,
    handelRemoveFriendUpdate,
  ]);

  // automatic scrolling
  useEffect(() => {
    if (!userID) return;
    if (ref && ref.current && currentRoom && messageList.length > 0) {
      const lastMessage = messageList[messageList.length - 1];
      if (lastMessage.room === currentRoom)
        ref.current.scrollIntoView({ behavior: "smooth" });
    }
    dispatch(setFriendsNewMessages({ messageList }));
  }, [messageList, userID, dispatch, currentRoom]);

  useEffect(() => {
    if (ref && ref.current) {
      ref.current.scrollIntoView({ behavior: "instant" });
    }
  }, [ref, currentRoom, isLoading, userID]);

  // sending updates and updating status to both users
  useEffect(() => {
    if (!userID) return;

    socket.emit("send_update", { room: currentRoom, userId: userID });

    setMessageList((prev) =>
      prev.map((item) => {
        if (item.room === currentRoom && item.sender !== userID) {
          return { ...item, status: "seen" };
        }
        return item;
      })
    );
  }, [currentRoom, userID]);

  if (currentRoom.length <= 1)
    return (
      <div className="w-3/4 h-full flex flex-col px-10 items-center text-gray-300 text-lg justify-center text-center">
        <h2>Click on one of your friends to start talking!</h2>
      </div>
    );
  if (isLoading)
    return (
      <div className="w-3/4 h-full flex flex-col px-10 items-center text-gray-300 text-lg justify-center text-center">
        <AiOutlineLoading3Quarters className="w-12 h-12 animate-spin" />
      </div>
    );
  return (
    <div className="w-3/4 h-full flex flex-col relative px-5">
      <div className="w-full h-[80%] overflow-y-scroll mt-10 flex flex-col custom-scrollbar px-5">
        {messageList.map((item, index) => {
          const date = new Date(item.date);
          if (item.room === currentRoom && user)
            return (
              <div
                key={item.message + index}
                className={`${
                  item.sender === user._id ? "self-end" : "self-start "
                } mt-2 mb-5 relative`}
              >
                <div
                  className={`${
                    item.sender === user._id ? "bg-sky-600" : "bg-blue-800"
                  } h-auto w-auto max-w-52 sm:max-w-64 md:max-w-80 lg:max-w-96 md:text-base text-sm px-3 py-1 rounded-md my-2 break-words`}
                >
                  {item.message}
                </div>
                <div
                  className={`flex w-52 justify-between absolute -bottom-4 ${
                    item.sender === user._id ? "right-0" : "left-2"
                  }`}
                >
                  <h3 className="text-xs text-gray-400">
                    sent at {date.toLocaleString()}
                  </h3>
                  {item.sender === user._id && (
                    <h2
                      className={`${
                        item.status === "seen"
                          ? "text-sky-400"
                          : "text-gray-200"
                      } text-sm `}
                    >
                      {item.status}
                    </h2>
                  )}
                </div>
              </div>
            );
        })}
        <div ref={ref}></div>
      </div>
      <div
        onKeyDown={(e) => {
          if (e.key === "Enter") handleSendMessage();
        }}
        className="absolute -bottom-3 left-0 right-0 flex w-full h-12 items-center justify-center mb-10 z-20 bg-slate-800 px-10"
      >
        <input
          type="text"
          name="chat"
          id="chat"
          placeholder="Enter A Message"
          value={message}
          onChange={(e) => {
            setMessage(e.target.value);
          }}
          className="h-full m-0 text-gray-300 bg-slate-700"
        />
        <button
          onClick={handleSendMessage}
          className="bg-sky-400 text-black text-center hover:bg-sky-500 transition h-full flex items-center justify-items-center py-1 px-6 ml-2 rounded-md"
        >
          <FaAngleRight />
        </button>
      </div>
    </div>
  );
};

export default Chatbox;
