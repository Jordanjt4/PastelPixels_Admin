import Collection from "@/lib/models/Collections";
import { connectToDB } from "@/lib/mongoDB";
import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";

// api route for handling creation of a collection
// makes sure all fields are valid before creating the new collection in the db
export const POST = async (req: NextRequest) => {
    try {
        const { userId } = await auth()

        if (!userId) {
            return new NextResponse("Unauthorized", {status: 403})
        }

        await connectToDB()

        const {title, description, image} = await req.json()

        const existingCollection = await Collection.findOne({title})
        if (existingCollection) {
            return new NextResponse("Collection already exists", {status: 400})
        }

        if (!title || !image || image.length === 0) {
            return new NextResponse("Title and image are required", {status: 400}) 
        }

        const newCollection = await Collection.create({
            title,
            description,
            image,
        })

        return NextResponse.json(newCollection, {status: 200})
    } catch (err) {
        console.log("[collections_POST]", err)
        return new NextResponse("InternalServerError", {status: 500})
    }
}

export const GET = async (req: NextRequest) => {
    try {
        await connectToDB()

        const collections = await Collection.find().sort({createdAt: "desc"})

        return NextResponse.json(collections, {status: 200})
    } catch (err) {
        console.log("collections_GET", err)
        return new NextResponse("InternalServerError", {status: 500})
    }
}