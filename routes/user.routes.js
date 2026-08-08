import express from "express";
import User from "../models/user.model.js";
import bcrypt from "bcryptjs";

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const users = await User.find();
    res.status(200).json(users);
  } catch (error) {
    console.log(error);
    res.status(500).jason(error);
  }
});

router.post("/signup", async (req, res) => {
  try {
    const { email, username, password } = req.body;
    if (!email || !username || !password) {
      res.status(400).json({ message: "Please provide all fields" });
      return
    }

    const foundUser = await User.findOne({$or: [{email}, {username}]})
    if(foundUser){
        res.status(409).json({message: "User already exists"})
        return
    }

    const passwordRegex = /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$ %^&*-]).{8,}$/; 
    if(!passwordRegex.test(password)){
        res.status(400).json({message: "Password must be at least 8 characters long and contain an uppercase letter, a lowercase letter, a number, and a special character."})
        return
    }

    const salts = await bcrypt.genSalt(10)

    const hashedPassword = await bcrypt.hash(password, salts)

    const createdUser = await User.create({email, username, password: hashedPassword})

    res.status(201).json(createdUser)

  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
});

export default router;
