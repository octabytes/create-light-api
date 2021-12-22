import { Request, Response, NextFunction } from "express";
import HttpError from "../error/HttpError.error";

const errorMiddleware = (err, _: Request, res: Response, __?: NextFunction) => {
  console.error(err);

  if (err instanceof HttpError) {
    const httpError: HttpError = <HttpError>err;

    res.status(httpError.statusCode).json({
      error: {
        statusCode: httpError.statusCode,
        ...httpError,
      },
    });

    return;
  }

  res.status(500).json({
    error: {
      statusCode: 500,
      message: err.message,
    },
  });
};

export default errorMiddleware;
