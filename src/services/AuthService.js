const User = require("../models/user");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { Op } = require("sequelize");

class AuthService {
  static async registerUser(data) {
    const { username, email, password, mobile } = data;

    const existingUser = await User.findOne({
      where: {
        [Op.or]: [{ email }, { username }],
      },
    });

    if (existingUser) {
      throw new Error("User with this email or username already exists");
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    return User.create({
      username,
      email,
      password: hashedPassword,
      mobile,
    });
  }

  static async loginUser(identifier, password) {
    const user = await User.findOne({
      where: {
        [Op.or]: [{ email: identifier }, { username: identifier }],
      },
    });

    if (!user) {
      throw new Error("User not found");
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      throw new Error("Invalid credentials");
    }

    const token = jwt.sign(
      { id: user.id, email: user.email },
      process.env.JWT_SECRET || "secret",
      { expiresIn: "1h" }
    );

    return { token, user: { id: user.id, username: user.username } };
  }
}

module.exports = AuthService;
