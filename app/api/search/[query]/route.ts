import Product from "@/lib/models/Products";
import { connectToDB } from "@/lib/mongoDB";
import { NextRequest, NextResponse } from "next/server";

export const GET = async (req: NextRequest, {params}: {params: Promise<{query: string}>}) => {
    try {
        await connectToDB();
        const {query} = await params
        // return where any of these are true, where it might be partial match, case insensitive, and by tag
        const searchedProducts = await Product.find({
            $or: [
                {title: {$regex: query, $options: "i"}},
                {category: {$regex: query, $options: "i"}},
                {tags: {$in: [new RegExp(query, "i")]}}
            ]
        })

        return NextResponse.json(searchedProducts, {status: 200})
    } catch (err) {
        console.log("[search_GET]", err);
        return new NextResponse("InternalServerError", {status: 500});
    }
}