import moment from 'moment';

import Post from '../../models/post';
import * as accountActions from './account';
import * as chatActions from './chat';

export const JOIN = 'JOIN';
export const CREATE = 'CREATE';
export const DELETE = 'DELETE';
export const UPDATE = 'UPDATE';
export const SEARCH = 'SEARCH';
export const SET_POSTS = 'SET_POSTS';

export const fetchPosts = () => {
  return async (dispatch, getState) => {
    const userId = getState().auth.userId;
    try {
      const response = await fetch(
        'https://rn-testing-app.firebaseio.com/posts.json'
      );

      if (!response.ok) {
        throw new Error('Something went wrong fecthing Posts!');
      }

      const resData = await response.json();
      const loadedPosts = [];

      for (const key in resData) {
        loadedPosts.push(
          new Post(
            key,
            resData[key].userId,
            resData[key].fromCity,
            resData[key].toCity,
            moment(resData[key].date).format('LL'),
            resData[key].maxPersons,
            resData[key].personsJoined,
            resData[key].fare,
            moment(resData[key].date).diff(moment(), 'days') > 0
              ? 'Open'
              : 'closed'
          )
        );
      }
      dispatch(accountActions.fetchAccounts());
      dispatch({
        type: SET_POSTS,
        posts: loadedPosts,
        userPosts: loadedPosts.filter((post) => post.userId === userId),
        hostedRides: loadedPosts.filter(
          (post) =>
            moment(post.date).diff(moment(), 'days') > 0 &&
            post.userId === userId
        ),
        hostedRidesHistory: loadedPosts.filter(
          (post) =>
            moment(post.date).diff(moment(), 'days') < 0 &&
            post.userId === userId
        ),
        bookedRides: loadedPosts.filter(
          (post) =>
            moment(post.date).diff(moment(), 'days') > 0 &&
            post.personsJoined.includes(userId) &&
            post.userId !== userId
        ),
      });

      dispatch(chatActions.fetchChats());
    } catch (error) {
      throw error;
    }
  };
};

export const createPost = (fromCity, toCity, maxPersons, fare, date) => {
  return async (dispatch, getState) => {
    let formattedDate = moment(date, 'DD-MM-YYYY').format('LL');
    const token = getState().auth.token;
    const userId = getState().auth.userId;
    const personsJoined = [userId];
    const status = 'ACTIVE';
    try {
      const response = await fetch(
        `https://rn-testing-app.firebaseio.com/posts.json?auth=${token}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            userId: userId,
            fromCity: fromCity,
            toCity: toCity,
            maxPersons: maxPersons,
            personsJoined: personsJoined,
            date: formattedDate,
            fare: fare,
            status: status,
          }),
        }
      );

      if (!response.ok) {
        throw new Error('Something went wrong while Creating new Post!');
      }

      const resData = await response.json();

      dispatch({
        type: CREATE,
        postData: {
          id: resData.name,
          userId: userId,
          fromCity: fromCity,
          toCity: toCity,
          date: formattedDate,
          maxPersons: maxPersons,
          personsJoined: personsJoined,
          fare: fare,
          status: status,
        },
      });
    } catch (err) {
      throw err;
    }
  };
};

export const updatePost = (id, fromCity, toCity, maxPersons) => {
  return async (dispatch, getState) => {
    // any async code you want!
    console.log('Edit dispatched in ACTIONS', fromCity);
    const token = getState().auth.token;
    const userId = getState().auth.userId;
    const response = await fetch(
      `https://rn-testing-app.firebaseio.com/posts/${id}.json?auth=${token}`,
      {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          fromCity,
          toCity,
          maxPersons,
          userId: userId,
        }),
      }
    );
    if (!response.ok) {
      throw new Error('Somthinge went Wrong while Updating!');
    }

    const resData = await response.json();

    dispatch({
      type: UPDATE,
      pid: id,
      postData: {
        userId: userId,
        fromCity,
        toCity,
        maxPersons,
      },
    });
  };
};

export const joinPool = (post) => {
  return async (dispatch, getState) => {
    // any async code you want!

    const token = getState().auth.token;
    const person = getState().auth.userId;
    const response = await fetch(
      `https://rn-testing-app.firebaseio.com/posts/${post.id}.json?auth=${token}`,
      {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          fromCity: post.fromCity,
          toCity: post.toCity,
          maxPersons: post.maxPersons,
          userId: post.userId,
          personsJoined: post.personsJoined,
          fare: post.fare,
        }),
      }
    );
    if (!response.ok) {
      throw new Error('Somthinge went Wrong while Updating!');
    }

    const resData = await response.json();

    dispatch({
      type: JOIN,
      post: post,
    });
  };
};

export const deletePost = (id) => {
  return async (dispatch, getState) => {
    const token = getState().auth.token;
    const response = await fetch(
      `https://rn-testing-app.firebaseio.com/posts/${id}.json?auth=${token}`,
      {
        method: 'DELETE',
      }
    );

    if (!response.ok) {
      throw new Error('Somethinge went wrong while deleting!');
    }

    dispatch({type: DELETE, pid: id});
  };
};

export const searchPost = (
  fromCity,
  toCity,
  availableSeats,
  fareRange,
  day,
  month
) => {
  return async (dispatch) => {
    try {
      const response = await fetch(
        'https://rn-testing-app.firebaseio.com/posts.json'
      );

      if (!response.ok) {
        throw new Error('Something went wrong fecthing Posts!');
      }

      const resData = await response.json();
      const loadedPosts = [];

      for (const key in resData) {
        loadedPosts.push(
          new Post(
            key,
            resData[key].userId,
            resData[key].fromCity,
            resData[key].toCity,
            moment(resData[key].date, 'DD-MM-YYYY').format('LL'),
            resData[key].maxPersons,
            resData[key].personsJoined,
            resData[key].fare,
            moment(resData[key].date).diff(moment(), 'days') > 0
              ? 'Open'
              : 'closed'
          )
        );
      }
      dispatch({
        type: SEARCH,
        posts: loadedPosts,
        searchedData: {
          fromCity: fromCity,
          toCity: toCity,
          availableSeats: availableSeats,
          fareRange: fareRange,
          day: day,
          month: month,
        },
      });
    } catch (error) {
      throw error;
    }
  };
};
