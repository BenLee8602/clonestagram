const jwt = require("jsonwebtoken");


function verifyToken(req, res, next) {
    var token = req.headers["authorization"];
    if (!token) return res.status(401);
    token = token.split(' ')[1];
    if (!token) return res.status(401);
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
        if (err) return res.status(403);
        req.user = user;
        next();
    });
}


module.exports = { verifyToken };
