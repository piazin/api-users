const app = require('express')();
const router = require('./api/routes/routes');
const bodyParser = require('body-parser');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));


app.use('/', router);

app.use((err, req, res, next) => {
    if(!err) return next();
    return res.status(400).json({
        status: 400, 
        messageError: "Ops! Bad Request"
    });
})

module.exports = app;