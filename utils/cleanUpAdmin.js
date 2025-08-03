const cleanUpAdmin = (admin, lean = false) => {
  const source = lean ? admin : admin._doc;
  const {
    password,
    updatedAt,
    __v,
    _id,
    otp,
    otpExpiry,
    avtarProfileId,
    lastLogin,
    ...safeadmin
  } = source;

  return { ...safeadmin };
};
export default cleanUpAdmin;
