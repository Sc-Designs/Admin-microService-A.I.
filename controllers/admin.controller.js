import adminFinder from '../utils/adminFinder.js';
import createOtp from '../utils/otpMaker.js';
import sendEmail from '../utils/EmailSender.js';
import { validationResult } from "express-validator";
import crypto from 'crypto';
import adminModel from '../models/admin.model.js';
import RegisterAdminService from '../services/admin.service.js';
import cleanUpAdmin from '../utils/cleanUpAdmin.js';
import fetchOrgStats from '../services/FetchOrg.service.js';
import fetchUserStats from '../services/FetchUser.service.js';


const register = async (req,res)=>{
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  const count = await adminModel.countDocuments();
  if(count > 2) {
    return res.status(403).json({message: "Not Allowed by Ai Interviewer!"})
  }
   const { name, email, password } = req.body;
   const ExistingAdmin = await adminFinder({
     key: "email",
     query: email.toLowerCase().trim(),
     lean: true,
   });
   if (ExistingAdmin) {
     return res
       .status(406)
       .json({ message: "Admin already Exist, please Login." });
   }
   const otp = createOtp(6);
   const hashedOtp = crypto.createHash("sha256").update(otp).digest("hex");
   const newAdmin = await RegisterAdminService({
     name,
     email,
     password,
     otp: hashedOtp,
   });
   res.status(201).json("Okk");
   await sendEmail({
     email,
     sub: "OTP Recive",
     mess: `Admin OTP is ${otp}`,
   });
}

const login = async (req,res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  const { email, password } = req.body;
  const admin = await adminFinder({
    key: "email",
    query: email.toLowerCase().trim(),
    includePassword: true,
  });
  if (!admin)
    return res
      .status(404)
      .json({ message: "email or password something wrong!" });
  const isMatch = await admin.comparePassword(password);
  if (!isMatch)
    return res.status(404).json("email or password something wrong!");
  const otp = createOtp(6);
  const hashedOtp = crypto.createHash("sha256").update(otp).digest("hex");
  admin.otp = hashedOtp;
  admin.otpExpiry = Date.now() + +process.env.OTP_EXPIRY_MS;
  await admin.save();
  res.status(200).json("Valid");
  await sendEmail({
    email,
    sub: "OTP Recive",
    mess: `Admin OTP is ${otp}`,
  });
}

const verifyOtp = async (req, res) => {
  const { email, otp } = req.body;
  const admin = await adminFinder({
    key: "email",
    query: email.toLowerCase().trim(),
  });
  if (!admin)
    return res
      .status(404)
      .json({ message: "email or password something wrong!" });
  const hashedOtp = crypto.createHash("sha256").update(otp).digest("hex");
  if (!admin || admin.otp !== hashedOtp || admin.otpExpiry < Date.now()) {
    return res.status(400).json({ message: "Invalid or expired OTP" });
  }
  admin.otp = null;
  admin.otpExpiry = null;
  await admin.save();
  const token = admin.generateToken();
  res.json({
    token,
    admin: cleanUpAdmin(admin),
  });
};

const Stats = async (req, res) => {
  try {
    const { filter } = req.query;

    if (!["Weekly", "Monthly", "Yearly"].includes(filter)) {
      return res.status(400).json({ error: "Invalid filter value" });
    }

    const [userStats, orgStats] = await Promise.all([
      fetchUserStats(filter, req.token),
      fetchOrgStats(filter, req.token),
    ]);

    const format = (data) => {
      return data.map((d) => {
        if (d._id.week)
          return { label: `W${d._id.week}/${d._id.year}`, count: d.count };
        if (d._id.month)
          return { label: `${d._id.month}/${d._id.year}`, count: d.count };
        return { label: `${d._id.year}`, count: d.count };
      });
    };

    const userFormatted = format(userStats);
    const orgFormatted = format(orgStats);

    const allLabels = [
      ...new Set([
        ...userFormatted.map((d) => d.label),
        ...orgFormatted.map((d) => d.label),
      ]),
    ].sort();

    const alignData = (arr, labels) =>
      labels.map((label) => {
        const found = arr.find((d) => d.label === label);
        return found ? found.count : 0;
      });

    res.json({
      labels: allLabels,
      userData: alignData(userFormatted, allLabels),
      orgData: alignData(orgFormatted, allLabels),
    });
  } catch (error) {
    console.error("Stats fetch error:", error);
    res.status(500).json({ error: "Failed to fetch stats" });
  }
};


const GetProfile = async (req, res) => {
  const admin = await adminFinder({
    key: "_id",
    query: req.admin._id,
    lean: true,
  });
  if (!admin) {
    return res.status(404).json({ message: "Admin not found" })
  }


  return res.status(200).json({
    admin: cleanUpAdmin(admin, true),
  });
};

export { login, Stats, register, verifyOtp, GetProfile };