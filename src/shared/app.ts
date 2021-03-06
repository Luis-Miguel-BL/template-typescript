import "reflect-metadata";
import "dotenv/config";
import "express-async-errors";

import cors from "cors";
import express, { Request, Response, NextFunction } from "express";
import { errors } from "celebrate";

import routes from "./infra/routes";

import AppError from "./errors/AppError";

import createConnection from "@shared/infra/typeorm";
import "@shared/container";
createConnection();
const app = express();
app.use(cors());

app.use(express.json());
app.use(routes);

app.use(errors());

app.use((err: Error, request: Request, response: Response, _: NextFunction) => {
  if (err instanceof AppError) {
    return response.status(err.statusCode).json({
      status: "error",
      message: err.message,
    });
  }
  return response.status(500).json({
    status: "error",
    message: "Internal server error",
  });
});

export { app };
