import cookieParser from "cookie-parser";
import express, { Application, NextFunction, Request, Response } from "express";
import cors from "cors";
import notFound from "./app/middleware/notFound";
import router from "./app/router";
import globalErrorHandler from "./app/middleware/globalErrorHandler";

const app: Application = express();

// Middleware setup
app.use(cors({ origin: "*", credentials: true }));
app.use(cookieParser());
app.use(express.json());
// app.use(express.urlencoded({ extended: true }));

// route
app.use('/api/v1', router);


//globalError
app.use(globalErrorHandler)


// Not Found
app.use(notFound)


export default app;
