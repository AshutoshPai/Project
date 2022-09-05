import mongoose from "mongoose";

const UserSchema = mongoose.Schema({    
    name : String,
    email : String,
    password : { required : true, type : String  }
}, {
    versionKey: false
})

const UserModel = mongoose.model("Users", UserSchema, "users");

export default UserModel;