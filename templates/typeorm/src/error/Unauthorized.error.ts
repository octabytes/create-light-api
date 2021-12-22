import HttpError from "./HttpError.error";

class Unauthorized extends HttpError {
  public statusCode: number = 401;
}

export default Unauthorized;
