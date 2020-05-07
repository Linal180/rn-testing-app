import POSTS from '../../data/dummy-data';
import {
  JOIN,
  DELETE,
  UPDATE,
  SEARCH,
  updatePost,
  CREATE,
} from '../actions/post';
import Post from '../../models/post';

const initialState = {
  availablePosts: POSTS,
  userPosts: POSTS.filter((prod) => prod.userId === 'u1'),
};

export default (state = initialState, action) => {
  switch (action.type) {
    case CREATE:
      const newPost = new Post(
        new Date().toString(),
        'u1',
        action.postData.fromCity,
        action.postData.toCity,
        '08/05/20',
        action.postData.maxPersons,
        '0',
        action.postData.fare,
        'active'
      );
      return {
        ...state,
        availablePosts: state.availablePosts.concat(newPost),
        userPosts: state.userPosts.concat(newPost),
      };

    case JOIN:
    case DELETE:
      return {
        ...state,
        userPosts: state.userPosts.filter((post) => post.id !== action.pid),
        availablePosts: state.availablePosts.filter(
          (post) => post.id !== action.pid
        ),
      };
    case UPDATE:
      const postIndex = state.userPosts.findIndex(
        (post) => post.id === action.pid
      );
      const post = state.userPosts.find(post => post.id === action.pid);
        console.log(action.postData.fromCity,'from');
      const updatedPost = new Post(
        action.pid,
        post.userId,
        action.postData.fromCity,
        action.postData.toCity,
        '08/05/20',
        action.postData.maxPersons,
        '0',
        post.fare,
        post.status
      );
      console.log(updatedPost, 'After Model');
      const updatedUserPosts = [...state.userPosts];
      updatedUserPosts[postIndex] = updatedPost;

      const availablePostIndex = state.availablePosts.findIndex(
        (post) => post.id === action.pid
      );
      const updatedAvailablePosts = [...state.availablePosts];
      updatedAvailablePosts[availablePostIndex] = updatedPost;

      return {
        ...state,
        availablePosts: updatedAvailablePosts,
        userPosts: updatedUserPosts,
      };
    case SEARCH:
  }
  return state;
};
