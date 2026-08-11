import express from "express";
import User from "../models/user.model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import isAuth from "../middleware/isAuth.middleware.js";

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const users = await User.find();
    res.status(200).json(users);
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
});

router.post("/signup", async (req, res) => {
  try {
    const { email, username, password } = req.body;
    if (!email || !username || !password) {
      return res.status(400).json({ message: "Please provide all fields" });
      }

    const foundUser = await User.findOne({ $or: [{ email }, { username }] });
    if (foundUser) {
      return res.status(409).json({ message: "User already exists" });
    }

    const passwordRegex =
      /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$ %^&*-]).{8,}$/;
    if (!passwordRegex.test(password)) {
      res.status(400).json({
        message:
          "Password must be at least 8 characters long and contain an uppercase letter, a lowercase letter, a number, and a special character.",
      });
      return;
    }

    if(username.length > 16){
        return res.status(400).json({message: "Username cannot be longer than 16 characters."})
    }

    const salts = await bcrypt.genSalt(10);

    const hashedPassword = await bcrypt.hash(password, salts);

    const createdUser = await User.create({
      email,
      username,
      password: hashedPassword,
    });

    res.status(201).json(createdUser);
  } catch (error) {
    if (error.code === 11100) {
      return res.status(409).json({ message: "User already exists" });
    }
    console.log(error);
    res.status(500).json(error);
  }
});

router.post("/login", async (req, res) => {
  try {
    const { email, username, password } = req.body;
    if ((!email && !username) || !password) {
      return res.status(400).json({
        message: "Please provide your email or username and your password",
      });
    }
    const foundUser = await User.findOne({ $or: [{ email }, { username }] });

    if (!foundUser) {
      return res.status(404).json({ message: "This user does not exist" });
    }

    const passwordCheck = await bcrypt.compare(password, foundUser.password);

    if (!passwordCheck) {
      return res.status(401).json({ message: "Password incorrect" });
    }

    // foundUser is a mongoose document. Transform to a JS object and delete password
    const userObj = foundUser.toObject();
    delete userObj.password;

    const payload = {
      _id: userObj._id,
      username: userObj.username,
      email: userObj.email
    };

    const token = await jwt.sign({ payload }, process.env.TOKEN_SECRET, {
      algorithm: "HS256",
      expiresIn: "1h",
    });

    res
      .status(200)
      .json({ message: "Logged in successfully", token, user: userObj });
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
});

router.get("/verify", isAuth, (req, res) => {
  console.log(req.user);
  res.status(200).json({ user: req.user });
});

export default router;
