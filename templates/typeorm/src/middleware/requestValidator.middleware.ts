import { NextFunction, Request, Response } from "express";
import { validateSync } from "class-validator";
import { plainToClass } from "class-transformer";
import BadRequest from "../error/BadRequest.error";

const validateRequest = (DtoClass: any) => {
  return (req: Request, _: Response, next?: NextFunction) => {
    try {
      let requestParams = req.body;
      let validationFrom = "body";

      if (!Object.keys(req.body).length) {
        if (Object.keys(req.query).length) {
          requestParams = req.query;
          validationFrom = "query";
        } else {
          validationFrom = "body-and-query";
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
