import { DataTable } from '@/components/custom ui/DataTable'
import { columns } from '@/components/orderItems/OrdrItemsColumns'
import React from 'react'

const OrderDetails = async ({params}: {params: Promise<{orderId: string}>}) => {
    const {orderId} = await params
    const res = await fetch(`https://localhost:3000/api/orders/${orderId}`)

    const {orderDetails, customer} = await res.json()

    const {street, city, state,  postalCode, country } = orderDetails.shippingAddress
  return (
    <div className="flex flex-col p-10 gap-5">
        <p>
            Order ID: <span>{orderDetails._id}</span>
        </p>
        <p>
            Customer Name: <span>{customer.name}</span>
        </p>
        <p>
            Shipping Address: <span>{street}, {city}, {state}, {postalCode}, {country}</span>
        </p>
        <p>
            Total paid: <span>${orderDetails.totalAmount}</span>
        </p>
        <p>
            Shipping Rate ID: <span>{orderDetails.shippingRate}</span>
        </p>

        <DataTable columns={columns} data={orderDetails.products} searchKey="product" />
    </div>
  )
}

export default OrderDetails