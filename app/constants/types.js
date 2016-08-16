//@flow
import {
  assign,
  random,
  takeRight,
  isEqual,
  lt,
  gte
} from 'lodash';
import {
  ROAD_LENGTH,
  NUM_CARS,
  SPACE,
  VF,
  RUSH_LENGTH,
  MEMORY_LENGTH,
  CYCLE,
  GREEN,
  TRIP_LENGTH
} from "./constants.js";

export type Time = number;
export type Loc = number;
export type Cell = number;
export type Measurement = {
  q: number;
  k: number;
  q_temp: number;
  n_temp: number;
};

export type Signals = Array < Signal > ;

export type RootState = {
  time: Time;
  signals: Signals;
  traffic: TrafficState;
  mfd: MFD;
  prediction: History;
};

export type TrafficState = {
  waiting: Cars;
  queueing: Cars;
  history: History;
  moving: Cars;
  exited: Cars;
  measurement: Measurement;
};

export type HistoryDatum = {
  a: number;
  e: number;
  t: Time;
};

export type History = Array < HistoryDatum > ;

export type Cars = Array < Car > ;

export type Action = Object;

export type Car = {
  x: Loc;
  xOld: number;
  id: number;
  moved: number;
  tA: Time;
  tE: Time;
  didMove: boolean;
};


export type MFDEntry = {
  k: number;
  q: number;
  v: number;
};

export type MFD = Array < MFDEntry > ;

export type MemoryDatum = {
  green: number;
  red: number;
  index: number;
};

export type Signal = {
  green: bool;
  x: number;
  index: number;
  oA: number;
  memory: Array < MemoryDatum > ;
};
