import Chat from '../../models/chat';
import {useSelector} from 'react-redux';

export const SET_CHATS = 'SET_CHATS';
export const CREATE_CHAT = 'CREATE_CHAT';
export const SEND_MESSAGE = 'SEND_MESSAGE';

export const fetchChats = () => {
  return async (dispatch, getState) => {
    const userId = getState().auth.userId;
    const token = getState().auth.token;
    try {
      const response = await fetch(
        `https://rn-testing-app.firebaseio.com/chats.json?auth=${token}`
      );

      if (!response.ok) {
        throw new Error('Something went wrong fecthing Chats!');
      }

      const resData = await response.json();
      const loadedChats = [];

      for (const key in resData) {
        loadedChats.push(
          new Chat(
            key, //resData.name
            resData[key].users,
            resData[key].messages,
            resData[key].date
          )
        );
      }
      let userChats = [];
      if (loadedChats.length !== 0) {
        loadedChats.filter((chat) => {
          for (let key in chat.users) {
            if (chat.users[key] === userId) {
              userChats.push(chat);
            }
          }
        });
      }
      // let filteredChats = loadedChats.filter(chat => chat)
      dispatch({type: SET_CHATS, chats: userChats});
    } catch (error) {
      throw error;
    }
  };
};

export const createChat = (users, messages, date) => {
  return async (dispatch, getState) => {
    const token = getState().auth.token;
    try {
      const response = await fetch(
        `https://rn-testing-app.firebaseio.com/chats.json?auth=${token}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            users: users,
            messages: messages,
            date: date,
          }),
        }
      );

      if (!response.ok) {
        throw new Error('Something went wrong Creating chat with this user!');
      }

      const resData = await response.json();

      dispatch({
        type: CREATE_CHAT,
        chatData: {
          id: resData.name,
          users: users,
          messages: messages,
          date: date,
        },
      });
    } catch (error) {
      throw error;
    }
  };
};

export const sendMessage = (chat) => {
  return async (dispatch, getState) => {
    const userId = getState().auth.userId;
    const token = getState().auth.token;
    try {
      const response = await fetch(
        `https://rn-testing-app.firebaseio.com/chats/${chat.id}.json?auth=${token}`,
        {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            users: chat.users,
            messages: chat.messages,
            date: chat.date,
          }),
        }
      );

      if (!response.ok) {
        throw new Error('Something went wrong sending message!');
      }

      const resData = await response.json();

      dispatch({type: SEND_MESSAGE, chat: chat});
    } catch (error) {
      throw error;
    }
  };
};
