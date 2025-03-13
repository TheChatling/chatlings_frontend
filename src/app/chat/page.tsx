"use client";
import AuthWrapper from "@/components/AuthWrapper";
import React from "react";
import { useSelector } from "react-redux";
import { ReduxUserState } from "@/dataTypes";
import Dashboard from "@/components/Dashboard";
import SendFriendREquestModal from "@/components/SendFriendREquestModal";
import Chatbox from "@/components/Chatbox";
import AddFriendModal from "@/components/AddFriendModal";

const Chat = () => {
  const isSendingFriendRequest = useSelector(
    (state: ReduxUserState) => state.userData.isSendingFriendRequest
  );
  const isAddingFriend = useSelector(
    (state: ReduxUserState) => state.userData.isAddingFriend
  );
  return (
    <AuthWrapper>
      {isSendingFriendRequest && <SendFriendREquestModal />}
      {isAddingFriend && <AddFriendModal />}
      <div
        className={`flex w-full h-screen ${
          (isSendingFriendRequest || isAddingFriend) && "blur-md"
        } max-w-screen-2xl mx-auto`}
      >
        <Dashboard />
        {/* chatbox */}
        <Chatbox />
      </div>
    </AuthWrapper>
  );
};

export default Chat;
