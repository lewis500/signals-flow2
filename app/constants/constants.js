//@flow
export const ROAD_LENGTH = 320; //1280 long block scenario, 320 short blocks
export const TRIP_LENGTH = ROAD_LENGTH/2;
export const PRIORITY = .04;
export const RUSH_LENGTH = 2000;

export const NUM_SIGNALS = 32;
export const NUM_CARS = 1500;
export const VF = 1;
export const SPACE = 1;
export const KJ = 1;
export const CYCLE = 72;
export const GREEN = 48;
export const MEMORY_LENGTH = 50;
export const W = 1/2;
export const Q0 = 1/3;
export const K0 = 1/3;
export const UPDATE_FREQUENCY = 5*CYCLE;
export const GAP = ROAD_LENGTH/NUM_SIGNALS;
export const FRO = GAP/VF;
export const BRO = -GAP/W;
export const N = 0;

export const WHICHOFFSET = FRO;
export const RETIMING = false;