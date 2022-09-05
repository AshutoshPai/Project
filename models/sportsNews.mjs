import mongoose from "mongoose";

const SportsNewsSchema = new mongoose.Schema({
    title : { required : true, type : String },
    content : { required : true, type : String },
    published : { required : true, type : Date },
    author : { required : true, type : String },
    banner : { required : true, type : String },
    link : { required : true, type : String },
    image : { required : true, type : String }
})

const SportsNewsModel = mongoose.model("sportsNews", SportsNewsSchema , "sportsNews")

export default SportsNewsModel;