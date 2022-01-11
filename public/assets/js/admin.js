const weightCtxAdmin = document.getElementById('weightChart').getContext('2d');
const heightAdminCtxAdmin = document.getElementById('heightChart').getContext('2d');
const weightHeightCtxAdmin = document.getElementById('weightHeightChart').getContext('2d');
const modalChart = document.getElementById('modalChart').getContext('2d');

const chart = (ctx, labels, data, zScore, label, code) => {
  // eslint-disable-next-line no-undef
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
        {
          label: 'Z-Score',
          data: zScore,
          backgroundColor: '#cbd5e1',
          borderColor: '#475569',
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
  const { weight, height, ages, wh } = await res.json();
  console.log(ages);
  chart(weightCtxAdmin, ages, weight.value, weight.ZScore, 'Berat (Kg)', 'B');
  chart(heightAdminCtxAdmin, ages, height.value, height.ZScore, 'Tinggi (Cm)', 'T');
  chart(weightHeightCtxAdmin, weight.value, height.value, wh, 'Berat/Tinggi (Kg/Cm)', 'BT');

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
        'Indeks ini digunakan untuk menilai anak dengan berat badan kurang (underweight) atau sangat kurang (severely underweight), tetapi tidak dapat digunakan untuk mengklasifikasikan anak gemuk atau sangat gemuk.',
        'bg-sky-50',
        'text-sky-500',
        'border-sky-600'
      );
      if (ctx) {
        ctx.destroy();
      }
      ctx = chart(modalChart, ages, weight.value, weight.ZScore, 'Berat (Kg)', 'B');
    });
  }

  if (heightModal) {
    heightModal.addEventListener('click', () => {
      setModalContent(
        2,
        'Tinggi Badan (Cm)',
        'Indeks PB/U atau TB/U menggambarkan pertumbuhan panjang atau tinggi badan anak berdasarkan umurnya. Indeks ini dapat mengidentifikasi anak-anak yang pendek (stunted) atau sangat pendek (severely stunted), yang disebabkan oleh gizi kurang dalam waktu lama atau sering sakit.',
        'bg-pink-50',
        'text-pink-500',
        'border-pink-600'
      );
      if (ctx) {
        ctx.destroy();
      }
      ctx = chart(modalChart, ages, height.value, height.ZScore, 'Tinggi (Cm)', 'T');
    });
  }
};

request();
