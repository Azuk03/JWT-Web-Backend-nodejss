import jwt from "jsonwebtoken";
require("dotenv").config();
const nonSecurePaths = ["/", "/register", "/login", "/logout"];

const createJWT = (payload) => {
  try {
    let key = process.env.JWT_SECRET;
    let token = jwt.sign(payload, key, {
      expiresIn: process.env.JWT_EXPIRES_IN,
    });
    return token;
  } catch (error) {
    console.log("Error in createJWT: ", error);
    return null;
  }
};

const verifyToken = (token) => {
  let key = process.env.JWT_SECRET;
  try {
    let decoded = jwt.verify(token, key);
    return decoded;
  } catch (error) {
    console.log("Error in verifyToken: ", error);
    return null;
  }
};

const extractToken = (req) => {
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    return req.headers.authorization.split(" ")[1];
  }
  return null;
};

const checkUserJWT = (req, res, next) => {
  if (nonSecurePaths.includes(req.path)) {
    return next();
  }

  const token = req.cookies.jwt;
  let tokenFromHeader = extractToken(req);

  if (!token && !tokenFromHeader) {
    return res.status(401).json({
      EM: "Not authenticated - No token provided",
      EC: "-1",
      DT: "",
    });
  }

  let decoded = verifyToken(token || tokenFromHeader);
  if (!decoded) {
    return res.status(401).json({
      EM: "Not authenticated - Invalid or expired token",
      EC: "-1",
      DT: "",
    });
  } else {
    req.user = decoded;
    req.token = token || tokenFromHeader;
    next();
  }
};

const checkUserPermission = (req, res, next) => {
  if (nonSecurePaths.includes(req.path) || req.path === "/account") {
    return next();
  }
  const user = req.user;
  if (!user) {
    return res.status(401).json({
      EM: "Not authenticated",
      EC: "-1",
      DT: "",
    });
  } else {
    let email = req.user.email;
    let roles = req.user.groupWithRoles.Roles;
    let currentURL = req.path;
    if (!roles || roles.length === 0) {
      return res.status(403).json({
        EM: "You are not authorized to access this resource",
        EC: "-1",
        DT: "",
      });
    }
    let canAccess = roles.some((role) => role.url === currentURL || currentURL.includes(role.url));
    if (!canAccess) {
      return res.status(403).json({
        EM: "You are not authorized to access this resource",
        EC: "-1",
        DT: "",
      });
    } else {
      next();
    }
  }
};

module.exports = {
  createJWT,
  verifyToken,
  checkUserJWT,
  checkUserPermission,
};
