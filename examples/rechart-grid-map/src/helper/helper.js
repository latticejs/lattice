import dataArr from '../resources/data';

/**
 * Return the State color name on behalf of State population size.
 */
function getStateColor(size, isPercentage = false) {
  if (isPercentage) {
    switch (true) {
      case size >= 10:
        return '#723122';
      case size >= 8:
        return '#8B4225';
      case size >= 6:
        return '#A25626';
      case size >= 4:
        return '#B86B25';
      case size >= 3:
        return '#CA8323';
      case size >= 2:
        return '#DA9C20';
      case size >= 1:
        return '#E6B71E';
      case size >= 0:
        return '#EED322';
      case size === 0:
        return '#F2F12D';
      default:
        return '#F2F12D';
    }
  }

  switch (true) {
    case size >= 25000000:
      return '#723122';
    case size >= 10000000:
      return '#8B4225';
    case size >= 7500000:
      return '#A25626';
    case size >= 5000000:
      return '#B86B25';
    case size >= 2500000:
      return '#CA8323';
    case size >= 1000000:
      return '#DA9C20';
    case size >= 750000:
      return '#E6B71E';
    case size >= 500000:
      return '#EED322';
    case size >= 0:
      return '#F2F12D';
    default:
      return '#F2F12D';
  }
}

/**
 * Return the County color name on behalf of County population size
 */
function getCountyColor(size) {
  switch (true) {
    case size >= 5000000:
      return '#723122';
    case size >= 3000000:
      return '#8B4225';
    case size >= 2000000:
      return '#A25626';
    case size >= 1000000:
      return '#B86B25';
    case size >= 700000:
      return '#CA8323';
    case size >= 500000:
      return '#DA9C20';
    case size >= 300000:
      return '#E6B71E';
    case size >= 100000:
      return '#F2F12D';
    default:
      return '#F2F12D';
  }
}

/**
 * Process the population data for Sunburst and PieChart Component.
 */
function evaluateChartData(isSunburst) {
  let stateResult = [];
  const colorArray = {};
  let resultData = [];
  let countryTotalPopulation = 0;

  if (isSunburst) {
    for (const data of dataArr) {
      const state = stateResult.filter(x => x.name === data.name);
      const { county, name, size } = data;

      const countyCompleteName = `${county}, ${name}`;
      const entryInfo = { name: countyCompleteName, size };

      if (state.length > 0) {
        if (size > 100000) {
          state[0].children.push(entryInfo);
          state[0].totalPopulation += size;
          colorArray[countyCompleteName] = getCountyColor(size);
        }
      } else {
        const newState = {
          name: name,
          children: [entryInfo]
        };
        colorArray[countyCompleteName] = getCountyColor(size);
        newState.totalPopulation = size;
        stateResult.push(newState);
      }

      colorArray.USA = '#723122';
    }

    for (const state of stateResult) {
      colorArray[state.name] = getStateColor(state.totalPopulation, !isSunburst);
    }

    resultData = [{ name: 'USA', children: stateResult }];
    return { data: resultData, colorArray };
  } else {
    for (const data of dataArr) {
      const state = stateResult.filter(x => x.name === data.name);
      const { name, size } = data;

      if (state.length > 0) {
        if (size > 100000) {
          state[0].totalPopulation += size;
          countryTotalPopulation += size;
        }
      } else {
        const newState = { name: name };
        newState.totalPopulation = size;
        countryTotalPopulation += size;
        stateResult.push(newState);
      }
    }

    stateResult = stateResult.sort((a, b) => parseFloat(b.totalPopulation) - parseFloat(a.totalPopulation));

    for (const state of stateResult) {
      state.percentage = Math.round((state.totalPopulation / countryTotalPopulation) * 10000) / 100;
      colorArray[state.name] = getStateColor(state.percentage, true);
    }

    return { data: stateResult, colorArray };
  }
}

export { evaluateChartData };
