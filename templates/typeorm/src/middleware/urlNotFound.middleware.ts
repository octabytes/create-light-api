import NotFound from "../error/NotFound.error";

const urlNotFoundMiddleWare = () => {
  throw new NotFound("Request URL not found on server, please check the URL");
};

export default urlNotFoundMiddleWare;
