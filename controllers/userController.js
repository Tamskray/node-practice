const User = require("../models/User.js");

class UserController {
  async getUsers(req, res) {
    try {
      const users = await User.find();
      res.status(200).json(users);
    } catch (err) {
      res.status(404).json(err);
    }
  }

  async getUserById(req, res) {
    try {
      const userId = req.params.id;
      const user = await User.findById(userId);
      await user.populate("tasks");
      res.status(200).json(user);
    } catch (err) {
      res.status(404).json(err);
    }
  }

  async signup(req, res) {
    const { name, age, email, password } = req.body;

    let existingUser;
    try {
      existingUser = await User.findOne({ email: email });
    } catch (err) {
      return res
        .status(500)
        .json({ message: "Signing up failed, please try again later" });
    }

    if (existingUser) {
      return res
        .status(400)
        .json({ message: "User with this email already exists" });
    }

    const newUser = new User({
      name,
      age,
      email,
      password,
    });

    try {
      await newUser.save();
    } catch (err) {
      return res.status(400).json({ message: "Cannot save user" });
    }

    res.status(201).json(newUser);
  }

  async updateUser(req, res) {
    const { name, age, email, password } = req.body;
    const userId = req.params.id;

    let existingUser;
    try {
      existingUser = await User.findById(userId);

      if (!existingUser) {
        return res.status(404).json({ message: "User not found" });
      }
    } catch (err) {
      return res
        .status(500)
        .json({ message: "Something went wrong, could not find a user" });
    }

    existingUser.name = name;
    existingUser.age = age;
    existingUser.email = email;
    existingUser.password = password;

    try {
      await existingUser.save();
    } catch (err) {
      return res.status(400).json({ message: "Cannot save user" });
    }

    res.status(200).json(existingUser);
  }

  async deleteUser(req, res) {
    const userId = req.params.id;

    try {
      const deletedUser = await User.findByIdAndDelete(userId);

      if (!deletedUser) {
        return res.status(404).json({ message: "User Not Found" });
      }

      res.status(200).json({ message: "User deleted successfully" });
    } catch (err) {
      res.status(500).json({ message: "Cannot delete user" });
    }
  }

  async deleteAllUsers(req, res) {
    try {
      await User.deleteMany({});
      res.status(200).json({ message: "All users deleted successfully" });
    } catch (err) {
      res.status(500).json({ error: "Cannot delete users" });
    }
  }

  async login(req, res) {
    try {
      const { email, password } = req.body;

      const user = await User.findOneByCredentials(email, password);
      const token = await user.generateAuthToken();

      res.status(200).json({ user, token });
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  }

  async logout(req, res) {
    try {
      req.user.tokens = req.user.tokens.filter((token) => {
        return token.token != req.token;
      });

      await req.user.save();
      res.json({ message: "Logout successfully" });
    } catch (err) {
      res.status(500).send();
    }
  }

  async logoutAll(req, res) {
    try {
      req.user.tokens = [];

      await req.user.save();

      res.json({ message: "Logged out from all sessions successfully" });
    } catch (err) {
      res.status(500).send();
    }
  }
}

module.exports = new UserController();
