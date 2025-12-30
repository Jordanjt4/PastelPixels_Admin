import Collection from "@/lib/models/Collections";
import Product from "@/lib/models/Products";
import { connectToDB } from "@/lib/mongoDB";
import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";

export const POST = async (req: NextRequest) => {
    try {
        const { userId } = await auth();

        if (!userId) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        await connectToDB();

        const { title, description, media, category, collections, tags, options, price, expense } = await req.json();

        if (!title || !description || media.length === 0 || !price || !expense) {
            return new NextResponse("Title, description, price, expense, and at least one picture required", { status: 400 });
        }

        const newProduct = await Product.create({
            title,
            description,
            media,
            category,
            collections,
            tags,
            options,
            price,
            expense
        });

        await newProduct.save();

        // loop through all collections product is part of, and add product id to that collection's product array
        // links product to multiple collections
        if (collections) {
            for (const collectionId of collections) {
                const collection = await Collection.findById(collectionId);
                if (collection) {
                    collection.products.push(newProduct._id)
                    await collection.save();
                }
            }
        }

        return NextResponse.json(newProduct, { status: 200 });
    } catch (err) {
        console.log("[products_POST", err);
        return new NextResponse("Internal Error", { status: 500 });
    }
}

export const GET = async (req: NextRequest) => {
    try {
        await connectToDB();

        const products = await Product.find().sort({ createdAt: "desc" }).populate({ path: "collections", model: Collection });

        return NextResponse.json(products, { status: 200 });
    } catch (err) {
        console.log("products_GET", err);
        return new NextResponse("Internal Error", { status: 500 })
    }
}