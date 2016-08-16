//@flow
import { map, partition, filter} from 'lodash';
import { scaleLinear } from 'd3-scale';
import { VF, W, ROAD_LENGTH, RUSH_LENGTH, K0, TRIP_LENGTH, CYCLE, NUM_SIGNALS, GREEN } from '../constants/constants';
import type { Cars, MFD, History, Car } from '../constants/types';
import { makeCars } from './reduce-traffic';

export default function reducePrediction(superMFD: MFD): History {
  const V = scaleLinear()
    .domain(map(superMFD, d => d.k))
    .range(map(superMFD, d => d.v));

  let waiting: Cars = makeCars();
  let moving: Cars = [];
  let history: History = [];
  let exits: Cars = [];
  let exited:Cars = [];
  let arrivals:Cars = [];
  let cumMove = 0;
  let cumArrivals = 0;
  let cumExits = 0;
  let time = 0;

  while (time < RUSH_LENGTH * 2) {
    let n0 = moving.length;
    let k = n0 / ROAD_LENGTH;
    let move = V(k);
    cumMove += move;
    for (let car of moving) car.moved += move;
    [moving, exits] = partition(moving, car => car.moved < TRIP_LENGTH);

    for (let car of exits) car.tE = time;

    exited = [...exited, ...exits];
    [arrivals, waiting] = partition(waiting, car => car.tA <= time);

    let numExits = n0 - moving.length;
    let numArrivals = arrivals.length;
    cumExits += numExits;
    cumArrivals += numArrivals;
    history.push({
      t: time,
      a: cumArrivals,
      e: cumExits
    });

    moving = [
      ...moving,
      ...arrivals
    ];

    time++;
  }
  return history;

}
