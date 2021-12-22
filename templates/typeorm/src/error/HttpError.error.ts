abstract class HttpError implements Error {
  public name: string;
  public message: string;
  public stack?: string | undefined;
  public abstract statusCode: number;

  public constructor(message: string) {
    this.message = message;
  }
}

export default HttpError;
