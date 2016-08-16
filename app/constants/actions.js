//@flow
import type {Action} from './types';

export const TICK = 'TICK';
export const RESET = 'RESET';
export const SET_OFFSET = 'SET_OFFSET';


export const actions = {
    tick():Action{
        return {type: TICK};
    },
    reset():Action{
      return {type: RESET};
    },
    setOffset(offset:number):Action{
    	return {type: SET_OFFSET, offset};
    }
};
