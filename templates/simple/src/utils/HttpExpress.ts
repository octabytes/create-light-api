import { Request, Response, NextFunction } from "express";

class HttpExpress {
  /**
   * Wrap a function to handle Errors from Async methods
   *
   * @param fn Function
   * @returns Function
   */
  public static wrapAsync(
    fn: (req: Request, res: Response, next?: NextFunction) => Promise<any>
  ) {
    return (req: Request, res: Response, next?: NextFunction) => {
      return fn(req, res, next).catch(next);
    };
  }
}

export default HttpExpress;
