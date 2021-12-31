import "reflect-metadata";
import dotenv from "dotenv";
import express from "express";
import morgan from "morgan";

import Database from "./database";
import AppBuilder from "./AppBuilder";
import errorMiddleware from "./middleware/error.middleware";
import urlNotFoundMiddleWare from "./middleware/urlNotFound.middleware";
import corsMiddleware from "./middleware/cors.middleware";

dotenv.config();
const app = express();
const appBuilder = new AppBuilder(app);

const port = process.env.PORT || "8080";
const portNumber = parseInt(port);

Database.initialize().then(() => {
  appBuilder
    .addMiddleware(morgan("dev"))
    .addMiddleware(express.json())
    .addMiddleware(corsMiddleware())
    .initializeControllers()
    .enableOpenapiDocs()
    .addMiddleware(urlNotFoundMiddleWare)
    .addMiddleware(errorMiddleware)
    .build(portNumber, () => console.log("Listing on Port", portNumber));
});
