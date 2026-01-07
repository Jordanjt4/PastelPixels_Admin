"use client";

import { DataTable } from '@/components/custom ui/DataTable';
import { columns } from '@/components/customers/CustomerColumn';
import { Separator } from '@/components/ui/separator';
import Customer from '@/lib/models/Customer';
import { connectToDB } from '@/lib/mongoDB'
import React, { useEffect, useState } from 'react'

const Customers = () => {
    const [loading, setLoading] = useState(true)
    const [customers, setCustomers] = useState([])

    const getCustomers = async () => {
        try {
            const res = await fetch("/api/customers")
            const orders = await res.json()
            setCustomers(orders)
            setLoading(false)
        } catch (err) {
            console.log("[orders_GET]", err)
        }
        
    }

    useEffect(() => {
        getCustomers()
    }, [])

    return (
        <div className="px-10 py-5">
            <p>Customers</p>
            <Separator />
            <DataTable columns={columns} data={customers} searchKey="name" />
        </div>
    )
}

export default Customers