import { body } from "express-validator";
import { ERRORS } from "../services/ErrorHandler.js";

export const validateUserCreation = [
  body("username")
    .notEmpty().withMessage(ERRORS.USERNAME_NOT_PROVIDED.message)
    .isLength({ min: 3 }).withMessage("Username must be at least 3 characters"),

  body("email")
    .notEmpty().withMessage(ERRORS.EMAIL_NOT_PROVIDED.message)
    .isEmail().withMessage(ERRORS.INVALID_EMAIL_FORMAT.message),

  body("password")
    .notEmpty().withMessage(ERRORS.PASSWORD_NOT_PROVIDED.message)
    .isLength({ min: 6 }).withMessage(ERRORS.PASSWORD_TOO_WEAK.message)
];

export const validateUserLogin = [
  body("email")
    .notEmpty().withMessage(ERRORS.EMAIL_NOT_PROVIDED.message)
    .isEmail().withMessage(ERRORS.INVALID_EMAIL_FORMAT.message),

  body("password")
    .notEmpty().withMessage(ERRORS.PASSWORD_NOT_PROVIDED.message)
];
