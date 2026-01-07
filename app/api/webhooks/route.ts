export const runtime = "nodejs";

import Customer from "@/lib/models/Customer";
import Order from "@/lib/models/Order";
import { connectToDB } from "@/lib/mongoDB";
import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

// webhook endpoint for stripe, upon successful or unsuccessful checkout

export const stripe = new Stripe(process.env.NEXT_PUBLIC_STRIPE_SECRET_KEY!, {
    typescript: true,
});

export const POST = async (req: NextRequest) => {
    try {
        const rawBody = await req.text() 
        const signature = req.headers.get("Stripe-Signature") as string;

        // need raw request for correct signature verification
        const event = stripe.webhooks.constructEvent(
            rawBody, 
            signature,
            process.env.STRIPE_WEBHOOK_SECRET!,
        )

        if (event.type === "checkout.session.completed") {
            const session = event.data.object as Stripe.Checkout.Session;

            // stripe already providers customer and shipping info automatically
            const customerInfo = {
                clerkId: session.client_reference_id,
                name: session?.customer_details?.name,
                email: session?.customer_details?.email,

            }

            const shippingAddress = {
                street: session?.customer_details?.address?.line1,
                city: session?.customer_details?.address?.city,
                state: session?.customer_details?.address?.state,
                postalCode: session?.customer_details?.address?.postal_code,
                country: session?.customer_details?.address?.country,
            }
            
            // now get all the product data
            // first retrieve all of what stripe provides in a session
            const retrieveSession = await stripe.checkout.sessions.retrieve(
                session.id,
                {expand : ["line_items.data.price.product"]}
            )

            // get the products that the customer bought
            const lineItems = await retrieveSession?.line_items?.data

            const orderItems = lineItems?.map((lineItem: any) => {
                return {
                    product: lineItem.price.product.metadata.productsId,
                    option: lineItem.price.product.metadata.option || "N/A",
                    quantity: lineItem.quantity
                }
            })

            // store everything in the db
            await connectToDB()

            const newOrder = new Order({
                customerClerkId: customerInfo.clerkId,
                products: orderItems,
                shippingAddress,
                shippingRate: session.shipping_cost?.shipping_rate,
                totalAmount: session.amount_total ? session.amount_total / 100 : 0,
            })

            let customer = await Customer.findOne({ clerkId: customerInfo.clerkId })

            // if customer exists, update their orders array. otherwise create a new customer
            if (customer) {
                customer.orders.push(newOrder._id)
                await customer.save()
            } else {
                customer = new Customer({
                    ...customerInfo,
                    orders: [newOrder._id],
                })

                await customer.save()
            }
        }
        return new NextResponse("Order Created", {status: 200})
    } catch (err) {
        console.log("[webhook_POST", err);
        return new NextResponse("Failed to create the order.", { status: 500 });
    }
}