import express, { Application, Request, Response } from "express";
import cors from "cors";
import globalErrorHandler from "./app/middlewares/globalErrorHandler";
import router from "./app/routes";
import notFound from "./app/middlewares/notFound";

const app: Application = express();

//Parsers
app.use(cors());
app.use(express.json());

//Route
app.use("/api", router);

app.get("/", (req: Request, res: Response) => {
  res.send("Project authorization running successfully!");
});

// Global error handler
app.use(globalErrorHandler);

// Not found error handler
app.use(notFound);

export default app;
