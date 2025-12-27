"use client";

import { Button } from "@/components/ui/button"
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Separator } from '../ui/separator'
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"

import { z } from "zod"
import { Textarea } from "../ui/textarea";
import ImageUpload from "../custom ui/imageUpload";
import { useRouter } from "next/navigation";
import { useState } from "react";
import toast from "react-hot-toast";
import Delete from "../custom ui/Delete";


// zod schema , defines the rules that real data and input must follow
const formSchema = z.object({
    title: z.string().min(2).max(20),
    description: z.string().min(2).max(500).trim(),
    image: z.array(z.string()),
})

interface CollectionFormProps {
    initialData?: CollectionType | null;
}

// form controller to handle submission
const CollectionForm: React.FC<CollectionFormProps> = ( {initialData }) => {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema), // connect zod to react
        defaultValues: initialData ? initialData : {
            title: "",
            description: "",
            image: [],
        },
    })

    const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement> | React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.key === "Enter") {
            e.preventDefault();
        }
    }

    // make a new collection upon submission
    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        try {
            setLoading(true)
            const url = initialData? `/api/collections/${initialData._id}` : "/api/collections"
            const res = await fetch(url, {
                method: "POST",
                body: JSON.stringify(values),
            });

            if (res.ok) {
                setLoading(false);
                window.location.href = "/collections"; 
                router.push("/collections");
                toast.success(`Collection ${initialData ? "updated" : "created"}`);
            } else {
                toast.error("Something went wrong, please try again. Title and image are required")
            }
        } catch (err) {
            console.log("[Collection_POST]", err);
            toast.error("Something went wrong, please try again.")
        }
    }

    {/* shadcn ui components */}
    return (
        <div className="p-10">
            {/* 
                check if we're editing or creating a new collection
                editing prefills in the fields 
            */}
            {initialData ? (
                <div className="flex items-center justify-between">
                    <p className="text-heading2-bold">Edit Collection</p>
                    <Delete id={initialData!._id} />
                </div>
            ) : (
            <p className="text-heading2-bold">Create Collection</p>
            )}
            <Separator className="bg-brown-1 mt-4 mb-7" />

            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                    <FormField
                        control={form.control}
                        name="title"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Title</FormLabel>
                                <FormControl>
                                    <Input placeholder="Title" {...field} onKeyDown={handleKeyPress} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="description"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Description</FormLabel>
                                <FormControl>
                                    <Textarea placeholder="Description" {...field} onKeyDown={handleKeyPress} rows={5} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="image"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Image</FormLabel>
                                <FormControl>
                                    {/* onChange and onRemove are defined here 
                                    onChange: update the value array to include the new image url
                                    onRemove: remove the image from the array value
                                    */}
                                    <ImageUpload value={Array.isArray(field.value) ? field.value : []} onChange={(images) => field.onChange(images)}
                                        onRemove={(url) => field.onChange(
                                            field.value.filter((img: string) => img !== url)
                                        )} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <div className="flex gap-10">
                        <Button type="submit" className="bg-blue-2 text-white">Submit</Button>
                        <Button type="button" className="bg-red-2 text-white" onClick={() => router.push("/collections")}>Discard</Button>
                    </div>
                </form>
            </Form>
        </div>
    )
}

export default CollectionForm