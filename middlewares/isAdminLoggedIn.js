import jwt from "jsonwebtoken";
import adminFinder from "../utils/adminFinder.js";
import redisClient from "../services/redis.service.js";

const logerAuthenticate = async (req, res, next) => {
  try {
    let token = req.cookies?.AdminToken;

    if (!token && req.headers.authorization?.startsWith("Bearer ")) {
      token = req.headers.authorization.split(" ")[1];
    }
    if (!token) {
      return res.status(401).json({ error: "Unauthorized token" });
    }

    const isBlackList = await redisClient.get(token);
    if (isBlackList) {
      return res.status(401).json({ error: "token is black Listed" });
    }

    const decoded = jwt.verify(token, process.env.JWT_KEY);
    const user = await adminFinder({
      key: "_id",
      query: decoded.id,
      lean: true,
    });
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    req.user = user;
    return next();
  } catch (error) {
    console.log(error);
    return res.status(403).json({ error: "Invalid or expired token" });
  }
};

export default logerAuthenticate;
