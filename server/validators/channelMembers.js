
import { body } from "express-validator";
import { ERRORS } from "../services/ErrorHandler.js";

export const validateCreateChannelMember = [
  body("user_id")
    .notEmpty().withMessage(ERRORS.USER_ID_NOT_PROVIDED.message)
    .isInt(),

  body("channel_id")
    .notEmpty().withMessage(ERRORS.CHANNEL_ID_NOT_PROVIDED.message)
    .isInt(),

  body("role_id")
    .optional()
    .isInt().withMessage("role_id must be an integer")
];
