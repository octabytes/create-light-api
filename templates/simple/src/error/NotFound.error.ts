import HttpError from "./HttpError.error";

class NotFound extends HttpError {
  public statusCode: number = 404;
}

export default NotFound;
