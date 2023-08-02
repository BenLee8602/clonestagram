const jwt = require("jsonwebtoken");


function requireLogin(req, res, next) {
    var token = req.headers["authorization"];
    token = token && token.split(' ')[1];
    if (!token) return res.status(401).json("missing access token");

    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, tkn) => {
        if (err === jwt.JsonWebTokenError || !tkn)
            return res.status(401).json("invalid access token");
        if (err === jwt.TokenExpiredError)
            return res.status(403).json("expired access token");
        req.user = tkn;
        next();
    });
}


module.exports = { requireLogin };
