import fs from "fs";
import path from "path";
import { Express, NextFunction, Request, Response } from "express";
import BaseController from "./controller/Base.controller";
import Container from "typedi";
import swaggerUI from "swagger-ui-express";
import openapiSpecification from "./OpenapiSpecification";

type MiddlewareHandlerType = (
  req: Request,
  res: Response,
  next: NextFunction
) => void;

type ErrorMiddlewareHandlerType = (
  err,
  req: Request,
  res: Response,
  next: NextFunction
) => void;

class AppBuilder {
  public constructor(private readonly app: Express) {}

  public initializeControllers() {
    // Controllers Directory
    const controllerDirectory = "controller";

    // Full path to controllers directory
    const controllerDirectoryPath = path.resolve(__dirname, "controller");

    // Read all files in the dir
    try {
      const files = fs.readdirSync(controllerDirectoryPath);

      files.map((filename) => {
        if (filename === "Base.controller.ts") return;

        const controllerPath = require(path.resolve(
          __dirname,
          controllerDirectory,
          filename
        ));

        try {
          const controller: BaseController = Container.get(
            controllerPath["default"]
          );

          // Initialize each Controller
          if (controller instanceof BaseController) {
            controller.initialize(this.app);
          }
        } catch (err) {
          console.log(err);
        }
      });
    } catch (err) {
      console.error(err);
      process.exit(1);
    }

    return this;
  }

  public enableOpenapiDocs(docsURL?: string) {
    this.app.use(
      docsURL || "/",
      swaggerUI.serve,
      swaggerUI.setup(openapiSpecification)
    );
    return this;
  }

  public addMiddleware(
    middlewareHandler: MiddlewareHandlerType | ErrorMiddlewareHandlerType
  ) {
    this.app.use(middlewareHandler);

    return this;
  }

  public build(port: number, callback?: () => void) {
    this.app.listen(port, callback);
  }
}

export default AppBuilder;
