import moment from 'moment';

import {JOIN, DELETE, UPDATE, SEARCH, CREATE, SET_POSTS} from '../actions/post';
import Post from '../../models/post';
import {Alert} from 'react-native';

const initialState = {
  availablePosts: [],
  userPosts: [],
  hostedRides: [],
  hostedRidesHistory: [],
  bookedRides: []
};

export default (state = initialState, action) => {
  switch (action.type) {
    case SET_POSTS:
      return {
        availablePosts: action.posts,
        userPosts: action.userPosts,
        hostedRides: action.hostedRides,
        hostedRidesHistory: action.hostedRidesHistory,
        bookedRides: action.bookedRides,
      };
    case CREATE:
      const newPost = new Post(
        action.postData.id,
        action.postData.userId,
        action.postData.fromCity,
        action.postData.toCity,
        moment(action.postData.date).format('LL'),
        action.postData.maxPersons,
        action.postData.personsJoined,
        action.postData.fare,
        action.postData.status
      );
      return {
        ...state,
        availablePosts: state.availablePosts.concat(newPost),
        userPosts: state.userPosts.concat(newPost),
      };

    case JOIN:
      const joiningPost = action.post;
      const index = state.userPosts.findIndex(
        (post) => post.id === joiningPost.id
      );

      const updatedPost1 = new Post(
        joiningPost.id,
        joiningPost.userId,
        joiningPost.fromCity,
        joiningPost.toCity,
        moment(joiningPost.date).format('LL'),
        joiningPost.maxPersons,
        joiningPost.personsJoined,
        joiningPost.fare,
        joiningPost.status
      );
      const updatedUserPosts1 = [...state.userPosts];
      updatedUserPosts1[index] = updatedPost1;

      const availablePostsIndex = state.availablePosts.findIndex(
        (post) => post.id == joiningPost.id
      );
      const updatedAvailablePosts1 = [...state.availablePosts];
      updatedAvailablePosts1[availablePostsIndex] = updatedPost1;
      console.log(updatedAvailablePosts1, ' = = = =');
      return {
        ...state,
        availablePosts: updatedAvailablePosts1,
        userPosts: updatedUserPosts1,
      };

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
      const post = state.userPosts.find((post) => post.id === action.pid);
      const updatedPost = new Post(
        action.pid,
        post.userId,
        action.postData.fromCity,
        action.postData.toCity,
        moment(post.date).format('LL'),
        action.postData.maxPersons,
        post.personsJoined,
        post.fare,
        post.status
      );

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
      const {
        fromCity,
        toCity,
        availableSeats,
        fareRange,
        day,
        month,
      } = action.searchedData;

      console.log(
        fromCity.length,
        'from',
        toCity.length,
        'to',
        availableSeats.length,
        'availableSeats',
        fareRange.length,
        'fareRange'
      );
      let searchDate = moment(`${month}-${day}-2020`).format('LL');
      console.log(moment(searchDate), '======');
      let resultedPosts = [];
      ///////////////// 4 combination
      if (
        fromCity.length > 0 &&
        toCity.length > 0 &&
        availableSeats.length > 0 &&
        fareRange.length > 0
      ) {
        console.log('4');
        action.posts.map((post) => {
          if (
            post.fromCity === fromCity &&
            post.toCity === toCity &&
            post.maxPersons - post.personsJoined.length >= availableSeats &&
            post.fare <= fareRange
          ) {
            resultedPosts.push(post);
          }
        });
        /////// combinations of 1-2-3
      } else if (
        fromCity.length > 0 &&
        toCity.length > 0 &&
        availableSeats.length > 0 &&
        fareRange.length === 0
      ) {
        console.log('1-2-3');
        action.posts.map((post) => {
          if (
            post.fromCity === fromCity &&
            post.toCity === toCity &&
            post.maxPersons - post.personsJoined.length >= availableSeats
          ) {
            resultedPosts.push(post);
          }
        });
        /////// combinations of 1-2-4
      } else if (
        fromCity.length > 0 &&
        toCity.length > 0 &&
        availableSeats.length === 0 &&
        fareRange.length > 0
      ) {
        console.log('1-2-4');
        action.posts.map((post) => {
          if (
            post.fromCity === fromCity &&
            post.toCity === toCity &&
            post.fare <= fareRange
          ) {
            resultedPosts.push(post);
          }
        });
        /////// combinations of 1-3-4
      } else if (
        fromCity.length > 0 &&
        toCity.length === 0 &&
        availableSeats.length > 0 &&
        fareRange.length > 0
      ) {
        console.log('1-3-4');
        action.posts.map((post) => {
          if (
            post.fromCity === fromCity &&
            post.maxPersons - post.personsJoined.length >= availableSeats &&
            post.fare <= fareRange
          ) {
            resultedPosts.push(post);
          }
        });
        /////// combinations of 2-3-4
      } else if (
        fromCity.length === 0 &&
        toCity.length > 0 &&
        availableSeats.length > 0 &&
        fareRange.length > 0
      ) {
        console.log('2-3-4');
        action.posts.map((post) => {
          if (
            post.toCity === toCity &&
            post.maxPersons - post.personsJoined.length >= availableSeats &&
            post.fare <= fareRange
          ) {
            resultedPosts.push(post);
          }
        });
        /////// combinations of 1-2
      } else if (
        fromCity.length > 0 &&
        toCity.length > 0 &&
        availableSeats.length === 0 &&
        fareRange.length === 0
      ) {
        console.log('1-2');
        action.posts.map(
          (post) => {
            if (post.fromCity == fromCity && post.toCity == toCity)
              resultedPosts.push(post);
          }
          // post.fromCity === fromCity && post.toCity === toCity
        );
        /////// combinations of 1-3
      } else if (
        fromCity.length > 0 &&
        toCity.length === 0 &&
        availableSeats.length > 0 &&
        fareRange.length === 0
      ) {
        console.log('1-3');
        action.posts.map((post) => {
          if (
            post.fromCity === fromCity &&
            post.maxPersons - post.personsJoined.length >= availableSeats
          ) {
            resultedPosts.push(post);
          }
        });
        /////// combinations of 1-4
      } else if (
        fromCity.length > 0 &&
        toCity.length === 0 &&
        availableSeats.length === 0 &&
        fareRange.length > 0
      ) {
        console.log('1-4');
        action.posts.map((post) => {
          if (post.fromCity === fromCity && post.fare <= fareRange) {
            resultedPosts.push(post);
          }
        });
        /////// combinations of 2-3
      } else if (
        fromCity.length === 0 &&
        toCity.length > 0 &&
        availableSeats.length > 0 &&
        fareRange.length === 0
      ) {
        console.log('2-3');
        action.posts.map((post) => {
          if (
            post.toCity === toCity &&
            post.maxPersons - post.personsJoined.length >= availableSeats
          ) {
            resultedPosts.push(post);
          }
        });
        /////// combinations of 2-4
      }
      if (
        fromCity.length === 0 &&
        toCity.length > 0 &&
        availableSeats.length === 0 &&
        fareRange.length > 0
      ) {
        console.log('2-4');
        action.posts.map((post) => {
          if (post.toCity == toCity && post.fare <= fareRange) {
            resultedPosts.push(post);
          }
        });
        /////// combinations of 3-4
      } else if (
        fromCity.length === 0 &&
        toCity.length === 0 &&
        availableSeats.length > 0 &&
        fareRange.length > 0
      ) {
        console.log('3-4');
        action.posts.map((post) => {
          if (
            post.maxPersons - post.personsJoined.length >= availableSeats &&
            post.fare <= fareRange
          ) {
            resultedPosts.push(post);
          }
        });
        /////// combinations of 1
      } else if (
        fromCity.length > 0 &&
        toCity.length === 0 &&
        availableSeats.length === 0 &&
        fareRange.length === 0
      ) {
        console.log('1');
        action.posts.map((post) => {
          if (post.fromCity === fromCity) {
            resultedPosts.push(post);
          }
        });
        /////// combinations of 2
      } else if (
        fromCity.length === 0 &&
        toCity.length > 0 &&
        availableSeats.length === 0 &&
        fareRange.length === 0
      ) {
        console.log('2');
        action.posts.map((post) => {
          if (post.toCity === toCity) {
            resultedPosts.push(post);
          }
        });
        /////// combinations of 3
      } else if (
        fromCity.length === 0 &&
        toCity.length === 0 &&
        availableSeats.length > 0 &&
        fareRange.length === 0
      ) {
        console.log('3');
        action.posts.map((post) => {
          if (post.maxPersons - post.personsJoined.length >= availableSeats) {
            resultedPosts.push(post);
          }
        });
        /////// combinations of 4
      } else if (
        fromCity.length === 0 &&
        toCity.length === 0 &&
        availableSeats.length === 0 &&
        fareRange.length > 0
      ) {
        console.log('4');
        action.posts.map((post) => {
          if (post.fare <= fareRange) {
            resultedPosts.push(post);
          }
        });
        /////// combinations of No found!
      }
      console.log(resultedPosts.length, 'posts');
      return {
        ...state,
        availablePosts: resultedPosts,
        userPosts: state.userPosts,
      };
    default:
      return state;
  }
};
