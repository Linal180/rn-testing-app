import Post from '../../models/post';

export const JOIN = 'JOIN';
export const CREATE = 'CREATE';
export const DELETE = 'DELETE';
export const UPDATE = 'UPDATE';
export const SEARCH = 'SEARCH';
export const SET_POSTS = 'SET_POSTS';

export const fetchPosts = () => {
  return async (dispatch, getState) => {
    const userId = getState().auth.userId;
    console.log('IN FETCH,', getState());
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
        // console.log(resData,"----")
        loadedPosts.push(
          new Post(
            key,
            resData[key].userId,
            resData[key].fromCity,
            resData[key].toCity,
            resData[key].date,
            resData[key].maxPersons,
            resData[key].personsJoined,
            resData[key].fare,
            resData[key].status
          )
        );
      }
      dispatch({
        type: SET_POSTS,
        posts: loadedPosts,
        userPosts: loadedPosts.filter((post) => post.userId === userId),
      });
    } catch (error) {
      throw error;
    }
  };
};

export const joinPool = (post) => {
  return {type: JOIN, post: post};
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

export const updatePost = (id, fromCity, toCity, maxPersons) => {
  return async (dispatch, getState) => {
       // any async code you want!
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
          userId: userId
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

export const createPost = (fromCity, toCity, maxPersons, fare) => {
  return async (dispatch, getState) => {
    const token = getState().auth.token;
    const userId = getState().auth.userId;
  
    const response = await fetch(
      `https://rn-testing-app.firebaseio.com/posts.json?auth=${token}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: userId,
          fromCity,
          toCity,
          maxPersons,
          personsJoined: '0',
          date: '08/05/20',
          fare,
          status: 'ACTIVE',
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
        id: resData,
        userId: userId,
        fromCity,
        toCity,
        maxPersons,
        fare,
      },
    });
  };
};

export const searchPost = (text) => {
  return {type: SEARCH, searchedText: text};
};
