//@flow
import { ROAD_LENGTH, VF, NUM_CARS, SPACE, GAP, RUSH_LENGTH, PRIORITY, NUM_SIGNALS, MEMORY_LENGTH, TRIP_LENGTH } from "../constants/constants.js";
import { range, filter, isEqual, sample, forEach, sum, map, partition, mean } from 'lodash';
import type { Car, HistoryDatum, Loc, History, Time, Signal, Cars, Signals, Cell, TrafficState, Measurement } from '../constants/types';

// export function makeCars(): Cars {
//   return range(NUM_CARS)
//     .map(i => {
//       const x: Loc = random(0, ROAD_LENGTH - 1),
//         tA: Time = RUSH_LENGTH * i / NUM_CARS;
//       return makeCar(x, tA, i);
//     });
// }

function makeCar(x, tA, id): Car {
  return {
    x,
    id,
    moved: 0,
    tA,
    tE: tA,
    xOld: x,
    didMove: false,
    passive: true
  };
}

const midPoints = range(NUM_SIGNALS).map(i=>(GAP*i + GAP/2)%ROAD_LENGTH );

export function makeCars():Cars {
  return range(NUM_CARS)
    .map(i => {
      const x = sample(midPoints);
      const tA = RUSH_LENGTH * i / NUM_CARS;
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
  let { waiting, moving, queueing, measurement, history, exited } = traffic;
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

  let xTrials = Array(ROAD_LENGTH);

  [entering, queueing] = partition(queueing, car => {
    let x = car.x;
    // If a vehicle has already tried to enter into this cell during
    // this tick return false
    if (xTrials[x]) {
      return false;
    } else {
      // Update xTrials, it should only be checked once per cell per tick
      xTrials[x] = true;
      // If the vehicle is passive flip a coin to set its mood this tick
      // Once a vehicle is aggressive it will remain so
      if (car.passive) {
        car.passive = Math.random() > PRIORITY;
      }
      // See if the vehicle enters the loop
      if (car.passive) {
        // Passive car - only enters when big gap available
        let currentX = car.x;
        // A passive driver is also cautious and waits for the downstream cell 
        // to clear up (equivalent to waiting two ticks before trying to enter)
        if (travelingX[(currentX + 1) % ROAD_LENGTH]) {
          return false;
        }
        for (let i = 1; i < 6; i++) {
          // If a cell is full a passive car won't enter
          if (travelingX[currentX]) {
            return false;
          }
          // Update the cell to look into
          let currentX = (currentX === 0) ? ROAD_LENGTH - 1 : currentX - 1;
        }
        travelingX[car.x] = true;
        return true;
      } else {
        // Aggressive car - enters if single gap available
        if (travelingX[car.x]) {
          return false;
        } else {
          travelingX[car.x] = true;
          return true;
        }
      }
    }
  });

  // console.log(time, entering.length, queueing.length)
  moving = [...moving, ...entering];

  //get rid of the exited people
  [moving, exiting] = partition(moving, car => car.moved < TRIP_LENGTH);

  for (let car of exiting) car.tE = time;
  exited = [...exited, ...exiting];

  history = history.concat({
    a: exited.length + moving.length,
    e: exited.length,
    t: time
  });


  return {
    ...traffic,
    moving,
    queueing,
    waiting,
    exited,
    history,
    measurement: {
      q,
      k,
      q_temp,
      n_temp
    }
  };

}

export default reduceTraffic;
