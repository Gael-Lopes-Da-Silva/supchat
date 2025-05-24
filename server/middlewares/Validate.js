import { validationResult } from "express-validator";
import { ERRORS, createErrorResponse } from "../services/ErrorHandler.js";

export const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    const firstError = errors.array()[0];
    return res.status(400).json(
      createErrorResponse(ERRORS.INVALID_INPUT, firstError.msg)
    );
  }

  next();
};
