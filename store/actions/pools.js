import Pool from '../../models/pool';

export const SET_POOLS = 'SET_POOLS';
export const JOIN_POOL_REQUEST = 'JOIN_POOL_REQUEST';
export const LEAVE_POOL = 'LEAVE_POOL';
export const DELETE_POOL = 'DELETE_POOL';
export const CREATE_POOL = 'CREATE_POOL';

export const fetchPools = () => {
  return async (dispatch, getState) => {
    const userId = getState().auth.userId;
    try {
      const response = await fetch(
        `https://rn-testing-app.firebaseio.com/pools.json`
      );

      if (!response.ok) {
        throw new Error('Something went wrong while loading pools!');
      }

      const resData = await response.json();
      const loadedPools = [];

      for (const key in resData) {
        loadedPools.push(new Pool(key, resData[key].postId));
      }
      dispatch({type: SET_POOLS, pools: loadedPools});
    } catch (err) {
      throw err;
    }
  };
};

export const createPool = (id, postId, persons) => {
  return async (dispatch, getState) => {
    const userId = getState().auth.userId;

    const response = await fetch(
      `https://rn-testing-app.firebaseio.com/pools.json`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id,
          postId,
          persons,
        }),
      }
    );

    if (!response.ok) {
      throw new Error('Something went wrong while Creating Pool!');
    }

    const resData = await response.json();
    dispatch({
      type: CREATE_POOL,
      poolData: {
        id,
        postId,
        persons,
      },
    });
  };
};

export const joinPoolResquested = (postId) => {
  return async (dispatch, getState) => {
    const userId = getState().auth.userId;
    const response = await fetch(
      `https://rn-testing-app.firebaseio.com/pools.json`,
      {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          postId,
          userId,
          persons
        }),
      }
    );

    if (!response.ok) {
      throw new Error('Something went wrong while joining this Pool!');
    }

    const resData = await response.json();

    dispatch({
      type: JOIN_POOL_REQUEST,
      poolData: {
        id: resData.name,
        postId: postId,
        persons,
      },
    });
  };
};
