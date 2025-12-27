import { CldUploadWidget } from 'next-cloudinary';
import { Plus, Trash } from 'lucide-react';

import { Button } from '../ui/button';
import Image from 'next/image';

// props that it's allowed to receive
interface ImageUploadProps{
    value: string[];
    onChange: (value: string[]) => void;
    onRemove: (url: string) => void;
}

// functional components return UI 
// props are the arguments to functional components

// calls onChange and onRemove defined in the parent and re-renders everything here

export const ImageUpload: React.FC<ImageUploadProps> = ({onChange, onRemove, value}) => {
    const onUpload = (result: any) => {
        // call onChange to add the new image's url 
        onChange([...value, result.info.secure_url]);
    }

    return (
        <div>
            <div className="mb-4 flex flex-wrap items-center gap-4">
                {value.map((url) => (
                    <div key={url} className="relative w-48 h-48">
                        <div className="absolute top-0 right-0 z-10">
                            <Button type="button" onClick={() => onRemove(url)} size="sm" className="bg-red-1 text-white">
                                <Trash className="h-4 w-4" />
                            </Button>
                        </div>
                        <Image src={url} alt="collection" className="object-cover rounded-lg" fill/>
                    </div>
                ))}
            </div>
            <CldUploadWidget uploadPreset="pastelpixels_admin" onSuccess={onUpload}>
                {/* Cloudinary gives us "open" function, so it wants a function that determines what UI and when to call open*/}
                {({ open }) => {
                    return (
                    <Button type="button" className="bg-brown-1 text-white" onClick={() => open()}>
                        <Plus className="h-4 w-4 mr-2"/>
                        Upload Image
                    </Button>
                    );
                }}
            </CldUploadWidget>
        </div>
        
    )
}

export default ImageUpload;