class Fuzzy {
  constructor() {
    this.inference = [];
  }

  fuzzificationNutrition(percentage) {
    let normal = 0;
    let roWasted = 0;
    let wasted = 0;

    if (percentage <= 35) {
      normal = 1;
    } else if (percentage >= 35 && percentage <= 45) {
      normal = (45 - percentage) / 10;
      roWasted = (percentage - 35) / 10;
    } else if (percentage >= 45 && percentage <= 55) {
      roWasted = (55 - percentage) / 10;
      wasted = (percentage - 45) / 10;
    } else if (percentage >= 55) {
      wasted = 1;
    }

    return {
      gn: normal,
      bgb: roWasted,
      gb: wasted,
    };
  }

  fuzzificationHeight(percentage) {
    let normal = 0;
    let roStunted = 0;
    let stunted = 0;

    if (percentage <= 35) {
      normal = 1;
    } else if (percentage >= 35 && percentage <= 45) {
      normal = (45 - percentage) / 10;
      roStunted = (percentage - 35) / 10;
    } else if (percentage >= 45 && percentage <= 55) {
      roStunted = (55 - percentage) / 10;
      stunted = (percentage - 45) / 10;
    } else if (percentage >= 55) {
      stunted = 1;
    }

    return {
      n: normal,
      bs: roStunted,
      s: stunted,
    };
  }

  thenStunted(height, nutrition) {
    if (height !== 0 && nutrition !== 0) this.inference.push([Math.min(height, nutrition), 0.35]);
  }

  thenRiskOfStunted(height, nutrition) {
    if (height !== 0 && nutrition !== 0) this.inference.push([Math.min(height, nutrition), 0.45]);
  }

  thenNormal(height, nutrition) {
    if (height !== 0 && nutrition !== 0) this.inference.push([Math.min(height, nutrition), 0.55]);
  }

  findZvalue(f, limit) {
    let z = 0;

    if (limit === 0.35) {
      z = 0.45 - 0.1 * f;
    } else if (limit === 0.45) {
      z = 0.45;
    } else if (limit === 0.55) {
      z = 0.1 * f + 0.45;
    }

    return z;
  }

  defuzzification(heightPercentage, nutritionPercentage) {
    const { n, bs, s } = this.fuzzificationHeight(heightPercentage);
    const { gn, bgb, gb } = this.fuzzificationNutrition(nutritionPercentage);

    this.thenNormal(n, gn);
    this.thenNormal(n, bgb);
    this.thenNormal(n, gb);
    this.thenRiskOfStunted(bs, gn);
    this.thenRiskOfStunted(bs, bgb);
    this.thenRiskOfStunted(bs, gb);
    this.thenRiskOfStunted(s, gn);
    this.thenStunted(s, bgb);
    this.thenStunted(s, gb);
    this.inference.forEach(e => {
      const z = this.findZvalue(e[0], e[1]);
      e[1] = z;
    });

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
