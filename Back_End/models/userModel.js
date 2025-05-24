import mongoose from "mongoose";
import bcrypt from 'bcrypt'
import dotenv from 'dotenv'

dotenv.config();

const userSchema = mongoose.Schema({
  email: { type: String, required: true , unique : true},
  name: { type: String, required: true },
  password: { type: String, required: true },
  videoUrls: { type: [{name : {type : String , required : true} , url : {type : String, required : true}}], required: true },
  audioUrls: { type: [String] },
});

userSchema.pre("save" , async function (next) {
    if(!this.isModified("password")){
        return next();
    }
    this.password = await bcrypt.hash(this.password , parseInt(process.env.BCRYPT_SALT_ROUNDS));
    next();
})

userSchema.methods.matchPassword = function(enteredPassword){
   return bcrypt.compare(enteredPassword , this.password)
}


const User = mongoose.model("User", userSchema);
export default User;