"use client"

import React, { useState } from 'react'
import { Trash } from 'lucide-react'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Button } from '../ui/button'
import toast from 'react-hot-toast'

interface DeleteProps{
  id: string
}

const Delete = ({id}: DeleteProps) => {
  const [loading, setLoading] = useState(false)

  const onDelete = async () => {
    try {
      setLoading(true)
      const res = await fetch(`/api/collections/${id}`, {
        method: "DELETE",
      })

      if (res.ok) {
        setLoading(false)
        window.location.href = ("/collections")
        toast.success("Collection deleted.")
      }
    } catch (err) {
      console.log(err)
      toast.error("Something went wrong, please try again.")
    }
  }
  return (
    <AlertDialog>
    <AlertDialogTrigger asChild>
      <Button className="bg-red-1 text-white"> 
        <Trash className="h-4 w-4" />
      </Button>
    </AlertDialogTrigger>
    <AlertDialogContent className="bg-white text-brown-1">
      <AlertDialogHeader>
        <AlertDialogTitle className="text-red-1">Are you absolutely sure?</AlertDialogTitle>
        <AlertDialogDescription>
          This action cannot be undone. This will permanently delete your collection and remove your data from our servers.
        </AlertDialogDescription>
      </AlertDialogHeader>
      <AlertDialogFooter>
        <AlertDialogCancel>Cancel</AlertDialogCancel>
        <AlertDialogAction className="bg-red-1 text-white" onClick={onDelete}>Continue</AlertDialogAction>
      </AlertDialogFooter>
    </AlertDialogContent>
  </AlertDialog>
  )
}

export default Delete