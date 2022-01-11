const weightInput = document.getElementById('weight');
const heightInput = document.getElementById('height');
const ageInput = document.getElementById('age');
const submit = document.getElementById('btnSubmit');

// import antropometri from './antropometri.json';

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
  const BBU = antropometri.bbu;
  const PBU = antropometri.pbu;
  const BBPB = antropometri.bbpb;
  const BBTB = antropometri.bbtb;

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
  return up / devider;
};

const zScore = (x, y, type, gender) => {
  const BBU = antropometri.bbu;
  const PBU = antropometri.pbu;
  const BBPB = antropometri.bbpb;
  const BBTB = antropometri.bbtb;

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
  return up / devider;
};

// simulation
let currentInputData = {};
submit.addEventListener('click', e => {
  e.preventDefault();
  currentInputData = { weight: weightInput.value, height: heightInput.value, age: ageInput.value };

  weightInput.value = '';
  heightInput.value = '';
  ageInput.value = '';

  console.log(currentInputData);
  const zh = zScore(+ageInput.value, +weightInput.value, 'L');
  console.log(zh);
});
