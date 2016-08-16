import { connect } from 'react-redux';
import React from 'react';
import PureRenderMixin from 'react-addons-pure-render-mixin';
import col from "../../style/colors";
import './style-road';
import {scaleLinear,interpolateInferno} from 'd3-scale';
import { ROAD_LENGTH,NUM_SIGNALS } from '../../constants/constants.js';
import {arc} from 'd3-shape';
const { rect, path, g } = React.DOM;
import {map} from 'lodash';

const RADIUS = 125,
  ROADWIDTH = 10,
  MAR = 20,
  LENGTH = 2 * (RADIUS + MAR + ROADWIDTH);

const rScale = x => x / ROAD_LENGTH * 360;

const makeArc = arc()
  .innerRadius(RADIUS-20)
  .outerRadius(RADIUS-10)
  .startAngle(i=> i/NUM_SIGNALS*Math.PI*2)
  .endAngle(i=>(i+1)/NUM_SIGNALS*Math.PI*2);

const color = interpolateInferno;
const Arcs = ({densities})=>{
  const arcs = map(densities, (d,i)=>{
    return path({
      className: 'arc',
      key: i,
      // opacity: d,
      fill: color(d),
      d: makeArc(i)
    });
  });
  return g({
    className: 'g-arcs'
  }, arcs);
};

const Signals = ({ signals }) => {
  const signalsRects = _.map(signals, d => {
    return rect({
      className: 'signal',
      width: 2,
      height: ROADWIDTH*1.2,
      y: -5,
      key: d.index,
      fill: d.green ? col.green["500"] : col.red["500"],
      transform: `rotate(${rScale(d.x)}) translate(0,${-RADIUS})`
    });
  });
  return g({
    className: 'g-signals'
  }, signalsRects);
};

const Cars = ({ cars }) => {
  const carRects = _.map(cars, d => rect({
    className: 'cars',
    width: 1,
    height: 5,
    y: -2.5,
    x: -.5,
    key: d.id,
    fill: col["light-blue"]["500"],
    transform: `rotate(${rScale(d.x)}) translate(0,${-RADIUS})`
  }));
  return g({
    className: 'g-cars'
  }, carRects);
};

type Props = {
  signals: Array<Signal>,
  cars: Array<Car>,
  densities: Array<number>
};

class Road extends React.Component{
  props:Props;
  render() {
    return (
      <svg width={LENGTH} height={LENGTH}>
        <g transform={`translate(${RADIUS+MAR+ROADWIDTH},${RADIUS+MAR+ROADWIDTH})`}>
          <circle r={RADIUS} className="road" strokeWidth={ROADWIDTH}/>
          <Cars cars={this.props.cars}/>
          <Signals signals={this.props.signals}/>
          <Arcs densities={this.props.densities}/>
        </g>
      </svg>
    );
  }
}

export default Road;
