export const JOIN = 'JOIN';
export const CREATE = 'CREATE';
export const DELETE = 'DELETE';
export const UPDATE = 'UPDATE';
export const SEARCH = 'SEARCH';

export const joinPool = (post) => {
  return {type: JOIN, post: post};
};

export const deletePost = (id) => {
  return {type: DELETE, pid: id};
};

export const updatePost = (id, fromCity, toCity, maxPersons) => {
  return {
    type: UPDATE,
    pid: id,
    postData: {
      fromCity,
      toCity,
      maxPersons,
    },
  };
};

export const createPost = ( fromCity, toCity, maxPersons, fare) => {
  return {
    type: CREATE,
    postData: {
      fromCity,
      toCity,
      maxPersons,
      fare,
    },
  };
};

export const searchPost = (text) => {
  return {type: SEARCH, searchedText: text};
};
