const app = require('express')();
const router = require('./api/routes/routes');
const bodyParser = require('body-parser');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));


app.use('/', router);

module.exports = app;