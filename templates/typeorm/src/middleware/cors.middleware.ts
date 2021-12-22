import cors from "cors";

const corsMiddleware = () => {
  return cors({
    origin: "*",
  });
};

export default corsMiddleware;
