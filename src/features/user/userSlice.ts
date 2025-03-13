import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { ApiUserType, messageType, UserType } from "@/dataTypes";
import apiClient from "@/utils/api";
type State = {
  user: UserType | null;
  isAddingFriend: boolean;
  isSendingFriendRequest: boolean;
  room: string;
  inRoomWith: string;
};

export const fetchUserAsync = createAsyncThunk("user/fetchUser", async () => {
  const response = await apiClient.get("/user");
  const userData: ApiUserType = response.data;

  // make another api request to get the messages
  const MessagesData: messageType[] = [];
  const friends = userData.friends.map((item) => {
    const ids = [userData._id, item._id];
    const room = ids.sort().toString();

    // get the messages that are from the friend and in the same room that their status is not seen
    const newMessages = MessagesData.filter((message) => {
      if (
        message.room === room &&
        message.sender === item._id &&
        message.status !== "seen"
      )
        return item;
    });
    return { ...item, room, newMessages: newMessages.length };
  });
  const user = { ...userData, friends };
  return user;
});

const initialState: State = {
  user: null,
  isSendingFriendRequest: false,
  isAddingFriend: false,
  room: "",
  inRoomWith: "",
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUser: (state, action) => {
      state.user = action.payload;
    },
    setIsAddingFriend: (state, action) => {
      state.isAddingFriend = action.payload;
    },
    setIsSendingFriendRequest: (state, action) => {
      state.isSendingFriendRequest = action.payload;
    },
    addFriend: (state, action) => {
      if (!state.user) return;
      const { name, _id } = action.payload;
      const ids = [state.user._id, _id];
      const room = ids.sort().toString();
      state.user.friends = [
        ...state.user.friends,
        { name, _id, room, newMessages: 0 },
      ];
    },
    setRoom: (state, action) => {
      state.room = action.payload;
    },
    setInRoomWith: (state, action) => {
      state.inRoomWith = action.payload;
    },
    setFriendsNewMessages: (state, action) => {
      if (!state.user) return;

      const { messageList } = action.payload;

      const newFriends = state.user.friends.map((item) => {
        const newMessagesCount = messageList.filter((element: messageType) => {
          return element.sender === item._id && element.status !== "seen";
        }).length;
        return { ...item, newMessages: newMessagesCount };
      });
      state.user.friends = newFriends;
    },
    addFriendRequest: (state, action) => {
      if (!state.user) return;
      const { friendId, friendName } = action.payload;
      state.user.friend_requests = [
        ...state.user.friend_requests,
        { _id: friendId, name: friendName },
      ];
    },
    removeFriendRequest: (state, action) => {
      if (!state.user) return;
      const { friendId } = action.payload;
      state.user.friend_requests = state.user.friend_requests.filter(
        (item) => item._id !== friendId
      );
    },
    removeFriend: (state, action) => {
      if (!state.user) return;
      const { friendId } = action.payload;

      if (!state.user.friends.find((item) => item._id === friendId)) return;
      state.user.friends = state.user.friends.filter(
        (item) => item._id !== friendId
      );
      const ids = [state.user._id, friendId];
      const room = ids.sort().toString();
      if (state.room === room) {
        state.room = "";
        state.inRoomWith = "";
      }
    },

    logoutUser: (state) => {
      state.user = null;
      state.isSendingFriendRequest = false;
      state.isAddingFriend = false;
      state.room = "";
      state.inRoomWith = "";
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchUserAsync.fulfilled, (state, action) => {
      state.user = action.payload;
    });
    builder.addCase(fetchUserAsync.rejected, (state) => {
      state.user = null;
    });
  },
});

export default userSlice.reducer;
export const {
  setUser,
  setIsAddingFriend,
  addFriend,
  setRoom,
  setInRoomWith,
  setFriendsNewMessages,
  addFriendRequest,
  setIsSendingFriendRequest,
  removeFriendRequest,
  removeFriend,
  logoutUser,
} = userSlice.actions;
