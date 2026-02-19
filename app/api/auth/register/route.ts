import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import User from "@/models/User";
import { connectDB } from "@/lib/mongodb";

export async function POST(req : Request){
    try{
        await connectDB();
        const {name, email, password, role} = await req.json();

        if(!email){
            return NextResponse.json(
                {message: "email fields is required"},
                {status: 400},
            )
        }
        const existingUser = await User.findOne({email});
        if(existingUser){
            return NextResponse.json(
                {message : "User with this email ID already exist"},
                {status: 400},
            )
        }
        const hashPassword = await bcrypt.hash(password, 10);

        const newUser = await User.create({
            name, 
            email, 
            password : hashPassword, 
            role: role || "User",
        })

        return NextResponse.json({
            message : "User created successfully",
            user: {
                _id: newUser._id.toString(),
                name: newUser.name,
                email: newUser.email,
                role: newUser.role,
            },
            status : 200,
        });
    }
    catch (error) {
        return NextResponse.json(
            { message: error },
            { status: 500 }
        );
    }
}