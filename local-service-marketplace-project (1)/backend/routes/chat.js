const router=require("express").Router();
const Message=require("../models/Message");
const {auth}=require("../middleware/auth");
router.get("/:bookingId",auth,async(req,res)=>{
  res.json(await Message.find({booking:req.params.bookingId}).populate("sender","name role").sort("createdAt"));
});
router.post("/:bookingId",auth,async(req,res)=>{
  const msg=await Message.create({booking:req.params.bookingId,sender:req.user._id,text:req.body.text||"",attachment:req.body.attachment||""});
  res.status(201).json(await msg.populate("sender","name role"));
});
module.exports=router;