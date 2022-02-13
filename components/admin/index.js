const router = require('./adminRouter');
const Admin = require('./admin');
const Standard = require('./standar');

module.exports = {
  Admin,
  Standard,
  adminRouter: router,
};
