const { hash } = require('bcrypt');

const app = require('./app');
const sequelize = require('./config/db');
const { Admin } = require('./components/admin');

sequelize
  .sync()
  .then(async () => {
    const admin = await Admin.findOne({ where: { username: 'admin' } });
    if (!admin) {
      const hashPassword = await hash('admin', 10);
      Admin.create({
        username: 'admin',
        name: 'admin',
        password: hashPassword,
        role: 'admin',
        imgSeed: 'admin',
      });
    }
  })
  .then(() => {
    app.listen(8080, () => {
      console.log(`Run on port 8080`);
    });
  })
  .catch(err => {
    console.log(err);
  });
