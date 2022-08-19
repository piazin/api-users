const config = require('../src/config');
const app = require('./app');

app.listen(config.port, () => console.log(`server started: http://localhost:${config.port}`));