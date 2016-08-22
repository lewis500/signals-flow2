//@flow
import { ROAD_LENGTH, σ, VF, NUM_CARS, SPACE, GAP, RUSH_LENGTH, PRIORITY, NUM_SIGNALS, MEMORY_LENGTH, TRIP_LENGTH } from "../constants/constants.js";
import { range, filter, isEqual, sample, forEach, sum, map, partition, mean } from 'lodash';
import type { Car, HistoryDatum, Loc, History, Time, Signal, Cars, Signals, Cell, TrafficState, Measurement } from '../constants/types';
import { randomNormal } from 'd3-random';

const random = randomNormal(0, σ);

const chooseTA = () => Math.max(0, 4*σ  + random());

function makeCar(x, tA, id): Car {
  return {
    x,
    id,
    moved: 0,
    tA,
    tE: tA,
    xOld: x,
    didMove: false,
    tripLength: (Math.random() + .5) * TRIP_LENGTH
  };
}

const midPoints = range(NUM_SIGNALS).map(i => (GAP * i + GAP / 2) % ROAD_LENGTH);

export function makeCars(): Cars {
  return range(NUM_CARS)
    .map(i => {
      const x = sample(midPoints);
      const tA = chooseTA();
      return makeCar(x, tA, i);
    });
}

export function makeTrafficInitial(): TrafficState {
  return {
    waiting: makeCars(),
    moving: [],
    queueing: [],
    exited: [],
    history: [],
    va:0,
    measurement: {
      q: 0,
      k: 0,
      q_temp: 0,
      n_temp: 0
    }
  };
}

function moveCar(car, taken): void {
  let x = car.x
  let nextSpace = (car.x + 1) % ROAD_LENGTH;
  car.xOld = car.x;
  if (taken[nextSpace]) {
    car.didMove = false;
  } else {
    car.x = nextSpace;
    car.didMove = true;
    car.moved++;
  }
}


function reduceTraffic(traffic: TrafficState, signals: Signals, time: number): TrafficState {
  let { waiting, moving, queueing, measurement, history, exited, va } = traffic;
  let newQueueing, exiting, entering;
  let taken = Array(ROAD_LENGTH);
  let { q_temp, n_temp, q, k } = traffic.measurement;

  for (let s of signals) taken[s.x] = !s.green;
  // for (let car of queueing) taken[car.x] = true;
  for (let car of moving) {
    taken[car.x] = true;
    taken[car.xOld] = true;
  }

  for (let car of moving) moveCar(car, taken);

  n_temp += moving.length;
  q_temp += filter(moving, car => car.didMove).length;

  if (isEqual(time % MEMORY_LENGTH, 0)) {
    k = n_temp / ROAD_LENGTH / MEMORY_LENGTH;
    q = q_temp / ROAD_LENGTH / MEMORY_LENGTH;
    n_temp = 0;
    q_temp = 0;
  }

  //get waiting and new entering
  [newQueueing, waiting] = partition(waiting, car => car.tA <= time);

  queueing = [...queueing, ...newQueueing];

  let travelingX = Array(ROAD_LENGTH);
  for (let car of moving) {
    travelingX[car.x] = true;
    travelingX[car.xOld] = true;
  }

  let failedTrials = Array(ROAD_LENGTH);

  [entering, queueing] = partition(queueing, car => {
    let x = car.x;
    if (travelingX[car.x] || failedTrials[x]) return false;
    let prevSpace = x === 0 ? ROAD_LENGTH - 1 : x - 1;
    let failedTrial = Math.random() > PRIORITY;
    if (travelingX[prevSpace] && failedTrial) {
      failedTrials[x] = true;
      return false;
    }
    return (travelingX[x] = failedTrials[x] = true);
  });

  moving = [...moving, ...entering];

  //get rid of the exited people
  [moving, exiting] = partition(moving, car => car.moved < car.tripLength);

  for (let car of exiting) car.tE = time;
  exited = [...exited, ...exiting];

  history = history.concat({
    a: exited.length + moving.length,
    e: exited.length,
    va: (va = newQueueing.length + va),
    t: time,
  });


  return {
    ...traffic,
    moving,
    queueing,
    waiting,
    exited,
    history,
    va,
    measurement: {
      q,
      k,
      q_temp,
      n_temp
    }
  };

}

export default reduceTraffic;
