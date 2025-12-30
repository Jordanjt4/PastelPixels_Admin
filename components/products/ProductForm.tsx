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
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import Delete from "../custom ui/Delete";
import MultiText from "../custom ui/MultiText";
import MultiSelect from "../custom ui/MultiSelect";
import Loader from "../custom ui/Loader";


// zod schema , defines the rules that real data and input must follow
const formSchema = z.object({
    title: z.string().min(2).max(20),
    description: z.string().min(2).max(500).trim(),
    media: z.array(z.string()),
    category: z.string(),
    collections: z.array(z.string()),
    tags: z.array(z.string()),
    options: z.array(z.string()),
    price: z.number().min(0.1),
    expense: z.number().min(.01)
})

// describes the type of props that the component accepts
interface ProductFormProps {
    initialData?: ProductType | null;
}

// form controller to handle submission
const ProductForm: React.FC<ProductFormProps> = ( {initialData}) => {
    const router = useRouter();
    const [loading, setLoading] = useState(true);

    const [collections, setCollections] = useState<CollectionType[]>([]);

    const getCollections = async () => {
        try {
        const res = await fetch("/api/collections", {
            method: "GET",
        });
        const data = await res.json();
        setCollections(data);
        setLoading(false);
        } catch (err) {
        console.log("[collections_GET]", err);
        toast.error("Something went wrong! Please try again.");
        }
    };

    useEffect(() => {
        getCollections();
    }, []);
    
    const form = useForm<z.infer<typeof formSchema>>({
        
        resolver: zodResolver(formSchema), // connect zod to react
        defaultValues: initialData
        ? {
            ...initialData,
            media: initialData.media ?? [],
            tags: initialData.tags ?? [],
            options: initialData.options ?? [],
            collections: initialData.collections?.map(c => c._id) ?? [],
            }
        : {
            title: "",
            description: "",
            media: [],
            category: "",
            collections: [],
            tags: [],
            options: [],
            price: 0.1,
            expense: 0.1,
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
            const url = initialData? `/api/products/${initialData._id}` : "/api/products"
            const res = await fetch(url, {
                method: "POST",
                body: JSON.stringify(values),
            });

            if (res.ok) {
                setLoading(false);
                window.location.href = "/products"; 
                router.push("/products");
                toast.success(`Product ${initialData ? "updated" : "created"}`);
            } else {
                toast.error("Something went wrong, please try again. Title and image are required")
            }
        } catch (err) {
            console.log("[products_POST]", err);
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
                    <p className="text-heading2-bold">Edit Products</p>
                    <Delete item="product" id={initialData!._id} />
                </div>
            ) : (
            <p className="text-heading2-bold">Create Product</p>
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
                        name="media"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Image</FormLabel>
                                <FormControl>
                                    {/* onChange and onRemove are defined here 
                                    onChange: update the value array to include the new image url
                                    onRemove: remove the image from the array value
                                    */}
                                    <ImageUpload
                                        value={field.value ?? []}
                                        onChange={field.onChange} 
                                        onRemove={(url) =>
                                            field.onChange(
                                            (field.value ?? []).filter((img) => img !== url)
                                            )
                                        }
                                        />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <div className="flex gap-8">
                        <div className="flex-1">
                            <FormField
                                control={form.control}
                                name="price"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Price ($)</FormLabel>
                                        <FormControl>
                                            <Input type="number" placeholder="Price ($)" {...field} 
                                            value={field.value ?? ""} 
                                            onKeyDown={handleKeyPress} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>
                        <div className="flex-1">
                            <FormField
                                control={form.control}
                                name="expense"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Expense</FormLabel>
                                        <FormControl>
                                            <Input type="number" placeholder="Expense ($)" {...field} onKeyDown={handleKeyPress} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>
                        <div className="flex-1">
                            <FormField
                                control={form.control}
                                name="category"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Category</FormLabel>
                                        <FormControl>
                                            <Input placeholder="Category" {...field} onKeyDown={handleKeyPress} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>
                    </div>
                    <div className="flex-1">
                        <FormField
                            control={form.control}
                            name="tags"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Tags</FormLabel>
                                    <FormControl>
                                        <MultiText placeholder="Tags" value={field.value} 
                                        onChange={(tag) => {
                                            if (!tag) return
                                            field.onChange([...(field.value ?? []), tag])
                                            }}
                                        onRemove={(tagToRemove) => field.onChange(
                                        field.value.filter((item: string) => item !== tagToRemove)
                                        )}/>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>
                    <div className="flex-1">
                        <FormField
                            control={form.control}
                            name="collections"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Collections</FormLabel>
                                    <FormControl>
                                        <MultiSelect placeholder="Collections" collections={collections} value={field.value} 
                                        onChange={(tag) => {
                                            if (!tag) return
                                            field.onChange([...(field.value ?? []), tag])
                                            }}
                                        onRemove={(idToRemove) => field.onChange(
                                        field.value.filter((collectionId: string) => collectionId !== idToRemove)
                                        )}/>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>
                    <div className="flex-1">
                        <FormField
                            control={form.control}
                            name="options"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Options</FormLabel>
                                    <FormControl>
                                        <MultiText placeholder="Options" value={field.value} onChange={(option) => field.onChange([...field.value, option])}
                                        onRemove={(optionToRemove) => field.onChange(
                                        field.value.filter((option: string) => option !== optionToRemove)
                                        )}/>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>
                    <div className="flex gap-10">
                        <Button type="submit" className="bg-blue-2 text-white">Submit</Button>
                        <Button type="button" className="bg-red-2 text-white" onClick={() => router.push("/collections")}>Discard</Button>
                    </div>
                </form>
            </Form>
        </div>
    )
}

export default ProductForm