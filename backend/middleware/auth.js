// get id from token
const jwt = require("jsonwebtoken");

//  if yes then next or else return
const auth = async (req, res, next) => {
  try {
    const token = req.headers.token;
    if (token) {
      const { id } = jwt.verify(token, "JWT_SECRET_KEY");
      // console.log("The id is",id);
      if (req.id && req.id !== id) {
        return res.status(400).json({ login: false, msg: "Invalid Token" });
      }
      req.id = id;
      next();
    } else {
      return res.status(400).json({ login: false, msg: "No token" });
    }
  } catch (error) {
    return res.status(500).json({ login: false, msg: error.message });
  }
};
module.exports = auth;
