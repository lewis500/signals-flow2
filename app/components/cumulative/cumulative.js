//@flow
import React from 'react';
import col from "../../style/colors";
import './style-cum-plot.scss';

import _ from 'lodash';
import { NUM_SIGNALS, CYCLE, GREEN, RUSH_LENGTH, NUM_CARS } from "../../constants/constants";
import type{History} from '../../constants/types';
import Axis from '../axis/axis';
const { g, rect } = React.DOM;

const WIDTH = 280,
  HEIGHT = 200,
  MAR = 45;

const DURATION = 20*RUSH_LENGTH;

type Props = {
  history: History;
  prediction: History;
};

function xScale(v:number):number{
  return v/ DURATION * WIDTH
}

function yScale(v:number):number{
  return (NUM_CARS - v) / NUM_CARS * HEIGHT;
}

function pathMaker(data:Array<any>, xVar:string, yVar:string):string {
  let i = data.length,
    points = new Array(i);
  while (i--) {
    points[i] = [
      xScale(data[i][xVar]),
      yScale(data[i][yVar])
    ];
  }
  return "M" + points.join("L");
}

class CumPlot extends React.Component{
  props: Props;

  render() {
    let history = this.props.history;
    return (
      <svg width={WIDTH+2*MAR} height={HEIGHT+2*MAR}>
        <g transform={`translate(${MAR},${MAR})`}>
          <rect width={WIDTH} height={HEIGHT} className='bg'/>
          <Axis
            domain={[0,DURATION]}
            range={[0,WIDTH]}
            orientation={'bottom'}
            height={HEIGHT}
            width={WIDTH}
            className='axis'
            innerTickSize={-HEIGHT}
          />
          <Axis
            domain={[0, NUM_CARS]}
            range={[HEIGHT,0]}
            orientation={'left'}
            height={HEIGHT}
            width={WIDTH}
            className='axis'
            innerTickSize={-WIDTH}
          />
          <path d={pathMaker(history, 't','a')} className='plot arrivals'/>
          <path d={pathMaker(history, 't','e')} className='plot exits'/>
        </g>
      </svg>
    );
  }
          // <path d={pathMaker(this.props.prediction, 't','e')} className='plot exits prediction'/>
          // <path d={pathMaker(this.props.prediction, 't','a')} className='plot arrivals prediction'/>
}

export default CumPlot
