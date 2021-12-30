/**
 *
 * @param {number} z
 * @returns {object} {SU, U, N, O}
 */
exports.fuzzificationWeightAge = (z) => {
  let severelyUnderweight = 0;
  let underweight = 0;
  let normal = 0;
  let overweight = 0;

  if (z <= -3.5) {
    severelyUnderweight = 1;
  } else if (z >= -3.5 && z <= -3) {
    severelyUnderweight = (-3 - z) / 0.5;
    underweight = (z - -3.5) / 0.5;
  } else if (z >= -3 && z <= -2.5) {
    underweight = 1;
  } else if (z >= -2.5 && z <= -2) {
    underweight = (-2 - z) / 0.5;
    normal = (z - -2.5) / 0.5;
  } else if (z >= -2 && z <= 1) {
    normal = 1;
  } else if (z >= 1 && z <= 1.5) {
    normal = (1.5 - z) / 0.5;
    overweight = (z - 1) / 0.5;
  } else if (z >= 1.5) {
    overweight = 1;
  }

  return {
    SU: +severelyUnderweight.toFixed(3),
    U: +underweight.toFixed(3),
    N: +normal.toFixed(3),
    O: +overweight.toFixed(3),
  };
};

exports.fuzzificationHeightAge = (z) => {
  let severelyStunted = 0;
  let stunted = 0;
  let normal = 0;
  let tall = 0;

  if (z <= -3.5) {
    severelyStunted = 1;
  } else if (z >= -3.5 && z <= -3) {
    severelyStunted = (-3 - z) / 0.5;
    stunted = (z - -3.5) / 0.5;
  } else if (z >= -3 && z <= -2.5) {
    stunted = 1;
  } else if (z >= -2.5 && z <= -2) {
    stunted = (-2 - z) / 0.5;
    normal = (-2 - z) / 0.5;
  } else if (z >= -2 && z <= 3) {
    normal = 1;
  } else if (z >= 3 && z <= 3.5) {
    normal = (3.5 - z) / 0.5;
    tall = (z - 3) / 0.5;
  } else if (z >= 3.5) {
    tall = 1;
  }

  return {
    SS: +severelyStunted.toFixed(3),
    S: +stunted.toFixed(3),
    N: +normal.toFixed(3),
    T: +tall.toFixed(3),
  };
};

exports.fuzzificationWeightHeight = (z) => {
  let severelyWasted = 0;
  let wasted = 0;
  let normal = 0;
  let riskOfOverweight = 0;
  let overweight = 0;
  let obese = 0;

  if (z <= -3.5) {
    severelyWasted = 1;
  } else if (z >= -3.5 && z <= -3) {
    severelyWasted = (-3 - z) / 0.5;
    wasted = (z - -3.5) / 0.5;
  } else if (z >= -3 && z <= -2.5) {
    wasted = 1;
  } else if (z >= -2.5 && z <= -2) {
    wasted = (-2 - z) / 0.5;
    normal = (z - -2.5) / 0.5;
  } else if (z >= -2 && z <= 1) {
    normal = 1;
  } else if (z >= 1 && z <= 1.5) {
    normal = (1.5 - z) / 0.5;
    riskOfOverweight = (z - 1) / 0.5;
  } else if (z >= 1.5 && z <= 2) {
    riskOfOverweight = 1;
  } else if (z >= 2 && z <= 2.5) {
    riskOfOverweight = (2.5 - z) / 0.5;
    overweight = (z - 2) / 0.5;
  } else if (z >= 2.5 && z <= 3) {
    overweight = 1;
  } else if (z >= 3 && z <= 3.5) {
    overweight = (3.5 - z) / 0.5;
    obese = (z - 3) / 0.5;
  } else if (z >= 3.5) {
    obese = 1;
  }

  return {
    SW: +severelyWasted.toFixed(3),
    W: +wasted.toFixed(3),
    N: +normal.toFixed(3),
    RO: +riskOfOverweight.toFixed(3),
    O: +overweight.toFixed(3),
    OB: +obese.toFixed(3),
  };
};

/**
 *
 * @param {number[][]} inference
 * @returns z-value
 */
exports.defuzzification = (inference) => {
  let x = 0;
  let y = 0;

  inference.forEach((e) => {
    x += e[0] * e[1];
    y += e[0];
  });

  return x / y;
};
exports.thenWasted = (WA, HA, WH, inference) => {
  if (WA !== 0 && HA !== 0 && WH !== 0)
    inference.push([Math.min(WA, WH, WH), 50]);
};

exports.thenNormal = (WA, HA, WH, inference) => {
  if (WA !== 0 && HA !== 0 && WH !== 0)
    inference.push([Math.min(WA, WH, WH), 75]);
};

exports.thenOver = (WA, HA, WH, inference) => {
  if (WA !== 0 && HA !== 0 && WH !== 0)
    inference.push([Math.min(WA, WH, WH), 100]);
};

exports.findZValue = (f, mf) => {
  let z = 0;

  if (mf === 1) {
    z = 75 - 25 * f;
  } else if (mf === 2) {
    z = 90 - 15 * f;
  } else if (mf === 2.5) {
    z = 15 * f + 60;
  } else if (mf === 3) {
    z = 25 * f + 75;
  }

  return z;
};
