//@flow
import React,{Component} from 'react';
import col from "../../style/colors";
import style from './style-mfd-plot.scss';
import { NUM_SIGNALS} from "../../constants/constants.js";
import type {MFD, Measurement} from '../../constants/types';
import SuperMFD from '../../reducers/super-mfd';
import Axis from '../axis/axis';
const { circle } = React.DOM;
import {format} from 'd3-format';
const PT = React.PropTypes;

const WIDTH = 250,
  HEIGHT = 175,
  MAR = 30,
  yScale = q => HEIGHT - q / .5 * HEIGHT,
  xScale = k => k * WIDTH;

type Props = {
  measurement: Measurement;
  mfd: MFD;
}

function Dot(props){
  let measurement:Measurement = props.measurement;
  return circle({
    transform: `translate(${xScale(measurement.k)},${yScale(measurement.q)})`,
    className: 'dot',
    r: 5
  });
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

const decimalFormat = format('.2r');

class MFDPlot extends Component{
  props:Props;
  render() {
    let {measurement,mfd} = this.props;
    return (
      <svg width={WIDTH+2*MAR} height={HEIGHT+2*MAR}>
        <g transform={`translate(${MAR},${MAR})`}>
          <rect width={WIDTH} height={HEIGHT} className='bg'/>
          <Axis
            domain={[0,1]}
            range={[0,WIDTH]}
            orientation={'bottom'}
            height={HEIGHT}
            width={WIDTH}
            className='axis'
            innerTickSize={-HEIGHT}
            tickFormat = {decimalFormat}
          />
          <Axis
            domain={[0, .5]}
            range={[HEIGHT,0]}
            orientation={'left'}
            height={HEIGHT}
            width={WIDTH}
            className='axis'
            innerTickSize={-WIDTH}
            tickFormat = {decimalFormat}
          />
          <Dot measurement={measurement}/>
          <path
            d={pathMaker(mfd, 'k', 'q')}
            className='mfd-plot'/>
          <path
            d={pathMaker(SuperMFD, 'k', 'q')}
            className={'super-mfd-plot'}/>
        </g>
      </svg>
    );
  }
}

export default MFDPlot;
