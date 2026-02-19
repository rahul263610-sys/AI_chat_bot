import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { connectDB } from "@/lib/mongodb";
import  Jwt  from "jsonwebtoken";
import User from "@/models/User";
import { hash } from "crypto";

export async function POST(req: Request){
    try{
        await connectDB();
        const {email, password} = await req.json();
        if(!email || !password){
            return NextResponse.json(
                {message : "Email and password are required"},
                {status: 400}
            )
        }
        const user = await User.findOne({email});

        if(!user){
            return NextResponse.json(
                {message: "Invalid credentials"},
                {status: 400}
            )
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if(!isMatch){
            return NextResponse.json(
                {message: "Invalid credentials"},
                {status: 400}
            )
        }
        const token = Jwt.sign(
            {
                id: user._id,
                role: user.role,
            },
            process.env.JWT_SECRET!,
            {expiresIn: "7d"}
        );

        const response = NextResponse.json({
            message: "Login Successfully",
            user: {
                _id: user._id.toString(),
                role: user.role,
            },
        });
        response.cookies.set("token", token, {
            httpOnly: true,
            secure: true,        
            sameSite: "none",     
            path: "/",
            maxAge: 60 * 60 * 24 * 7,
        });


        return response;

    }
    catch (error) {
        return NextResponse.json(
            { message: "Server error" },
            { status: 500 }
        );
    }
}