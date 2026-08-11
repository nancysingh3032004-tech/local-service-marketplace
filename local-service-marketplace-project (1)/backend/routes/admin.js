const router=require("express").Router();
const User=require("../models/User");
const Service=require("../models/Service");
const Booking=require("../models/Booking");
const {auth,roles}=require("../middleware/auth");

router.get("/dashboard",auth,roles("admin"),async(req,res)=>{
  const [users,providers,services,bookings,revenue]=await Promise.all([
    User.countDocuments(),User.countDocuments({role:"provider"}),Service.countDocuments(),Booking.countDocuments(),
    Booking.aggregate([{$match:{paymentStatus:"paid"}},{$group:{_id:null,total:{$sum:"$amount"}}}])
  ]);
  const status=await Booking.aggregate([{$group:{_id:"$status",count:{$sum:1}}}]);
  const categories=await Booking.aggregate([{$lookup:{from:"services",localField:"service",foreignField:"_id",as:"s"}},{$unwind:"$s"},{$group:{_id:"$s.category",count:{$sum:1}}},{$sort:{count:-1}}]);
  res.json({users,providers,services,bookings,revenue:revenue[0]?.total||0,status,categories});
});
router.get("/users",auth,roles("admin"),async(req,res)=>res.json(await User.find().select("-password").sort("-createdAt")));
router.patch("/providers/:id/verify",auth,roles("admin"),async(req,res)=>{
  const p=await User.findByIdAndUpdate(req.params.id,{isVerified:true},{new:true}).select("-password");
  res.json(p);
});
module.exports=router;