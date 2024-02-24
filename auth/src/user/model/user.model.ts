

class User {
  id: number;
  createdAt: Date;
  updatedAt: Date;
  firstName: string;
  lastName: string;
  picture: string;
  coalition: string;
  coalitionPic: string;
  coalitionCover: string;
  coalitionColor: string;
  email: string;
  username?: string | null;
  friends: number[];
  adding: number[];
  added: number[];
  blocks: number[];
  blocking: number[];
  owner: Channel[];
  admin: Channel[];
  member: Channel[];
  invited: Channel[];
  chanBlocked: Channel[];
  Muted: Mute[];
  sendmessages: Msg[];
  receivedMessages: Msg[];
}

interface Channel {
  // Define properties for Channel
}

interface Mute {
  // Define properties for Mute
}

interface Msg {
  // Define properties for Msg
}

export default User;
