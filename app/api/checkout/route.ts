import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';

export const stripe = new Stripe(process.env.NEXT_PUBLIC_STRIPE_SECRET_KEY!, {
    typescript: true,
})

const corsHeader = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

export async function OPTIONS() {
    return NextResponse.json({}, {headers: corsHeader})
}

export async function POST(req: NextRequest) {
    try {
        const {cartItems, customer} = await req.json();

        if(!cartItems || !customer) {
            return new NextResponse("Not enough data to checkout", {status: 400})
        }

        const session = await stripe.checkout.sessions.create({
            payment_method_types: ["card"],
            mode: "payment",
            shipping_address_collection: {
                allowed_countries: ['US', 'CA',],
            },
            shipping_options: [
                {shipping_rate: "shr_1SlLczBCgyzRXV7Zvhpb9AOe"},
                {shipping_rate: "shr_1SlLdRBCgyzRXV7ZZ8sQx7dQ"},
                {shipping_rate: "shr_1SlLdpBCgyzRXV7ZplTBcHx1"}
            ],
            line_items: cartItems.map((cartItem: any) => ({
                price_data: {
                    currency: "usd",
                    product_data: {
                        name: cartItem.item.title,
                        metadata: {
                            productsId: cartItem.item._id,
                            ...(cartItem.option && {option: cartItem.option}),
                        },
                    },
                    unit_amount: cartItem.item.price * 100,
                },
                quantity: cartItem.quantity,
            })),
            client_reference_id: customer.clerkId,
            success_url: `${process.env.PASTELPIXELS_URL}/payment_success`,
            cancel_url: `${process.env.PASTELPIXELS_URL}/cart`
        });

        return NextResponse.json(session, {headers: corsHeader})

    } catch (err) {
        console.log("[checkout_POST]", err)
        return new NextResponse("Internal Server Error", {status: 500})
    }
}