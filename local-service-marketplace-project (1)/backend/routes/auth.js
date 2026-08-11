const router = require("express").Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

const sign = id => jwt.sign({ id }, process.env.JWT_SECRET || "dev_secret", { expiresIn: "7d" });

router.post("/register", async (req,res) => {
  try {
    const { name,email,password,role="customer",phone,address,language="en",skills=[] } = req.body;
    if (!name || !email || !password) return res.status(400).json({message:"Name, email and password are required"});
    if (await User.findOne({email})) return res.status(409).json({message:"Email already registered"});
    const user = await User.create({
      name,email,password:await bcrypt.hash(password,10),
      role: role === "admin" ? "customer" : role,phone,address,language,skills,
      isVerified: role === "customer"
    });
    res.status(201).json({token:sign(user._id), user:{id:user._id,name:user.name,email:user.email,role:user.role}});
  } catch(e){res.status(500).json({message:e.message});}
});

router.post("/login", async (req,res) => {
  try {
    const {email,password}=req.body;
    const user=await User.findOne({email});
    if(!user || !(await bcrypt.compare(password,user.password))) return res.status(401).json({message:"Invalid email or password"});
    res.json({token:sign(user._id),user:{id:user._id,name:user.name,email:user.email,role:user.role}});
  } catch(e){res.status(500).json({message:e.message});}
});
module.exports=router;