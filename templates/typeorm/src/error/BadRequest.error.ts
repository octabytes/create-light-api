import HttpError from "./HttpError.error";

class Request {
  body?: any;
  query?: any;
  params?: any;
}

class BadRequest extends HttpError {
  public statusCode: number = 400;
  public invalidParams: any[];
  public requestBody: any;
  public req?: Request;
  public validationFrom?: string;
}

export default BadRequest;
