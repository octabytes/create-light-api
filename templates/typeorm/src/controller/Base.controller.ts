import { Express, NextFunction, Request, Response } from "express";
import validateRequest from "../middleware/requestValidator.middleware";
import HttpExpress from "../utils/HttpExpress";

abstract class BaseController {
  private app: Express;

  public constructor() {}

  public initialize(app: Express) {
    this.app = app;
    this.initializeEndpoints();
  }

  protected abstract initializeEndpoints(): void;

  private response = (
    fn: (req: Request, res: Response, next?: NextFunction) => any | Promise<any>
  ) => {
    return (req: Request, res: Response, next?: NextFunction) => {
      // Execute function if this function is Async type then
      // it will return Promise otherwise results;
      const exec = fn(req, res, next);

      if (exec instanceof Promise) {
        exec.then((result) => {
          res.status(200).json(result);
        });
      } else {
        res.status(200).json(exec);
      }
    };
  };

  /**
   * Helper function to reduce the boilerplate, at core it run addEndpoint method
   * Contain only one middleware which is validateRequest
   * @param httpMethod GET, POST, DELETE, PUT
   * @param route Endpoint URL
   * @param fn Method that return the response
   * @param requestBody Request body if need to validate
   */
  protected endpoint(
    httpMethod: string,
    route: string,
    fn: (req: Request, res: Response, next?: NextFunction) => any,
    requestBody?: any
  ) {
    if (requestBody) {
      this.addEndpoint(httpMethod, route, fn, validateRequest(requestBody));
    } else {
      this.addEndpoint(httpMethod, route, fn);
    }
  }

  /**
   * Helper function to reduce the boilerplate, at core it run addAsyncEndpoint method
   * Contain only one middleware which is validateRequest
   * @param httpMethod GET, POST, DELETE, PUT
   * @param route Endpoint URL
   * @param fn Method that return the response
   * @param requestBody Request body if need to validate
   */
  protected asyncEndpoint(
    httpMethod: string,
    route: string,
    fn: (req: Request, res: Response, next?: NextFunction) => Promise<any>,
    requestBody?: any
  ) {
    if (requestBody) {
      this.addAsyncEndpoint(
        httpMethod,
        route,
        fn,
        validateRequest(requestBody)
      );
    } else {
      this.addAsyncEndpoint(httpMethod, route, fn);
    }
  }

  public addEndpoint(
    httpMethod: string,
    route: string,
    fn: (req: Request, res: Response, next?: NextFunction) => any,
    ...middlewares: ((
      req: Request,
      res: Response,
      next?: NextFunction
    ) => any)[]
  ) {
    switch (httpMethod) {
      case "GET":
        middlewares
          ? this.app.get(route, middlewares, this.response(fn))
          : this.app.get(route, this.response(fn));
        break;
      case "POST":
        middlewares
          ? this.app.post(route, middlewares, this.response(fn))
          : this.app.post(route, this.response(fn));
        break;
      case "PUT":
        middlewares
          ? this.app.put(route, middlewares, this.response(fn))
          : this.app.put(route, this.response(fn));
        break;
      case "DELETE":
        middlewares
          ? this.app.delete(route, middlewares, this.response(fn))
          : this.app.delete(route, this.response(fn));
        break;
    }
  }

  public addAsyncEndpoint(
    httpMethod: string,
    route: string,
    fn: (req: Request, res: Response, next?: NextFunction) => Promise<any>,
    ...middlewares: ((
      req: Request,
      res: Response,
      next?: NextFunction
    ) => any)[]
  ) {
    this.addEndpoint(
      httpMethod,
      route,
      HttpExpress.wrapAsync(fn),
      ...middlewares
    );
  }
}

export default BaseController;
