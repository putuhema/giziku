const weightCtx = document.getElementById('weightChart').getContext('2d');
const heightAdminCtx = document.getElementById('heightChart').getContext('2d');
const weightHeightCtx = document
  .getElementById('weightHeightChart')
  .getContext('2d');
const NutritionCtx = document.getElementById('nutritionChart').getContext('2d');

const chart = (ctx, labels, data, zScore, label) => {
  // eslint-disable-next-line no-undef
  const _ = new Chart(ctx, {
    type: 'line',
    data: {
      labels,
      datasets: [
        {
          label,
          data,
          backgroundColor: '#ffffff',
          borderColor: '#2d1b60',
          borderWidth: 1,
          tension: 0.1,
        },
        {
          label: 'Z-Score',
          data: zScore,
          backgroundColor: '#ffffff',
          borderColor: '#e35d6a',
          borderWidth: 1,
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

const request = async () => {
  const res = await fetch('http://localhost:8080/admin/nutrition-api');
  const nutrition = await res.json();

  chart(
    weightCtx,
    nutrition.month,
    nutrition.weight.weight,
    nutrition.weight.wZScore,
    'Berat (Kg)'
  );
  chart(
    heightAdminCtx,
    nutrition.month,
    nutrition.height.height,
    nutrition.height.hZScore,
    'Tinggi (Cm)'
  );
  chart(
    weightHeightCtx,
    nutrition.height.height,
    nutrition.weight.weight,
    [],
    'Berat (Kg)'
  );
  chart(NutritionCtx, nutrition.month, nutrition.height.height, [], '');
};

request();
