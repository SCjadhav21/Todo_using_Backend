const jwt = require("jsonwebtoken");
require("dotenv").config();

const Auth = (req, res, next) => {
  const token = req.headers.authorization;

  jwt.verify(token, process.env.key, async (err, decoded) => {
    if (err) {
      res.send({ massage: err.message, alert: "you are not logged in" });
    } else {
      req.body.userId = decoded.userId;
      next();
    }
  });
};

module.exports = { Auth };
