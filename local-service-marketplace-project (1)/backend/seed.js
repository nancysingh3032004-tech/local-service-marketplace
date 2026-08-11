require("dotenv").config();
const mongoose=require("mongoose"),bcrypt=require("bcryptjs");
const User=require("./models/User"),Service=require("./models/Service");
(async()=>{
 await mongoose.connect(process.env.MONGO_URI||"mongodb://127.0.0.1:27017/local_service_marketplace");
 await User.deleteMany({}); await Service.deleteMany({});
 const pass=async p=>bcrypt.hash(p,10);
 const admin=await User.create({name:"System Admin",email:"admin@lsm.local",password:await pass("Admin@123"),role:"admin",isVerified:true});
 const provider=await User.create({name:"Verified Service Provider",email:"provider@lsm.local",password:await pass("Provider@123"),role:"provider",phone:"9876543210",address:"Patna",skills:["Plumbing","Electrical"],isVerified:true,trustScore:88,responseTime:20});
 await User.create({name:"Demo Customer",email:"customer@lsm.local",password:await pass("Customer@123"),role:"customer",phone:"9876500000",address:"Patna"});
 await Service.insertMany([
  {name:"Plumbing Repair",category:"Plumbing",description:"Leak, pipe and tap repair",basePrice:499,provider:provider._id},
  {name:"Electrical Repair",category:"Electrical",description:"Switch, wiring and electrical fault repair",basePrice:399,provider:provider._id},
  {name:"Home Cleaning",category:"Cleaning",description:"Basic home cleaning service",basePrice:699,provider:provider._id},
  {name:"Appliance Service",category:"Appliance",description:"General appliance inspection and repair",basePrice:599,provider:provider._id}
 ]);
 console.log("Seed complete"); process.exit();
})();