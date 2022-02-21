const chartHeight = document.getElementById('hChart').getContext('2d');
const chartWeight = document.getElementById('wChart').getContext('2d');
const chartWeightForHeight = document.getElementById('hwChart').getContext('2d');
const statusPlaceholder = document.getElementById('statusPlaceholder');

const chartTempalate = (ctx, labels, label, data, code) => {
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
  return new Chart(ctx, {
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
          tension: 0.1,
        },
      ],
    },
    options: {
      scales: {
        y: {
          beginAtZero: false,
        },
      },
    },
  });
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

(async () => {
  const res = await fetch('http://localhost:8080/zscore');
  const data = await res.json();
  const height = data.map(d => d.height);
  const weight = data.map(d => d.weight);
  const age = data.map(d => d.age);
  if (data.length > 0) {
    const { h, wh } = data[0].zscore;
    const heightPercentage = (h.filter(z => z < -2).length / h.length) * 100;
    const wflPercentage = (wh.filter(z => z < -2).length / wh.length) * 100;

    const fuzzy = new Fuzzy();
    const d = fuzzy.defuzzification(heightPercentage, wflPercentage);
    const status = stuntingStatus(d);

    statusPlaceholder.classList.toggle('hidden');
    statusPlaceholder.innerText = status;
  }
  chartTempalate(chartWeight, age, 'Berat(kg)', weight, 'B');
  chartTempalate(chartHeight, age, 'Tinggi(cm)', height, 'T');
  chartTempalate(chartWeightForHeight, weight, 'Berat', height, 'BT');
})();
