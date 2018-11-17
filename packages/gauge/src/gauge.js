import { arc } from 'd3-shape';
import { percToRad } from './utils';

export const createArcs = props => {
  const { numSections, padRad, totalPercent, width, height, barWidth } = props;
  // build gauge bg
  const radius = Math.min(width, height) / 2;
  // / 2 for HALF circle
  // TODO(dk): currently all sections have the same weight. It could be interesting if the dev
  // could control this, eg: passing a diff weight for a section we need to recalculate the basic
  // weight which is given by the following formula:
  const sectionPerc = 1 / numSections / 2;

  const chartInset = 10;
  const arcsData = [];

  let sectionIdx = 1;
  let tp = totalPercent;
  for (; sectionIdx <= numSections; sectionIdx++) {
    const arcStartRad = percToRad(tp);
    const arcEndRad = arcStartRad + percToRad(sectionPerc);
    tp = tp + sectionPerc;

    const startPadRad = sectionIdx === 0 ? 0 : padRad / 2;
    const endPadRad = sectionIdx === numSections ? 0 : padRad / 2;

    const d3Arc = arc()
      .outerRadius(radius - chartInset)
      .innerRadius(radius - chartInset - barWidth)
      .startAngle(arcStartRad + startPadRad)
      .endAngle(arcEndRad - endPadRad);

    arcsData.push(d3Arc);
    /*
      this.chart
        .append('path')
        .attr('class', 'arc')
        .attr('class', classNames(classes[`gaugeColor${sectionIdx}`]))
        .attr('d', d3Arc);
        */
  }
  return arcsData;
};
