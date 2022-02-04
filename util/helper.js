const Fuzzy = require('../libs/Fuzzy');
const { antropometri } = require('../data');

const addresses = [
  'Dusun Budi Budaya',
  'Dusun Taman Sari',
  'Dusun Tulung Agung',
  'Dusun Sari Buana',
  'Dusun Sari Makmur',
  'Dusun Karang Anyar',
  'Dusun Tommo',
  'Dusun Mukti Sari',
  'Dusun Mukti Tama',
  'Dusun Wonosari',
];
const addressById = id => addresses[id];

const monthById = id => {
  const months = [
    'Januari',
    'Februari',
    'Maret',
    'April',
    'Mei',
    'Juni',
    'Juli',
    'Agustus',
    'September',
    'Oktober',
    'November',
    'Desember',
  ];

  return months[id];
};

const selectedOption = (edit, address, index) => {
  let selected = false;
  if (edit) {
    addresses.forEach((a, i) => {
      if (a === address) {
        if (i === index) {
          selected = true;
        }
      }
    });
  }
  return selected;
};

const selectedMonth = (edit, month, index) => {
  const months = [
    'Januari',
    'Februari',
    'Maret',
    'April',
    'Mei',
    'Juni',
    'Juli',
    'Agustus',
    'September',
    'Oktober',
    'November',
    'Desember',
  ];

  let selected = false;
  if (edit) {
    months.forEach((m, i) => {
      if (m === month) {
        if (i === index) {
          selected = true;
        }
      }
    });
  }

  return selected;
};

const find = (index, x) => {
  let element = {};
  index.forEach(e => {
    if (x === e.value) {
      element = e;
    }
  });
  return element;
};

const zScoreAge = (x, y, type, gender, age) => {
  const { antropometri: antro } = antropometri;
  const BBU = antro.bbu;
  const PBU = antro.pbu;
  const BBPB = antro.bbpb;
  const BBTB = antro.bbtb;

  let median = 0;
  let plus1sd = 0;
  let min1sd = 0;
  let up = 0;
  let devider = 0;
  switch (type) {
    case 'BBU': {
      let B = {};
      if (gender === 'L') {
        B = find(BBU.L, x);
      } else if (gender === 'P') {
        B = find(BBU.P, x);
      }

      min1sd = B.min1sd;
      median = B.median;
      plus1sd = B.plus1sd;
      break;
    }
    case 'PBU': {
      let T = {};
      if (gender === 'L') {
        T = find(PBU.L, x);
      } else if (gender === 'P') {
        T = find(PBU.P, x);
      }

      min1sd = T.min1sd;
      median = T.median;
      plus1sd = T.plus1sd;
      break;
    }
    case 'BBPB': {
      if (age <= 24) {
        let PB = {};
        if (gender === 'L') {
          PB = find(BBPB.L, x);
        } else if (gender === 'P') {
          PB = find(BBPB.P, x);
        }
        min1sd = PB.min1sd;
        median = PB.median;
        plus1sd = PB.plus1sd;
      } else if (age >= 24) {
        let TB = {};
        if (gender === 'L') {
          TB = find(BBTB.L, x);
        } else if (gender === 'P') {
          TB = find(BBTB.P, x);
        }
        min1sd = TB.min1sd;
        median = TB.median;
        plus1sd = TB.plus1sd;
      }
      break;
    }
    default: {
      min1sd = 0;
      median = 0;
      plus1sd = 0;
      break;
    }
  }

  up = y - median;
  if (up > 0) {
    devider = plus1sd - median;
  } else if (up < 0) {
    devider = median - min1sd;
  }

  let z = 0;
  if (up === 0 && devider === 0) {
    z = 0;
  } else {
    z = up / devider;
  }

  return z;
};

const zScore = (x, y, type, gender) => {
  const { antropometri: antro } = antropometri;
  const BBU = antro.bbu;
  const PBU = antro.pbu;
  const BBPB = antro.bbpb;
  const BBTB = antro.bbtb;

  let median = 0;
  let plus1sd = 0;
  let min1sd = 0;
  let up = 0;
  let devider = 0;

  switch (type) {
    case 'BBU': {
      let B = {};
      if (gender === 'L') {
        B = find(BBU.L, x);
      } else if (gender === 'P') {
        B = find(BBU.P, x);
      }
      min1sd = B.min1sd;
      median = B.median;
      plus1sd = B.plus1sd;
      break;
    }
    case 'PBU': {
      let T = {};
      if (gender === 'L') {
        T = find(PBU.L, x);
      } else if (gender === 'P') {
        T = find(PBU.P, x);
      }

      min1sd = T.min1sd;
      median = T.median;
      plus1sd = T.plus1sd;
      break;
    }
    case 'BBPB': {
      if (age <= 24) {
        let PB = {};
        if (gender === 'L') {
          PB = find(BBPB.L, x);
        } else if (gender === 'P') {
          PB = find(BBPB.P, x);
        }

        min1sd = PB.min1sd;
        median = PB.median;
        plus1sd = PB.plus1sd;
      } else if (age >= 24) {
        let TB = {};
        if (gender === 'L') {
          TB = find(BBTB.L, x);
        } else if (gender === 'P') {
          TB = find(BBTB.P, x);
        }

        min1sd = TB.min1sd;
        median = TB.median;
        plus1sd = TB.plus1sd;
      }
      break;
    }
    default: {
      min1sd = 0;
      median = 0;
      plus1sd = 0;
      break;
    }
  }

  up = y - median;
  if (up > 0) {
    devider = plus1sd - median;
  } else if (up < 0) {
    devider = median - min1sd;
  }
  let z = 0;
  if (up === 0 && devider === 0) {
    z = 0;
  } else {
    z = up / devider;
  }
  return z;
};

/**
 * Given a defuzzification value, return a string describing their stunting status.
 * @returns stuntingStatus
 */
const stuntingStatus = d => {
  let status = '';

  if (d < 0.45) {
    status = 'stunting';
  } else if (d >= 0.45 && d < 0.55) {
    status = 'beresiko stunting';
  } else if (d >= 0.55) {
    status = 'normal';
  }
  return status;
};

const ssColor = ss => {
  let status = {};
  switch (ss) {
    case 'stunting': {
      status = {
        value: ss,
        color: {
          text: 'text-red-600',
          border: 'border-red-600',
          bg: 'bg-red-100',
        },
      };
      break;
    }
    case 'beresiko stunting': {
      status = {
        value: ss,
        color: {
          text: 'text-amber-600',
          border: 'border-amber-600',
          bg: 'bg-amber-100',
        },
      };
      break;
    }
    case 'normal': {
      status = {
        value: ss,
        color: {
          text: 'text-teal-600',
          border: 'border-teal-600',
          bg: 'bg-teal-100',
        },
      };
      break;
    }
    default: {
      status = {
        value: '',
        color: {
          text: 'text-teal-600',
          border: 'border-teal-600',
          bg: 'bg-teal-100',
        },
      };
    }
  }

  return status;
};

/**
 * Given a z-score, return the corresponding nutritional status.
 * @returns nutritionalStatus
 */
const nutritionalStatus = z => {
  let status = '';

  if (z < -3) {
    status = 'Gizi buruk';
  } else if (z >= -3 && z < -2) {
    status = 'Gizi kurang';
  } else if (z >= -2 && z <= 1) {
    status = 'Gizi baik';
  } else if (z > 1 && z <= 2) {
    status = 'Berisiko gizi lebih';
  } else if (z > 2 && z <= 3) {
    status = 'Gizi lebih';
  } else if (z > 3) {
    status = 'Obesitas';
  }

  return status;
};

/**
 * Cannot generate summary
 * @param measurements - the list of measurements to be analyzed
 * @param gender - the gender of the patient
 * @returns {}
 */
const getMeasurementInfo = async (measurements, gender) => {
  const weight = { value: [], ZScore: [] };
  const height = { value: [], ZScore: [] };
  const wh = [];
  const ages = [];

  measurements.forEach(async measurement => {
    weight.value.push(measurement.get('weight'));
    height.value.push(measurement.get('height'));
    const { age } = measurement;
    ages.push(age);
    weight.ZScore.push(zScore(age, measurement.get('weight'), 'BBU', gender));
    height.ZScore.push(zScore(age, measurement.get('height'), 'PBU', gender));
    wh.push(zScoreAge(measurement.get('height'), measurement.get('weight'), 'BBPB', gender, age));
  });

  return {
    weight,
    height,
    ages,
    wh,
  };
};

/**
 * Given a list of measurements, generate a fuzzy score for each measurement.
 * @returns None
 */
const generateFuzzy = measurements => {
  const fuzzy = new Fuzzy();
  const heightZScores = measurements.map(m => m.hZScore);
  const nutritionZScores = measurements.map(m => m.whZScore);

  let heightCounter = 0;
  let whCounter = 0;
  heightZScores.forEach(h => {
    if (h < -2) {
      heightCounter += 1;
    }
  });
  nutritionZScores.forEach(n => {
    if (n < -2) {
      whCounter += 1;
    }
  });
  const heightPercentage = (heightCounter / heightZScores.length) * 100;
  const nutritionPercentage = (whCounter / nutritionZScores.length) * 100;
  const height = fuzzy.fuzzificationHeight(heightPercentage);
  const nutrition = fuzzy.fuzzificationNutrition(nutritionPercentage);
  const defuzzification = fuzzy.defuzzification(heightPercentage, nutritionPercentage);

  return {
    height: { percentage: heightPercentage, fuzzy: height },
    nutrition: { percentage: nutritionPercentage, fuzzy: nutrition },
    defuzzification,
  };
};

module.exports = {
  zScore,
  zScoreAge,
  getMeasurementInfo,
  addressById,
  monthById,
  selectedMonth,
  selectedOption,
  stuntingStatus,
  nutritionalStatus,
  generateFuzzy,
  ssColor,
};
