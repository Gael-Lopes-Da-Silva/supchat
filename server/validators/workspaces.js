import { body } from "express-validator";
import { ERRORS } from "../services/ErrorHandler.js";

export const validateCreateWorkspace = [
  body("name")
    .notEmpty().withMessage(ERRORS.NAME_NOT_PROVIDED.message),

  body("user_id")
    .notEmpty().withMessage(ERRORS.USER_ID_NOT_PROVIDED.message)
    .isInt().withMessage("user_id must be an integer"),

  body("description")
    .optional()
    .isString().withMessage("Description must be a string"),

  body("is_private")
    .optional()
    .isBoolean().withMessage("is_private must be a boolean")
];
