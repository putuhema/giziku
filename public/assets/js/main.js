const ctx = document.getElementById("myChart").getContext("2d");
const heightCtx = document.getElementById("heightChart").getContext("2d");
const nutritionCtx = document.getElementById("nutritionChart").getContext("2d");
const menu = document.querySelector(".account__menu");
const dropdown = document.querySelector(".dropdown");

const charts = (ctx, labels, data, label) => {
  new Chart(ctx, {
    type: "line",
    data: {
      labels: labels,
      datasets: [
        {
          label: label,
          data: data,
          backgroundColor: [
            "rgba(255, 99, 132, 0.2)",
            "rgba(54, 162, 235, 0.2)",
            "rgba(255, 206, 86, 0.2)",
            "rgba(75, 192, 192, 0.2)",
            "rgba(153, 102, 255, 0.2)",
            "rgba(255, 159, 64, 0.2)",
          ],
          borderColor: [
            "rgba(255, 99, 132, 1)",
            "rgba(54, 162, 235, 1)",
            "rgba(255, 206, 86, 1)",
            "rgba(75, 192, 192, 1)",
            "rgba(153, 102, 255, 1)",
            "rgba(255, 159, 64, 1)",
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
  const res = await fetch("http://localhost:8080/nutrition-api");
  const nutrition = await res.json();
  charts(ctx, nutrition.month, nutrition.weight, "Berat (Kg)/Bulan");
  charts(heightCtx, nutrition.month, nutrition.height, "Tinggi (Cm)/Bulan");
};

const nutritionChart = new Chart(nutritionCtx, {
  type: "line",
  data: {
    labels: ["Red", "Blue", "Yellow", "Green", "Purple", "Orange"],
    datasets: [
      {
        label: "# of Votes",
        data: [12, 19, 3, 5, 2, 3],
        backgroundColor: [
          "rgba(255, 99, 132, 0.2)",
          "rgba(54, 162, 235, 0.2)",
          "rgba(255, 206, 86, 0.2)",
          "rgba(75, 192, 192, 0.2)",
          "rgba(153, 102, 255, 0.2)",
          "rgba(255, 159, 64, 0.2)",
        ],
        borderColor: [
          "rgba(255, 99, 132, 1)",
          "rgba(54, 162, 235, 1)",
          "rgba(255, 206, 86, 1)",
          "rgba(75, 192, 192, 1)",
          "rgba(153, 102, 255, 1)",
          "rgba(255, 159, 64, 1)",
        ],
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

dropdown.addEventListener("click", () => {
  menu.classList.toggle("show-menu");
});

window.onclick = function (e) {
  if (!e.target.matches(".dropdown")) {
    let op = document.getElementsByClassName("account__menu");
    for (let i = 0; i < op.length; i++) {
      let open = op[i];
      if (open.classList.contains("show-menu")) {
        open.classList.remove("show-menu");
      }
    }
  }
};

req();