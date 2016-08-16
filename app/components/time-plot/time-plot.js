//@flow
import React from 'react';
import './style-time-plot.scss';
import {map} from 'lodash';
import Axis from '../axis/axis.js';
import { NUM_SIGNALS, CYCLE } from "../../constants/constants.js";
import type {Signals,Time} from '../../constants/types';
const { g, rect } = React.DOM;

const WIDTH = 500,
  HEIGHT = 200,
  MAR = 40,
  YDOMAIN = [0, NUM_SIGNALS];

function yScale(v:number):number{
  return HEIGHT * (YDOMAIN[1] - v) / (YDOMAIN[1] - YDOMAIN[0]);
}

function xScale (v:number,time:number):number{
  let a = time - 4*CYCLE,
    b = time;
  return (v - a) / (4*CYCLE) * WIDTH;
}

type Props = {
  signals: Signals;
  time: Time;
};

class TimePlot extends React.Component{
  props:Props;

  createSignals(){
    return map(this.props.signals, s=>{
      return g({
        transform: `translate(0,${yScale(s.index)})`,
        className: 'g-signal',
        key: s.index
      }, map(s.memory, (d,i)=>{
        return rect({
          transform: `translate(${xScale(d.green, this.props.time)},0)`,
          className: 'signal-bar',
          key: i,
          width: Math.max(0,xScale(d.red,this.props.time) - xScale(d.green, this.props.time)),
          x: -6,
          y: -1,
          height: 2
        });
      }));
    });
  };

  render() {
    return (
      <svg width={WIDTH+2*MAR} height={HEIGHT+2*MAR}>
        <g transform={`translate(${MAR},${MAR})`}>
        	<rect width={WIDTH} height={HEIGHT} className='bg'/>
          {this.createSignals()}
          <Axis
            domain={[-4*CYCLE, 0]}
            range={[0,WIDTH]}
            orientation={'bottom'}
            height={HEIGHT}
            width={WIDTH}
            className='axis'
            innerTickSize={-HEIGHT}
            tickValues={[-400,-300,-200,-100,0]}
          />
          <Axis
            domain={[0, NUM_SIGNALS]}
            range={[HEIGHT,0]}
            orientation={'left'}
            height={HEIGHT}
            width={WIDTH}
            className='axis'
            innerTickSize={-WIDTH}
          />
        </g>
      </svg>
    );
  }
}

export default TimePlot
