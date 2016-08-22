//@flow
import {VF,K0,W,ROAD_LENGTH,CYCLE,GREEN, GAP, NUM_SIGNALS} from '../constants/constants';
import type{MFD} from '../constants/types';
import {map,range,lt,lte} from 'lodash';
import {createMFD} from './reduce-mfd';
import { SET_OFFSET } from '../constants/actions';
console.log(VF,K0,W,ROAD_LENGTH,CYCLE,GREEN, GAP, NUM_SIGNALS);

export default map(
	range(.01, 1.01, .01),(k,i)=>{
    let p:number,
      kk = k/K0,
      gc = GREEN/CYCLE;
    if(lt(kk, gc)){
      p = 1/VF;
    }else if (lte(gc,kk) && lt(kk,1+VF/W*(1 - gc)) ){
      p = 1/ VF * (1 - kk) / (1 - gc);
    }else p = -1/W;
    let offset = p * GAP,
    	mfd = createMFD(offset);
  	return mfd[i];
  });
