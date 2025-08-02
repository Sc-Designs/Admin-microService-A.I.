import adminModel from "../models/admin.model.js";
import { BadRequestError } from "../utils/errors.js";

const RegisterAdminService = async ({ name, email, password, otp }) => {
  if (
    (!name || name == null || name == undefined) &&
    (!email || email == null || email == undefined) &&
    (!password || password == null || password == undefined)
  ) {
    throw new BadRequestError();
  }
  const hashedPassword = await adminModel.hashPassword(password);
  const admin = await adminModel.create({
    name,
    email,
    password: hashedPassword,
    otp,
    otpExpiry: Date.now() + Number(process.env.OTP_EXPIRY_MS),
  });
  return admin;
};

export default RegisterAdminService;
