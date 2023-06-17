const jwt = require("../lib/jwt");

exports.auth = async (req, res, next) => {
  const token = req.cookies["token"];
  if (token) {
    try {
      const decodedToken = await jwt.verify(token, process.env.SECRET);

      req.user = decodedToken;
      res.locals.user = decodedToken;
      res.locals.isAuthenticated = true
      
      next();
    } catch (error) {
      res.clearCookie("token");
      res.redirect("/users/login");
    }
  } else {
    next();
  }
};

exports.isAuth = async (req, res, next) => {
  if (!req.user) {
    return res.redirect("/users/login");
  }
  next();
};
