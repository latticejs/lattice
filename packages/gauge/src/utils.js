export const percToDeg = perc => perc * 360;

export const degToRad = deg => {
  return (deg * Math.PI) / 180;
};

export const percToRad = perc => degToRad(percToDeg(perc));
