const ctx = document.getElementById('myChart').getContext('2d');
const heightCtx = document.getElementById('heightChart').getContext('2d');
const nutritionCtx = document.getElementById('nutritionChart').getContext('2d');

const charts = (context, labels, data, label) => {
  // eslint-disable-next-line no-undef
  const _ = new Chart(context, {
    type: 'line',
    data: {
      labels,
      datasets: [
        {
          label,
          data,
          backgroundColor: [
            'rgba(255, 99, 132, 0.2)',
            'rgba(54, 162, 235, 0.2)',
            'rgba(255, 206, 86, 0.2)',
            'rgba(75, 192, 192, 0.2)',
            'rgba(153, 102, 255, 0.2)',
            'rgba(255, 159, 64, 0.2)',
          ],
          borderColor: [
            'rgba(255, 99, 132, 1)',
            'rgba(54, 162, 235, 1)',
            'rgba(255, 206, 86, 1)',
            'rgba(75, 192, 192, 1)',
            'rgba(153, 102, 255, 1)',
            'rgba(255, 159, 64, 1)',
          ],
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

const req = async () => {
  const res = await fetch('http://localhost:8080/nutrition-api');
  const nutrition = await res.json();
  charts(ctx, nutrition.month, nutrition.weight.weight, 'Berat (Kg)');
  charts(heightCtx, nutrition.month, nutrition.height.height, 'Tinggi (Cm)');
};

req();
