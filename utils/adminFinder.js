import Admin from "../models/admin.model.js";
import { NotFoundError } from "./errors.js";

const adminFinder = async ({
  key,
  query,
  includePassword = false,
  lean = false,
  select = null,
}) => {
  try {
    if (!key || !query)
      throw new NotFoundError("Key or query missing in adminFinder");

    let selectFields = select || (includePassword ? "+password" : "-password");

    let adminQuery = Admin.findOne({ [key]: query }).select(selectFields);

    if (lean) {
      adminQuery = adminQuery.lean();
    }

    const admin = await adminQuery;
    return admin || null;
  } catch (err) {
    console.error("adminFinder error:", err.message);
    throw new NotFoundError("Admin not found or error in query");
  }
};
export default adminFinder;
