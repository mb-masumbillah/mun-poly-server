import { StatusCodes } from "http-status-codes";
import { TErrorSource } from "../interface/error";

const handleDuplicateError = (error: any) => {
  const statusCode = StatusCodes.BAD_REQUEST;

  const match = error.message.match(/"([^"]*)"/);
  const extractedMessage = match && match[1];

  const errorSources: TErrorSource = [
    {
      path: "",
      message: `${extractedMessage} is already exists`,
    },
  ];

  return {
    statusCode,
    message: `${extractedMessage} is already exists`,
    errorSources,
  };
};

export default handleDuplicateError;
