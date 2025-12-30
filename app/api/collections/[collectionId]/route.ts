import Collection from "@/lib/models/Collections";
import Product from "@/lib/models/Products";
import { connectToDB } from "@/lib/mongoDB";
import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest, {params}: {params: Promise<{collectionId: string}>}) {
    try {
        await connectToDB()
        const {collectionId} = await params;

        const collection = await Collection.findById(collectionId)

        if (!collection) {
            return new NextResponse(JSON.stringify({message: "Collection not found"}), {status: 404})
        }

        return NextResponse.json(collection, {status: 200})
    } catch (err) {
        console.log("[collectionId_GET", err)
        return new NextResponse("InternalServerError", {status: 500})
    }
}

export async function POST(req: NextRequest, {params}: {params: Promise<{collectionId: string}>}) {
    try {
        const {userId} = await auth()

        if (!userId) {
            return new NextResponse("Unauthorized", {status: 401})
        }

        await connectToDB()

        const {collectionId} = await params;

        let collection = await Collection.findById(collectionId)

        const { title, description, image } = await req.json()

        if (!title || !image || image.length === 0) {
            return new NextResponse("Title and image are required", {status: 400})
        }

        collection = await Collection.findByIdAndUpdate(collectionId, {title, description, image}, {new: true})

        collection.save()

        return NextResponse.json(collection, {status: 200})
    } catch (err) {
        console.log("[collectionId_POST", err)
        return new NextResponse("InternalServerError", {status: 500})
    }
}

export async function DELETE(req: NextRequest, {params}: {params: Promise<{collectionId: string}>}) {
    try {
        const {userId} = await auth()

        if (!userId) {
            return new NextResponse("Unauthorized", {status: 401})
        }

        await connectToDB()

        const {collectionId} = await params;

        await Collection.findByIdAndDelete(collectionId)

        await Product.updateMany(
            {collections: collectionId}, // finds every product whose collections have collectionId
            {$pull: {collections: collectionId}}, // remove it fromt eh array that it was found
        )
        return new NextResponse("Collection is deleted", {status: 200})
    } catch (err) {
        console.log("[collectionId_DELETE", err)
        return new NextResponse("InternalServerError", {status: 500})
    }
}