const weightCtx = document.getElementById('weightChart').getContext('2d');
const heightCtx = document.getElementById('heightChart').getContext('2d');
const weightHeightCtx = document.getElementById('weightHeightChart').getContext('2d');

const charts = (context, labels, data, label, code) => {
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
  const _ = new Chart(context, {
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

const req = async () => {
  const res = await fetch('http://localhost:8080/nutrition-api');
  const nutrition = await res.json();
  charts(weightCtx, nutrition.month, nutrition.weight.weight, 'Berat (Kg)', 'B');
  charts(heightCtx, nutrition.month, nutrition.height.height, 'Tinggi (Cm)', 'T');
  charts(
    weightHeightCtx,
    nutrition.weight.weight,
    nutrition.height.height,
    'Berat (Kg) /Tinggi (Cm)',
    'BT'
  );
};

req();
