import mongoose from "mongoose";

const NewsSchema = new mongoose.Schema({
    title: { required: true, type: String },
    content: { required: true, type: String },
    published: { required: true, type: Date },
    author: { required: true, type: String },
    banner: { required: true, type: String },
    link: { required: true, type: String },
    image: { required: true, type: String }
})

const NewsModel = mongoose.model("news", NewsSchema, "news")

export default NewsModel;