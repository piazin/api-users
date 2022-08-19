const jwt = require('jsonwebtoken');
const config = require('../../config');

function auth (req, res, next){
    var authToken = req.headers['authorization'];

    if(authToken != undefined){
        var token = authToken.split(' ')[1];
        
        try {
            var decoded = jwt.verify(token, config.secret);

            if(decoded.role == 1){
                next();
            } else {
                return res.status(403).json({error: 1, messageError: "unauthorized user"});
            }

        } catch (error) {
            console.error(error);
            return res.status(401).json({error: 1, messageError: "invalid credentias"});
        }
    }
}

module.exports = auth;