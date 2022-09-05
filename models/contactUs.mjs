import mongoose from "mongoose";

const ContactUsSchema = new mongoose.Schema({
    email : { required : true, type : String },
    query : { required : true, type : String },
}, {
    versionKey: false
})

const ConatctUsModel = mongoose.model("contactUs", ContactUsSchema , "contactUs")

export default ConatctUsModel;