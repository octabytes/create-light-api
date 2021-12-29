import { NextFunction, Request, Response } from "express";
import { validateSync } from "class-validator";
import { plainToClass } from "class-transformer";
import BadRequest from "../error/BadRequest.error";

const validateRequest = (DtoClass: any) => {
  return (req: Request, _: Response, next?: NextFunction) => {
    try {
      let requestParams = req.body;
      let validationFrom = "body"; // Validation check in body

      // If req body is empty
      if (!Object.keys(req.body).length) {
        // if query is not empty
        if (Object.keys(req.query).length) {
          requestParams = req.query;
          validationFrom = "query"; // Validation check only in query
        } else {
          validationFrom = "body-and-query"; // Validation check in both query and body
        }
      }

      // Add query params in requested params which are going for validation
      const dto = new DtoClass();
      if (dto.__inParams?.length) {
        validationFrom = "param-" + validationFrom;
        for (const param of dto.__inParams) {
          if (req.params[param]) {
            requestParams[param] = req.params[param];
          }
        }
      }

      const requestDto = plainToClass(DtoClass, requestParams);

      const errors = validateSync(requestDto);

      if (errors.length) {
        let invalidParams = [];
        for (const error of errors) {
          invalidParams = invalidParams.concat(error.constraints);
        }

        const err = new BadRequest("Bad Request! Invalid request params");
        err.invalidParams = invalidParams;
        err.requestBody = requestParams;
        err.req = {
          body: req.body,
          query: req.query,
          params: req.params,
        };
        err.validationFrom = validationFrom;
        next(err);
      }
    } catch (e) {
      console.log("Error in request validator middleware");
      console.error(e);
    }

    next();
  };
};

export default validateRequest;
