"use client"

import CollectionForm from '@/components/collection/CollectionForm'
import Loader from '@/components/custom ui/Loader'
import React, { useEffect, useState } from 'react'

const CollectionDetails = ({params} : {params: {collectionId: string}}) => {
    const [loading, setLoading] = useState(true)
    const [collectionDetails, setCollectionDetails] = useState<CollectionType | null>(null)

    const getCollectionDetails = async () => {
        try {
            const {collectionId} = await params;
            const res = await fetch(`/api/collections/${collectionId}`, {
                method: "GET"
            })
            const data = await res.json();
            setCollectionDetails(data);
            setLoading(false);
        } catch (err) {
            console.log("[collectionId_GET]", err)
        }
    }

    useEffect(() => {
        getCollectionDetails()
    }, [])

    return loading ? <Loader /> : (
        <CollectionForm initialData={collectionDetails} />
    )
}

export default CollectionDetails