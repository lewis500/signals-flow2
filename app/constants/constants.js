//@flow

//LONG BLOCKS
export const ROAD_LENGTH = 1280; 
export const NUM_CARS = 4000;
export const σ = 2880;

//SHORT BLOCKS
// export const ROAD_LENGTH = 320; 
// export const NUM_CARS = 1500;
// export const σ = 1440;

export const TRIP_LENGTH = .5*ROAD_LENGTH;
export const RETIMING = true;
export const PRIORITY = .08;
export const DURATION = 10*σ;

export const NUM_SIGNALS = 32;
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

