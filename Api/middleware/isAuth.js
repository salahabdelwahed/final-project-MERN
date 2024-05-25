import jwt from "jsonwebtoken";
import User from "../Models/User.js"

const isAuth = async (req, res, next) => {
  try {
    const userToken = req.headers["auth"];

    //decoded token
    const decoded = await jwt.verify(userToken, process.env.privetKey);
    console.log(decoded);
    //end

    if (!decoded) {
      return res.status(401).send({ msg: "user not auth" });
    }

    //find user in DB
    const userFind = await User.findById(decoded.id);
    if (!userFind) {
      return res.status(401).send({ msg: "user not auth" });
    }
    console.log(userFind);
    //asysign
    req.User = userFind;
    next();
  } catch (error) {
    return res.status(500).send({ msg: "we have error", error });
  }
};
export default isAuth;
