const AuthService = require("../services/AuthService");

exports.signup = async (req, res) => {
  try {
    const { username, email, password, mobile } = req.body;

    if (!username || !email || !password) {
      return res
        .status(400)
        .json({ error: "Username, email, and password are required" });
    }
    const result = await AuthService.registerUser({
      username,
      email,
      password,
      mobile,
    });
    res.status(201).json(result);
  } catch (error) {
    if (error.message === "User with this email or username already exists") {
      return res.status(409).json({ error: error.message });
    }
    console.error("Signup Error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

exports.login = async (req, res) => {
  try {
    const { userName, password } = req.body;
    if (!userName || !password) {
      return res
        .status(400)
        .json({ error: "Username/Email and password are required" });
    }
    const result = await AuthService.loginUser(userName, password);
    res.status(200).json(result);
  } catch (error) {
    if (
      error.message === "User not found" ||
      error.message === "Invalid credentials"
    ) {
      return res
        .status(401)
        .json({ error: "Invalid username/email or password" });
    }

    console.error("Login Error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
