// @ts-check
exports.addressById = (id) => {
  const addresses = ["Dusun Budi Budaya", "Dusun Taman Sari"];

  return addresses[id];
};

exports.monthById = (id) => {
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

/**
 *
 * @param {boolean} edit
 * @param {string} address
 * @param {number} index
 */
exports.selectedOption = (edit, address, index) => {
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

exports.selectedMonth = (edit, month, index) => {
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
