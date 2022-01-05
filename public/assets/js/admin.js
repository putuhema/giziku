const weightCtxAdmin = document.getElementById('weightChart').getContext('2d');
const heightAdminCtxAdmin = document.getElementById('heightChart').getContext('2d');
const weightHeightCtxAdmin = document.getElementById('weightHeightChart').getContext('2d');
const NutritionCtxAdmin = document.getElementById('nutritionChart').getContext('2d');
const modalChart = document.getElementById('modalChart').getContext('2d');

const chart = (ctx, labels, data, zScore, label) =>
  // eslint-disable-next-line no-undef
  new Chart(ctx, {
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

const request = async () => {
  const res = await fetch('http://localhost:8080/admin/nutrition-api');
  const nutrition = await res.json();

  chart(
    weightCtxAdmin,
    nutrition.month,
    nutrition.weight.weight,
    nutrition.weight.wZScore,
    'Berat (Kg)'
  );

  chart(
    heightAdminCtxAdmin,
    nutrition.month,
    nutrition.height.height,
    nutrition.height.hZScore,
    'Tinggi (Cm)'
  );
  chart(
    weightHeightCtxAdmin,
    nutrition.height.height,
    nutrition.weight.weight,
    [],
    'Berat/Tinggi (Kg/Cm)'
  );
  chart(NutritionCtxAdmin, nutrition.month, nutrition.height.height, [], '');

  const setModalContent = (id, title, desc, bg, color, descColor) => {
    modalId.value = id;
    modalTitle.textContent = title;
    modalDesc.textContent = desc;
    modalContainer.classList.toggle('hidden');
    mc.classList.toggle(bg);
    modalTitle.classList.toggle(color);
    modalDesc.classList.toggle(color);
    modalBorder.classList.toggle(descColor);
    modalClose.classList.toggle(color);
  };

  let ctx;
  if (weightModal) {
    weightModal.addEventListener('click', async () => {
      setModalContent(
        1,
        'Berat Badan (Kg)',
        'lorem ipsum damer sir jon',
        'bg-sky-50',
        'text-sky-500',
        'border-sky-600'
      );
      if (ctx) {
        ctx.destroy();
      }
      ctx = chart(
        modalChart,
        nutrition.month,
        nutrition.weight.weight,
        nutrition.weight.wZScore,
        'Berat (Kg)'
      );
    });
  }

  if (heightModal) {
    heightModal.addEventListener('click', () => {
      setModalContent(
        2,
        'Tinggi Badan (Cm)',
        'lorem ipsum damer sir jon',
        'bg-pink-50',
        'text-pink-500',
        'border-pink-600'
      );
      if (ctx) {
        ctx.destroy();
      }
      ctx = chart(
        modalChart,
        nutrition.month,
        nutrition.height.height,
        nutrition.height.hZScore,
        'Tinggi (Cm)'
      );
    });
  }

  if (weightHeightModal) {
    weightHeightModal.addEventListener('click', () => {
      setModalContent(
        3,
        'Berat/Tinggi Badan (Kg/Cm)',
        'lorem ipsum damer sir jon',
        'bg-teal-50',
        'text-teal-500',
        'border-teal-600'
      );
      if (ctx) {
        ctx.destroy();
      }
      ctx = chart(
        modalChart,
        nutrition.height.height,
        nutrition.weight.weight,
        [],
        'Berat/Tinggi (Kg/Cm)'
      );
    });
  }
};

request();
