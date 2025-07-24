import type { NextFunction, Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import type { ZodError, ZodSchema } from "zod";

import { ServiceResponse } from "@/common/models/serviceResponse";

export const handleServiceResponse = (serviceResponse: ServiceResponse<any>, response: Response) => {
  return response.status(serviceResponse.statusCode).send(serviceResponse);
};

export const validateRequest = (schema: ZodSchema) => (req: Request, res: Response, next: NextFunction) => {
  try {
    schema.parse({ body: req.body, query: req.query, params: req.params });
    next();
  } catch (err) {
    const zodError = err as ZodError;
    const errorDetails = zodError.errors.map((e) => {
      const fieldName = e.path[e.path.length - 1];
      const capitalizedFieldName = fieldName.toString().charAt(0).toUpperCase() + fieldName.toString().slice(1);

      return `Invalid ${capitalizedFieldName}: ${e.message}`;
    });
    const errorMessage = errorDetails.join(", ");
    const statusCode = StatusCodes.BAD_REQUEST;
    const serviceResponse = ServiceResponse.failure(errorMessage, null, statusCode);
    return handleServiceResponse(serviceResponse, res);
  }
};
