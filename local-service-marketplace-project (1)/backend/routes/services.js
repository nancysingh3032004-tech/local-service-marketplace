const router=require("express").Router();
const Service=require("../models/Service");
const User=require("../models/User");
const {auth,roles}=require("../middleware/auth");

router.get("/",async(req,res)=>{
  const filter={};
  if(req.query.category) filter.category=req.query.category;
  if(req.query.q) filter.$or=[{name:new RegExp(req.query.q,"i")},{category:new RegExp(req.query.q,"i")}];
  const services=await Service.find(filter).populate("provider","name trustScore responseTime completionRate isVerified");
  res.json(services);
});
router.get("/providers",async(req,res)=>{
  const providers=await User.find({role:"provider"}).select("-password").sort({trustScore:-1});
  res.json(providers);
});
router.post("/",auth,roles("provider","admin"),async(req,res)=>{
  const service=await Service.create({...req.body,provider:req.user._id});
  res.status(201).json(service);
});
router.put("/:id",auth,roles("provider","admin"),async(req,res)=>{
  const service=await Service.findById(req.params.id);
  if(!service) return res.status(404).json({message:"Service not found"});
  if(req.user.role==="provider" && String(service.provider)!==String(req.user._id)) return res.status(403).json({message:"Not your service"});
  Object.assign(service,req.body); await service.save(); res.json(service);
});
module.exports=router;