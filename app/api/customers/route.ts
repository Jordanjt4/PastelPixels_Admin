import Customer from "@/lib/models/Customer";
import { connectToDB } from "@/lib/mongoDB";
import { NextRequest, NextResponse } from "next/server";

export const GET = async (req: NextRequest) => {
    try {
        await connectToDB();
        const customers = await Customer.find().sort({ createdAt: "desc" });
        return NextResponse.json(customers, {status: 200});
    } catch (err) {
        return new NextResponse("InternalServerError", { status: 500 })
    }
}