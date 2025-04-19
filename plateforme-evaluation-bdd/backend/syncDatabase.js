// syncDatabase.js
const db = require('./models');
db.sequelize.sync({ force: true })
  .then(() => { console.log('✅ Base recréée.'); process.exit() })
  .catch(err => { console.error(err); process.exit(1) });
