//@flow
import { N, ROAD_LENGTH, NUM_SIGNALS, CYCLE, GREEN, GAP, K0, UPDATE_FREQUENCY, FRO, BRO } from "../constants/constants.js";
import { map, sum, assign, range, forEach, mean, zip, isEqual, lt, gte, takeRight } from 'lodash';
// import { Signal } from '../constants/types';
import type { Signal, Car, MemoryDatum, Signals, Cars, Time } from '../constants/types';

const doubleMod = (a, b) => (a % b + b) % b;
const EMPTY_LINKS: Array < number > = map(range(NUM_SIGNALS), i => 0);

// function retimeSignals(signals: Signals, moving: Array < Car > , time: Time): void {
//   if (time % UPDATE_FREQUENCY == 0) {
//     const densities = calcDensities(moving, N);

//     //now calculate preliminary relative offsets
//     const ROs = map(densities, l => l > K0 ? BRO : FRO);

//     //now get the total extra
//     const extra = Math.round((sum(ROs) % CYCLE) / NUM_SIGNALS);

//     //calculate corrected ROs
//     const ROsCorrected = map(ROs, d => d - extra);

//     //now make the absolute offsets
//     let oA = 0;
//     forEach(signals, (signal, i, k) => {
//       oA = doubleMod(oA + ROsCorrected[i], CYCLE);
//       signal.oA = oA;
//     });
//   }

// }

export default function(signals: Signals, moving: Array < Car > , time: number): Signals {
  // retimeSignals(signals, moving, time);
  forEach(signals, s => tick(s, time));
  return signals.slice();
};


function testForGreen(signal, time: number): bool {
  let relTime = time % CYCLE;
  if (signal.oA < (signal.oA + GREEN) % CYCLE) {
    return (relTime < (signal.oA + GREEN) % CYCLE) && (relTime >= signal.oA);
  } else {
    return (relTime < (signal.oA + GREEN) % CYCLE) || (relTime >= signal.oA);
  }
}

function createSignal(index: number, oA: number, x: number): Signal {
  let signal: Signal = {
    x,
    green: true,
    index,
    oA,
    memory: [{ index, green: 0, red: 0 }],
  };
  return signal;
}

function updateMemory(signal: Signal, time: number, oldGreen: bool): Array < MemoryDatum > {
  switch (oldGreen) {
    case false:
      let newMemoryDatum: MemoryDatum = { green: time, red: time, index: signal.index };
      return takeRight(signal.memory, 4).concat(newMemoryDatum);
    default:
      let lastEntry: MemoryDatum = {
        ...signal.memory[signal.memory.length - 1],
        red: time
      };
      return [
        ...signal.memory.slice(0, signal.memory.length - 1),
        lastEntry
      ];
  }
}


function tick(signal: Signal, time: number): void {
  let oldGreen = signal.green;
  if (testForGreen(signal, time)) {
    signal.green = true;
    signal.memory = updateMemory(signal, time, oldGreen);
  } else
    signal.green = false;
}

export function makeSignalsInitial(): Signals {
  return range(NUM_SIGNALS)
    .map(index => {
      let oA = Math.round(doubleMod(BRO * index, CYCLE)),
        x = Math.round(index / NUM_SIGNALS * ROAD_LENGTH);
      return createSignal(index, oA, x)
    });
}

function calcDensities(moving: Array < Car > , n: number): Array < number > {
  //count the densities
  const densities = EMPTY_LINKS.slice();
  const result = EMPTY_LINKS.slice();
  const NUM_SLICES = Math.pow(2, n);
  const NUM_PER_SLICE = NUM_SIGNALS / NUM_SLICES;

  for (var car of moving) densities[Math.floor(car.x / GAP)] += 1 / GAP;

  range(NUM_SLICES).forEach(i => {
    const a = i * NUM_PER_SLICE,
      b = (i + 1) * NUM_PER_SLICE,
      slices = densities.slice(a, b),
      k = mean(slices);
    range(a, b).forEach(i => {
      result[i] = k;
    });
  });
  return result;
}
