const User = require("../model/User");

const fetchUserById = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findOne({ _id: id })
      .populate("cars")
    
    if (!user) {
      return res
        .status(404)
        .json({data: "User does not exist" });
    }
    res.status(200).json({ data: user });
  } catch (err) {
    res.status(500).json({ data: "Error fetching the User" });
  }
};



module.exports = { fetchUserById };
