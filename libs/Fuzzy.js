class Fuzzy {
  constructor() {
    this.inference = [];
  }

  fuzzificationNutrition(percentage) {
    let level1 = 0;
    let level2 = 0;
    let level3 = 0;

    if (percentage <= 35) {
      level1 = 1;
    } else if (percentage >= 35 && percentage <= 45) {
      level1 = (45 - percentage) / 10;
      level2 = (percentage - 35) / 10;
    } else if (percentage >= 45 && percentage <= 55) {
      level2 = (55 - percentage) / 10;
      level3 = (percentage - 45) / 10;
    } else if (percentage >= 55) {
      level3 = 1;
    }

    return {
      level1: +level1.toFixed(3),
      level2: +level2.toFixed(3),
      level3: +level3.toFixed(3),
    };
  }

  fuzzificationHeight(percentage) {
    let level1 = 0;
    let level2 = 0;
    let level3 = 0;

    if (percentage <= 35) {
      level1 = 1;
    } else if (percentage >= 35 && percentage <= 45) {
      level1 = (45 - percentage) / 10;
      level2 = (percentage - 35) / 10;
    } else if (percentage >= 45 && percentage <= 55) {
      level2 = (55 - percentage) / 10;
      level3 = (percentage - 45) / 10;
    } else if (percentage >= 55) {
      level3 = 1;
    }

    return {
      level1: +level1.toFixed(3),
      level2: +level2.toFixed(3),
      level3: +level3.toFixed(3),
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
    const height = this.fuzzificationHeight(heightPercentage);
    const nutrition = this.fuzzificationNutrition(nutritionPercentage);

    this.thenNormal(height.level1, nutrition.level1);
    this.thenNormal(height.level1, nutrition.level2);
    this.thenRiskOfStunted(height.level1, nutrition.level3);
    this.thenRiskOfStunted(height.level2, nutrition.level1);
    this.thenRiskOfStunted(height.level2, nutrition.level2);
    this.thenRiskOfStunted(height.level2, nutrition.level3);
    this.thenRiskOfStunted(height.level3, nutrition.level1);
    this.thenStunted(height.level3, nutrition.level2);
    this.thenStunted(height.level3, nutrition.level3);

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
