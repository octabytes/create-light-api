import swaggerJsdoc from "swagger-jsdoc";

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "REST API in Typescript Nodejs Express",
      version: "1.0.0",
      description:
        "This is a REST API application made with Express and Typescript",
      license: {
        name: "Licensed Under MIT",
        url: "https://spdx.org/licenses/MIT.html",
      },
      contact: {
        name: "Azeem Haider",
        url: "https://github.com/axeemhaider",
      },
    },
    servers: [
      {
        url: "http://localhost:8080",
        description: "Development server",
      },
    ],
  },
  apis: [
    "./src/controller/*.ts",
    "./src/dto/request/*.ts",
    "./src/dto/response/*.ts",
  ],
};

const openapiSpecification = swaggerJsdoc(options);

export default openapiSpecification;
