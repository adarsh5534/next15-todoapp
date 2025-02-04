import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import Todos from "../../../../models/Todos";
import dbConnect from "../../../../utils/dbConnect";
import { authOptions } from "../../../../utils/authOptions";

export async function POST(req) {
    try {
        const session = await getServerSession(authOptions);
        console.log(session)
        if (!session) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        await dbConnect();
        const data = await req.json();

        const newTask = new Todos(data);

        await newTask.save();
        return NextResponse.json({ message: "New Task Created Successfully" });

    } catch (err) {
        console.error("Error:", err);
        return NextResponse.json(
            { error: "Something went wrong, please try again later" },
            { status: 500 }
        );
    }
}
