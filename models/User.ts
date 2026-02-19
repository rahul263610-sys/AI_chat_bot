import mongoose, { mongo } from "mongoose";
import { unique } from "next/dist/build/utils";

const userSchema = new mongoose.Schema({
        name : {
            type : String,
        },
        email:{
            type : String,
            required: true,
            unique: true,
        },
        password :{
            type : String,
        },
        role : {
            type: String,
            enum : ["User", "Admin"],
            default : "User",
        },
    }, {timestamps :  true}
)

export default mongoose.models.User || mongoose.model("User", userSchema);