const cleanUpUser = (user, lean = false) => {
  const source = lean ? user : user._doc;
  const {
    password,
    isVerified,
    updatedAt,
    __v,
    _id,
    otp,
    otpExpiry,
    result,
    ...safeuser
  } = source;



  return {...safeuser};
};
export default cleanUpUser;
