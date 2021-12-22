import HttpError from "./HttpError.error";

class NotAcceptable extends HttpError {
  public statusCode: number = 406;
}

export default NotAcceptable;
