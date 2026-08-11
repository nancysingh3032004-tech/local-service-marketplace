const router=require("express").Router();
const Review=require("../models/Review");
const Booking=require("../models/Booking");
const User=require("../models/User");
const {auth,roles}=require("../middleware/auth");

router.post("/",auth,roles("customer"),async(req,res)=>{
  const {bookingId,rating,comment}=req.body;
  const booking=await Booking.findById(bookingId);
  if(!booking || String(booking.customer)!==String(req.user._id) || booking.status!=="completed") return res.status(400).json({message:"Review allowed only for your completed booking"});
  if(await Review.findOne({booking:bookingId})) return res.status(409).json({message:"Already reviewed"});
  const review=await Review.create({booking:bookingId,customer:req.user._id,provider:booking.provider,rating,comment});
  const reviews=await Review.find({provider:booking.provider});
  const avg=reviews.reduce((s,r)=>s+r.rating,0)/reviews.length;
  const provider=await User.findById(booking.provider);
  provider.trustScore=Math.round((avg*12)+(provider.completionRate*0.2)+(Math.max(0,100-provider.responseTime)/10));
  await provider.save();
  res.status(201).json(review);
});
router.get("/provider/:id",async(req,res)=>res.json(await Review.find({provider:req.params.id}).populate("customer","name")));
module.exports=router;