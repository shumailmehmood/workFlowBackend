const jwt = require('jsonwebtoken');
module.exports = function (req, res, next) {
    const token = req.header('x-auth-token');

    if (!token) return res.status(401).send('Acess Denied Invalid Token');
    try {
        const decode = jwt.verify(token, 'jwtPrivateKey');
        req.user = decode;
        next();

    }
    catch (err) {
        res.status(400).send('Token is invalid___');
    }
}