import { NextResponse } from "next/server";
import dbConnect from "../../../../utils/dbConnect";
import { getServerSession } from "next-auth";
import { authOptions } from "../../../../utils/authOptions";
import mongoose from "mongoose";
import Todos from "../../../../models/Todos";


export async function POST(req) {
    try {
        const session = await getServerSession(authOptions);
        console.log(session)
        if (!session) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        await dbConnect();

        const { searchParams } = new URL(req.url);
        const id = searchParams.get("id");
        const result = await Todos.deleteOne({ _id: new mongoose.Types.ObjectId(id) });
        if (result.deletedCount !== 1) {
            return NextResponse.json(
                {error: "Error Deleting Task"},
                { status: 400 }
            )
        }

        return NextResponse.json({message: "Task Deleted Successfully"})
    } catch (err) {
        console.error("Error:", err);
        return NextResponse.json(
            { error: "Something went wrong, please try again later" },
            { status: 500 }
        );
    }
}