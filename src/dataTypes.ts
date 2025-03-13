export type UserType = {
  name: string;
  email: string;
  friends: { name: string; _id: string; room: string; newMessages: number }[];
  friend_requests: { name: string; _id: string }[];
  _id: string;
};
export type ApiUserType = {
  name: string;
  email: string;
  friends: { name: string; _id: string }[];
  friend_requests: { name: string; _id: string }[];
  _id: string;
};
export type ReduxUserState = {
  userData: {
    user: UserType | null;
    isAddingFriend: boolean;
    isSendingFriendRequest: boolean;
    room: string;
    inRoomWith: string;
  };
};
export type AlertType = {
  message: string;
  isVisible: boolean;
  state: string;
};
export type ReduxAlertState = {
  alertData: {
    alert: AlertType;
  };
};

export type messageType = {
  message: string;
  sender: string;
  room: string;
  status: string;
  date: number;
  recipient: string;
};
