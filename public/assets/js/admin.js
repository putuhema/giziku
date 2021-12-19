const weightCtx = document.getElementById("weightChart").getContext("2d");
const heightAdminCtx = document.getElementById("heightChart").getContext("2d");

const chart = (ctx, labels, data) => {
  new Chart(ctx, {
    type: "line",
    data: {
      labels: labels,
      datasets: [
        {
          label: "Berat/Bulan",
          data: data,
          backgroundColor: "#ffffff",
          borderColor: "#2d1b60",
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
  const res = await fetch("http://localhost:8080/admin/nutrition-api");
  const nutrition = await res.json();

  chart(weightCtx, nutrition.month, nutrition.weight);
  chart(heightAdminCtx, nutrition.month, nutrition.height);
};

request();
