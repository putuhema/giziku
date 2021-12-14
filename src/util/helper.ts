export const addressById = (id: number) => {
  const addresses = ["Dusun Budi Budaya", "Dusun Taman Sari"];

  return addresses[id];
};

export const monthById = (id: number) => {
  const months = [
    "Januari",
    "Februari",
    "Maret",
    "April",
    "Mei",
    "Juni",
    "Juli",
    "Agustus",
    "September",
    "Oktober",
    "November",
    "Desember",
  ];

  return months[id];
};

export const selectedOption = (
  edit: boolean,
  address: string,
  index: number
) => {
  const addresses = ["Dusun Budi Budaya", "Dusun Taman Sari"];
  let selected = false;
  if (edit) {
    addresses.forEach((a, i) => {
      if (a == address) {
        if (i == index) {
          selected = true;
        }
      }
    });
  }
  return selected;
};

export const selectedMonth = (edit: boolean, month: string, index: number) => {
  const months = [
    "Januari",
    "Februari",
    "Maret",
    "April",
    "Mei",
    "Juni",
    "Juli",
    "Agustus",
    "September",
    "Oktober",
    "November",
    "Desember",
  ];

  let selected = false;
  if (edit) {
    months.forEach((m, i) => {
      if (m == month) {
        if (i == index) {
          selected = true;
        }
      }
    });
  }

  return selected;
};
