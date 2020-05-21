import {SET_POOLS, JOIN_POOL_REQUEST, CREATE_POOL} from '../actions/pools';
import Pool from '../../models/pool';
import {useSelector} from 'react-redux';

const initialState = {
  pools: [],
};

export default (state = initialState, action) => {
  switch (action.type) {
    case SET_POOLS:
      return {
        pools: action.pools,
      };
    case CREATE_POOL:
      const newPool = new Pool(
        action.poolData.id,
        action.poolData.postId,
        action.poolData.persons
      );
      console.log(newPool, 'NEW');
      return {
        ...state,
        pools: state.pools.concat(newPool),
      };
    case JOIN_POOL_REQUEST:
      const postId = action.poolData.postId;
      const poolIndex = state.pools.findIndex((pool) => pool.postId === postId);
      const pool = state.pools[poolIndex];
      const updatedPool = new Pool(
        action.poolData.id,
        action.poolData.postId,
        action.poolData.persons
      );

      const updatedPools = [...state.pools];
      updatedPools[poolIndex] = updatedPool;

      return {
        ...state,
        pools: updatedPools,
      };
    default:
      return state;
  }
};
