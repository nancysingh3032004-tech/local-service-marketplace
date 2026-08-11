const router=require("express").Router();
const crypto=require("crypto");
const QRCode=require("qrcode");
const multer=require("multer");
const path=require("path");
const fs=require("fs");
const Booking=require("../models/Booking");
const Service=require("../models/Service");
const User=require("../models/User");
const {auth,roles}=require("../middleware/auth");

const uploadDir=path.join(__dirname,"../uploads");
fs.mkdirSync(uploadDir,{recursive:true});
const upload=multer({dest:uploadDir});

router.get("/mine",auth,async(req,res)=>{
  const filter=req.user.role==="customer"?{customer:req.user._id}:req.user.role==="provider"?{provider:req.user._id}:{};
  const data=await Booking.find(filter).populate("customer","name phone").populate("provider","name phone trustScore").populate("service","name category");
  res.json(data);
});

router.post("/",auth,roles("customer"),async(req,res)=>{
  try{
    const {serviceId,providerId,bookingType="normal",scheduledAt,address,notes}=req.body;
    const service=await Service.findById(serviceId);
    if(!service) return res.status(404).json({message:"Service not found"});
    const provider=providerId||service.provider;
    const booking=await Booking.create({
      customer:req.user._id,provider,service:service._id,bookingType,scheduledAt,address,notes,
      amount:service.basePrice+(bookingType==="emergency"?100:0),
      qrToken:crypto.randomBytes(24).toString("hex")
    });
    booking.qrData=await QRCode.toDataURL(JSON.stringify({bookingId:booking._id,token:booking.qrToken}));
    await booking.save();
    res.status(201).json(booking);
  }catch(e){res.status(500).json({message:e.message});}
});

router.patch("/:id/status",auth,roles("provider","admin"),async(req,res)=>{
  const booking=await Booking.findById(req.params.id);
  if(!booking)return res.status(404).json({message:"Booking not found"});
  if(req.user.role==="provider" && String(booking.provider)!==String(req.user._id))return res.status(403).json({message:"Not assigned to you"});
  booking.status=req.body.status;
  await booking.save();
  res.json(booking);
});

router.patch("/:id/payment",auth,roles("customer","admin"),async(req,res)=>{
  const booking=await Booking.findById(req.params.id);
  if(!booking)return res.status(404).json({message:"Booking not found"});
  booking.paymentStatus="paid"; await booking.save(); res.json(booking);
});

router.post("/:id/photos",auth,upload.fields([{name:"before",maxCount:1},{name:"after",maxCount:1}]),async(req,res)=>{
  const booking=await Booking.findById(req.params.id);
  if(!booking)return res.status(404).json({message:"Booking not found"});
  if(String(booking.provider)!==String(req.user._id))return res.status(403).json({message:"Only assigned provider can upload"});
  if(req.files.before) booking.beforePhoto="/uploads/"+path.basename(req.files.before[0].path);
  if(req.files.after) booking.afterPhoto="/uploads/"+path.basename(req.files.after[0].path);
  await booking.save(); res.json(booking);
});

router.post("/:id/verify-qr",auth,roles("customer"),async(req,res)=>{
  const booking=await Booking.findById(req.params.id);
  if(!booking || String(booking.customer)!==String(req.user._id))return res.status(404).json({message:"Booking not found"});
  if(req.body.token!==booking.qrToken)return res.status(400).json({message:"Invalid QR token"});
  booking.qrVerified=true; booking.status="completed"; await booking.save(); res.json({message:"Job verified and completed",booking});
});

router.get("/emergency",auth,async(req,res)=>{
  const providers=await User.find({role:"provider",isVerified:true}).select("-password").sort({trustScore:-1,responseTime:1});
  res.json(providers);
});
module.exports=router;