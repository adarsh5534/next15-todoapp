import { NextResponse } from "next/server";
import dbConnect from "../../../../utils/dbConnect";
import Todos from "../../../../models/Todos";
import { getServerSession } from "next-auth";
import { authOptions } from "../../../../utils/authOptions";

export async function GET(req)
{
    try
    {
        await dbConnect();
        const session = await getServerSession(authOptions);
        if (!session) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }
        const { searchParams } = new URL(req.url);
        const id = searchParams.get("id");
        if (!id) {
          return NextResponse.json({ error: "ID parameter is required" }, { status: 400 });
        }
        
        const userTasks = await Todos.find({userId: id}).lean();
        return NextResponse.json(userTasks);
    } catch (err)
    {
        console.error("Error:", err);
        return NextResponse.json(
            { error: "Something went wrong, please try again later" },
            { status: 500 }
        );
    }
}