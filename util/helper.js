const BBU = require('../model/BBU');
const TBU = require('../model/TBU');
const BBPB = require('../model/BBPB');
const BBTB = require('../model/BBTB');

// @ts-check
const addresses = [
  'Dusun Budi Budaya',
  'Dusun Taman Sari',
  'Dusun Tulung Agung',
  'Dusun Sari Buana',
  'Dusun Sari Makmur',
  'Dusun Karang Anyar',
  'Dusun Tommo',
  'Dusun Mukti Sari',
  'Dusun Mukti Tama',
  'Dusun Wonosari',
];
exports.addressById = id => addresses[id];

exports.monthById = id => {
  const months = [
    'Januari',
    'Februari',
    'Maret',
    'April',
    'Mei',
    'Juni',
    'Juli',
    'Agustus',
    'September',
    'Oktober',
    'November',
    'Desember',
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
  let selected = false;
  if (edit) {
    addresses.forEach((a, i) => {
      if (a === address) {
        if (i === index) {
          selected = true;
        }
      }
    });
  }
  return selected;
};

exports.selectedMonth = (edit, month, index) => {
  const months = [
    'Januari',
    'Februari',
    'Maret',
    'April',
    'Mei',
    'Juni',
    'Juli',
    'Agustus',
    'September',
    'Oktober',
    'November',
    'Desember',
  ];

  let selected = false;
  if (edit) {
    months.forEach((m, i) => {
      if (m === month) {
        if (i === index) {
          selected = true;
        }
      }
    });
  }

  return selected;
};

/**
 *
 * @param {number} x i.e. Age, Weight, Height
 * @param {string} type
 */
exports.zScore = async (x, y, type) => {
  let median = 0;
  let plus1sd = 0;
  let min1sd = 0;
  let up = 0;
  let devider = 0;
  const age = arguments[2];
  switch (type) {
    case 'BBU': {
      const B = await BBU.findOne({ where: { X: x } });
      min1sd = B.getDataValue('MIN1SD');
      median = B.getDataValue('MEDIAN');
      plus1sd = B.getDataValue('PLUS1SD');
      break;
    }
    case 'TBU': {
      const T = await TBU.findOne({ where: { X: x } });
      min1sd = T.getDataValue('MIN1SD');
      median = T.getDataValue('MEDIAN');
      plus1sd = T.getDataValue('PLUS1SD');
      break;
    }
    case 'BBPB': {
      if (age <= 24) {
        const PB = await BBPB.findOne({ where: { X: x } });
        min1sd = PB.getDataValue('MIN1SD');
        median = PB.getDataValue('MEDIAN');
        plus1sd = PB.getDataValue('PLUS1SD');
      } else if (age >= 24) {
        const TB = await BBTB.findOne({ where: { X: x } });
        min1sd = TB.getDataValue('MIN1SD');
        median = TB.getDataValue('MEDIAN');
        plus1sd = TB.getDataValue('PLUS1SD');
      }
      break;
    }
    default: {
      min1sd = 0;
      median = 0;
      plus1sd = 0;
      break;
    }
  }

  // console.log({
  //   min1sd,
  //   median,
  //   plus1sd,
  //   x,
  //   y,
  // });

  up = y - median;
  if (up > 0) {
    devider = plus1sd - median;
  } else if (up < 0) {
    devider = median - min1sd;
  }

  return up / devider;
};
