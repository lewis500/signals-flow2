//@flow
import type { RootState, Cars, Time } from '../constants/types';
import { TICK } from '../constants/actions';
import signalsReduce, { makeSignalsInitial } from './reduce-signals';
import { MFD_INITIAL } from './reduce-mfd';
import trafficReduce, { makeTrafficInitial } from './reduce-traffic';
import { NUM_CARS, RUSH_LENGTH } from '../constants/constants';
import { map, mean, sumBy } from 'lodash';
import SUPER_MFD from './super-mfd';
import reducePrediction from './reduce-prediction';


const DURATION = 2 * RUSH_LENGTH;

function makeRootInitial(): RootState {
  return {
    time: -1,
    signals: makeSignalsInitial(),
    traffic: makeTrafficInitial(),
    mfd: MFD_INITIAL,
    prediction: reducePrediction(SUPER_MFD)
  };
}

function tick(state: RootState): RootState {
  const time = state.time + 1;
  const signals = signalsReduce(state.signals, state.traffic.moving, time);
  const traffic = trafficReduce(state.traffic, signals, time);
  return {...state, signals, traffic, time };
}

function rootReduce(state: RootState = makeRootInitial(), action: Object): RootState {
  if (action.type === TICK) {
    for (var i = 0; i < 500; i++) state = tick(state);
    // while(state.time<DURATION) state = tick(state);
    // if (state.time === DURATION) {
    //   console.log(mean(map(state.traffic.exited, d => d.tE - d.tA)));
    //   console.log(sumBy(map(state.traffic.history, d => d.a - d.e) / NUM_CARS));
    // }
    return state;
  } else return state;
}

export default rootReduce;
