import { verifyUserToken } from "../common/token";
import { checkUserExistenceQueryById } from "../queries/auth";

const authorizer = async (req, res, next) => {
  try {
    const reqToken = req.headers.authorization;
    if (!reqToken) {
      throw new Unauthorized("Authorization token is missing.");
    }

    const token = reqToken.split(" ")[1];
    const userSecret = process.env.TOKEN_USER_SECRET;
    const user = await verifyUserToken(token, userSecret);
    if (!user) {
      return res.status(401).json({
        message: "Authentification error, please check your token.",
      });
    }
    const checkUserExistence = await client.query(checkUserExistenceQueryById, [
      user.id,
    ]);
    if (!checkUserExistence.rowCount === 1) {
      return res.status(403).json({
        message: "User is not authorized.",
      });
    }

    req.user = checkUser;
    next();
  } catch (error) {
    next(error);
  }
};

export { authorizer };
