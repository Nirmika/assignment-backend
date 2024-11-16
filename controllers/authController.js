const User = require("../model/User");
const jwt = require("jsonwebtoken");

const createUser = async (req, res) => {
  const SECRET_KEY = process.env.SECRET_KEY;

  try {
    const user = await User.create(req.body);

    const token = jwt.sign(JSON.stringify({ id: user._id }), SECRET_KEY);

    res.status(201).json({ data: { token, user } });
  } catch (err) {
    console.log(err.message);

    res.status(500).json({ data: "Error creating user" });
  }
};

const loginUser = async (req, res) => {
  const SECRET_KEY = process.env.SECRET_KEY;
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email: email });
    if (!user) {
      return res.status(404).json({ data: "User Does not exist" });
    }
    try {
      await user.comparePassword(password);

      const token = jwt.sign(JSON.stringify({ id: user._id }), SECRET_KEY);

      res.status(200).json({ data: { token, user } });
    } catch (err) {
      return res.status(400).json({ data: "Wrong password" });
    }
  } catch (err) {
    return res.status(500).json({ data: "Internal Server Error" });
  }
};

module.exports = { createUser, loginUser };
