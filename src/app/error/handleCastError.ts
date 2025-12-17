import { StatusCodes } from "http-status-codes";
import mongoose from "mongoose";
import { TErrorSource, TGenericErrorResponse } from "../interface/error";

const handleCastError = (
  error: mongoose.Error.CastError
): TGenericErrorResponse => {

  const statusCode = StatusCodes.BAD_REQUEST;
  
  const errorSources: TErrorSource = [
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
