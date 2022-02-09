const var1 = document.getElementById('var1').getContext('2d');
const var2 = document.getElementById('var2').getContext('2d');
const var3 = document.getElementById('var3').getContext('2d');

const generateChart = (ctx, { label, title }) =>
  new Chart(ctx, {
    type: 'line',
    data: {
      labels: label,
      datasets: [
        {
          label: title[0],
          data: [1, 1, 0, 0, 0],
          backgroundColor: '#ffffff',
          borderColor: '#000000',
          borderWidth: 1,
        },
        {
          label: title[1],
          data: [0, 0, 1, 0, 0],
          backgroundColor: '#ffffff',
          borderColor: '#000000',
          borderWidth: 1,
        },
        {
          label: title[2],
          data: [0, 0, 0, 1, 1],
          backgroundColor: '#ffffff',
          borderColor: '#000000',
          borderWidth: 1,
        },
      ],
    },
    options: {
      scales: {
        y: {
          beginAtZero: true,
        },
      },
    },
  });

generateChart(var1, {
  label: [30, 35, 45, 55, 60],
  title: ['Level 1', 'Level 2', 'Level 3'],
});
generateChart(var2, {
  label: [30, 35, 45, 55, 60],
  title: ['Level 1', 'Level 2', 'Level 3'],
});
generateChart(var3, {
  label: [0.3, 0.35, 0.45, 0.55, 0.6],
  title: ['Stunting', 'Beresiko Stunting', 'Normal'],
});
