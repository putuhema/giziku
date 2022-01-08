class Fuzzy {
  constructor() {
    this.inference = [];
  }

  fuzzificationWeightAge(z) {
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
  }

  fuzzificationHeight(z) {
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
  }

  fuzzificationWeightHeight(z) {
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
  }

  thenStunted(WA, WH) {
    if (WA !== 0 && WH !== 0) this.inference.push([Math.min(WA, WH), 0]);
  }

  thenNotStunted(WA, WH) {
    if (WA !== 0 && WH !== 0) this.inference.push([Math.min(WA, WH), 1]);
  }

  findZvalue(f, limit) {
    let z = 0;

    if (limit === 1) {
      z = f;
    } else if (limit === 0) {
      z = 1 - f;
    }

    return z;
  }

  defuzzification(HZScore, WHZScore) {
    const { SS: H_SS, S: H_S, N: H_N, T: H_T } = this.fuzzificationHeight(HZScore);
    const {
      SW: WH_SW,
      W: WH_W,
      N: WH_N,
      RO: WH_RO,
      O: WH_O,
      OB: WH_OB,
    } = this.fuzzificationWeightHeight(WHZScore);

    // fuzzy rules
    this.thenStunted(H_SS, WH_SW);
    this.thenStunted(H_SS, WH_W);
    this.thenStunted(H_SS, WH_N);
    this.thenStunted(H_SS, WH_RO);
    this.thenStunted(H_SS, WH_O);
    this.thenStunted(H_SS, WH_OB);

    this.thenStunted(H_S, WH_SW);
    this.thenStunted(H_S, WH_W);
    this.thenStunted(H_S, WH_N);
    this.thenStunted(H_S, WH_RO);
    this.thenStunted(H_S, WH_O);
    this.thenStunted(H_S, WH_OB);

    this.thenNotStunted(H_N, WH_SW);
    this.thenNotStunted(H_N, WH_W);
    this.thenNotStunted(H_N, WH_N);
    this.thenNotStunted(H_N, WH_RO);
    this.thenNotStunted(H_N, WH_O);
    this.thenNotStunted(H_N, WH_OB);

    this.thenNotStunted(H_T, WH_SW);
    this.thenNotStunted(H_T, WH_W);
    this.thenNotStunted(H_T, WH_N);
    this.thenNotStunted(H_T, WH_RO);
    this.thenNotStunted(H_T, WH_O);
    this.thenNotStunted(H_T, WH_OB);

    this.inference.forEach(e => {
      const z = this.findZvalue(e[0], e[1]);
      e[1] = z;
    });

    // defuzzification
    let x = 0;
    let y = 0;

    this.inference.forEach(e => {
      x += e[0] * e[1];
      y += e[0];
    });

    return x / y;
  }
}

module.exports = Fuzzy;
