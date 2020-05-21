import Chat from '../../models/chat';
import {SET_CHATS, SEND_MESSAGE, CREATE_CHAT} from '../actions/chat';

const initialState = {
  chats: [],
};

export default (state = initialState, action) => {
  switch (action.type) {
    case SET_CHATS:
      return {
        ...state,
        chats: action.chats,
      };
    case CREATE_CHAT:
      const newChat = new Chat(
        action.chatData.id,
        action.chatData.users,
        action.chatData.messages,
        action.chatData.date
      );
      return {
        chats: state.chats.concat(newChat),
      };
    case SEND_MESSAGE:
      // action.chat
      const chat = action.chat;
      const chatIndex = state.chats.findIndex(
        (chat) => chat.id === action.chat.id
      );

      const updatedChats = [...state.chats];
      updatedChats[chatIndex] = chat;
      return {
        chats: updatedChats,
      };
    default:
      return state;
  }
};
