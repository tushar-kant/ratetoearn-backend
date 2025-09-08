exports.checkPhoneNumber = (req, res, next) => {
  const phoneNumber = req.headers['phonenumber'];

  next();
};
