import { StatusCodes } from "http-status-codes";
import mongoose from "mongoose";
import {  TErrorSources, TGenericErrorResponse } from "../interface/error";

const handleCastError = (
  error: mongoose.Error.CastError
): TGenericErrorResponse => {

  const statusCode = StatusCodes.BAD_REQUEST;
  
  const errorSources: TErrorSources = [
    {
      path: error.path,
      message: error.message,
    },
  ];

  return {
    statusCode,
    message: "Invalid ID",
    errorSources,
  };
};

export default handleCastError;
