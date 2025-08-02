import express from "express";
const router = express.Router();
import { login, Stats, register, verifyOtp } from "../controllers/admin.controller.js";
import tryCatch from "../utils/tryCatch.js";
import { body } from "express-validator";
import logerAuthenticate from "../middlewares/isAdminLoggedIn.js";

router.post(
  "/register",
  [
    body("name")
      .notEmpty()
      .isString()
      .isLength({ min: 1, max: 20 })
      .withMessage("Name must be in 1 to 20 Charecter"),
    body("email").notEmpty().isEmail().withMessage("Email is not varified!"),
    body("password").notEmpty().isString().isLength({min:8, max:20}).withMessage("Password must be in 8 to 20 Charecter"),
  ],
  tryCatch(register)
);

router.post(
  "/login",
  [
    body("email").isEmail().withMessage("Email is not verified"),
    body("password")
      .isLength({ min: 6 })
      .withMessage("Password must above of 6 Charecters"),
  ],
  tryCatch(login)
);

router.post(
  "/verify-otp",
  [
    body("otp")
      .isLength({ min: 6, max: 6 })
      .withMessage("otp must be 6 charecters"),
    body("email").isEmail().withMessage("Something went wrong Please try again!"),
  ],
  tryCatch(verifyOtp)
);

router.get("/stats", logerAuthenticate, tryCatch(Stats));

export default router;
