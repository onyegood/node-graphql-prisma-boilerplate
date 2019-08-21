import jwt from "jsonwebtoken";

const checkRefreshToken = (request) => {
  const header = request.request;
  const token = header.body.variables.token;

  if (token) {
    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    return decoded.userId
  }

  return null;
}

export { checkRefreshToken as default };