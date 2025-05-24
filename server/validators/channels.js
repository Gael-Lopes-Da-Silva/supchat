import { body } from "express-validator";
import { ERRORS } from "../services/ErrorHandler.js";


export const validateCreateChannel = [
  body("user_id")
    .notEmpty().withMessage(ERRORS.USER_ID_NOT_PROVIDED.message)
    .isInt().withMessage("user_id must be an integer"),

  body("workspace_id")
    .notEmpty().withMessage(ERRORS.WORKSPACE_ID_NOT_PROVIDED.message)
    .isInt().withMessage("workspace_id must be an integer"),

  body("name")
    .notEmpty().withMessage(ERRORS.NAME_NOT_PROVIDED.message)
    .isString().withMessage("Channel name must be a string"),

  body("is_private")
    .optional()
    .isBoolean().withMessage("is_private must be a boolean")
];
