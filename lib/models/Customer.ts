import mongoose from "mongoose";

const CustomerSchema = new mongoose.Schema({
    clerkId: String,
    name: String,
    email: String,
    orders: {
        type: [mongoose.Schema.Types.ObjectId],
        ref: "Order",
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
})

const Customer = mongoose.models.Customer || mongoose.model("Customer", CustomerSchema);

export default Customer;
