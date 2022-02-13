const weightInput = document.getElementById('weight');
const heightInput = document.getElementById('height');
const ageInput = document.getElementById('age');
const genderInput = document.getElementById('gender');
const submit = document.getElementById('btnSubmit');
const tableBody = document.getElementById('body');
const hwChart = document.getElementById('hwChart').getContext('2d');
const hChart = document.getElementById('hChart').getContext('2d');
const wChart = document.getElementById('wChart').getContext('2d');
const statusPlaceholder = document.getElementById('statusPlaceholder');

const find = (index, x) => {
  let element = {};
  index.forEach(e => {
    if (x === e.value) {
      element = e;
    }
  });
  return element;
};

const zScore = (x, y, type, gender, antropometri) => {
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
const zScoreAge = (x, y, type, gender, age, antropometri) => {
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
const chartSim = (context, labels, data, label, code) => {
  let selectedColor = {};
  switch (code) {
    case 'B': {
      selectedColor = { bg: '#e0f2fe', border: '#0284c7' };
      break;
    }
    case 'T': {
      selectedColor = { bg: '#fce7f3', border: '#db2777' };
      break;
    }
    case 'BT': {
      selectedColor = { bg: '#ccfbf1', border: '#0d9488' };
      break;
    }
    default: {
      selectedColor = { bg: '#e0f2fe', border: '#0284c7' };
    }
  }
  // eslint-disable-next-line no-undef
  return new Chart(context, {
    type: 'line',
    data: {
      labels,
      datasets: [
        {
          label,
          data,
          backgroundColor: selectedColor.bg,
          borderColor: selectedColor.border,
          borderWidth: 1,
        },
      ],
    },
    options: {
      color: selectedColor.border,
      borderColor: selectedColor.border,
      scales: {
        y: {
          beginAtZero: false,
        },
      },
    },
  });
};

const generateFuzzy = (heightZScores, nutritionZScores) => {
  const fuzzy = new Fuzzy();

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
  const defuzzification = fuzzy.defuzzification(heightPercentage, nutritionPercentage);

  return defuzzification;
};

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

const formData = [];
const w = [];
const h = [];
const a = [];
const hZ = [];
const whZ = [];
let c1 = null;
let c2 = null;
let c3 = null;
let stunting = '';

const calculateInput = (e, antro) => {
  e.preventDefault();
  if (c1) {
    c1.destroy();
  }
  if (c2) {
    c2.destroy();
  }
  if (c3) {
    c3.destroy();
  }
  const height = +heightInput.value;
  const weight = +weightInput.value;
  const age = +ageInput.value;
  hZ.push(zScore(age, height, 'PBU', genderInput.value, antro));
  whZ.push(zScoreAge(height, weight, 'PBBB', genderInput.value, age, antro));

  stunting = stuntingStatus(generateFuzzy(hZ, whZ));
  if (stunting.length > 0) {
    statusPlaceholder.innerText = stunting;
    statusPlaceholder.classList.remove('hidden');
  }

  w.push(weight);
  h.push(height);
  a.push(age);
  formData.push({
    weight: w,
    height: h,
    age: a,
  });
  const div = document.createElement('div');
  div.className = 'flex border-t items-center justify-between';
  const childDiv1 = document.createElement('div');
  const childDiv2 = document.createElement('div');
  const childDiv3 = document.createElement('div');
  const childDiv4 = document.createElement('div');
  childDiv1.className = 'w-[3rem] md:w-1/12';
  childDiv2.className = 'w-[3rem] md:w-1/12';
  childDiv3.className = 'w-[3rem] md:w-1/12';
  childDiv4.className = 'w-[3rem] md:w-1/12';
  formData.forEach((data, i) => {
    childDiv1.innerText = i + 1;
    childDiv2.innerText = data.weight[i];
    childDiv3.innerText = data.height[i];
    childDiv4.innerText = data.age[i];
    div.appendChild(childDiv1);
    div.appendChild(childDiv2);
    div.appendChild(childDiv3);
    div.appendChild(childDiv4);
  });

  tableBody.appendChild(div);

  // chart
  c1 = chartSim(wChart, a, w, 'Berat (Kg)', 'B');
  c2 = chartSim(hChart, a, h, 'Tinggi (Cm)', 'T');
  c3 = chartSim(hwChart, w, h, 'Berat (Kg) /Tinggi (Cm)', 'BT');
  weightInput.value = '';
  heightInput.value = '';
  ageInput.value = '';
};

(async () => {
const res = await fetch('http://cekstunting.com/api/');
  const antropometri = await res.json();
  submit.addEventListener('click', e => calculateInput(e, antropometri.antropometri));
})();
