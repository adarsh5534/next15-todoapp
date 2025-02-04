import { NextResponse } from "next/server";
import User from "../../../../models/User";
import dbConnect from "../../../../utils/dbConnect";

export async function GET(req) {
    try {
        await dbConnect();
        const { searchParams } = new URL(req.url);
        const email = searchParams.get("email");
        const user = await User.findOne({email}).select("-password");
        if (!user) {
            return NextResponse.json({message:"User not found"}, {status: 404});
        }
        return NextResponse.json(user);
    } catch (err) {
        console.log(err);
        return NextResponse.json({
            error: "Something went wrong, please try again later",
            status: 500
        })
    }
}