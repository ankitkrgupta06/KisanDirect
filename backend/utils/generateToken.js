const jwt = require("jsonwebtoken");

const generateToken = (id) => {
  console.log("JWT_SECRET exists:", !!process.env.JWT_SECRET);

  return jwt.sign(
    {
      id,
    },
    process.env.JWT_SECRET,
    {
      expiresIn: "7d",
    }
  );
};

module.exports = generateToken;