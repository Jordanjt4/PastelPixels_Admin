import mongoose from "mongoose";

let isConnected: boolean = false;

// only lets one connection with the DB

export const connectToDB = async (): Promise<void> => {
    mongoose.set("strictQuery", true)

    if (isConnected) {
        console.log("MongoDB is already connected")
        return;
    }

    try {
        await mongoose.connect(process.env.MONGODB_URL || "", {
            dbName: "PastelPixels_Admin"
        })

        isConnected = true;
        console.log("mongoDB is connected")
    } catch (err) {
        console.log(err)
    }
}