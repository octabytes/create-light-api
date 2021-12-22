import HttpError from "./HttpError.error";

class Conflict extends HttpError {
  public statusCode: number = 409;
}

export default Conflict;
