const router=require("express").Router();
const PDFDocument=require("pdfkit");
const Booking=require("../models/Booking");
const {auth}=require("../middleware/auth");

router.get("/:id/pdf",auth,async(req,res)=>{
  const b=await Booking.findById(req.params.id).populate("customer","name email address").populate("provider","name");
  if(!b)return res.status(404).json({message:"Booking not found"});
  res.setHeader("Content-Type","application/pdf");
  res.setHeader("Content-Disposition",`inline; filename=invoice-${b._id}.pdf`);
  const doc=new PDFDocument(); doc.pipe(res);
  doc.fontSize(20).text("LOCAL SERVICE MARKETPLACE",{align:"center"}).moveDown();
  doc.fontSize(14).text("DIGITAL INVOICE").moveDown();
  doc.fontSize(11).text(`Invoice: ${b.invoiceNumber||b._id}`);
  doc.text(`Customer: ${b.customer.name} (${b.customer.email})`);
  doc.text(`Provider: ${b.provider.name}`);
  doc.text(`Service: ${b.service || ""}`);
  doc.text(`Booking Type: ${b.bookingType}`);
  doc.text(`Status: ${b.status}`);
  doc.text(`Payment: ${b.paymentStatus}`);
  doc.text(`Total Amount: ₹${b.amount}`);
  doc.end();
});
module.exports=router;