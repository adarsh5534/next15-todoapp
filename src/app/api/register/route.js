import { NextResponse } from "next/server";
import User from "../../../../models/User";
import bcrypt from 'bcrypt';
import dbConnect from "../../../../utils/dbConnect";

export async function POST(req) {
    try {
        await dbConnect();
        const body = await req.json();
        const { name, email, password } = body;

        if(!name || !email || !password){
            return NextResponse.json({error: ""}, {status:400});
        }

        if(await User.findOne({email})){
            return NextResponse.json({ error: "Email is already registered" }, { status: 409 });
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        await new User({
            name,
            email,
            password: hashedPassword
        }).save();

        return NextResponse.json({ message: "User registered successfully" });
    } catch (err) {
        console.log("Error", err);
        return NextResponse.json({ error: "Something went wrong, please try again later" }, { status: 500 });
    }
}