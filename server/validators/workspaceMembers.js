import { body } from "express-validator";
import { ERRORS } from "../services/ErrorHandler.js";

export const validateCreateWorkspaceMember = [
  body("user_id")
    .notEmpty().withMessage(ERRORS.USER_ID_NOT_PROVIDED.message)
    .isInt().withMessage("user_id must be an integer"),

  body("workspace_id")
    .notEmpty().withMessage(ERRORS.WORKSPACE_ID_NOT_PROVIDED.message)
    .isInt().withMessage("workspace_id must be an integer"),

  body("role_id")
    .notEmpty().withMessage(ERRORS.ROLE_ID_NOT_PROVIDED.message)
    .isInt().withMessage("role_id must be an integer")
];
