import axios from 'axios';
import { File } from './types';
import { toast } from 'react-hot-toast';

export const Viewers = ['Public', 'Friends', 'Private'];

export const formatFirstUppercase = (str: string) => {
    return str?.charAt(0)?.toUpperCase() + str?.toLowerCase()?.slice(1);
};

export const uploadMultiple = async (files: any[]) => {
    const promises = Array.from(files).map(async (file) => {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('upload_preset', 'my-uploads');
        const { data } = await axios.post(
            `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUDNAME
            }/${file.type.includes('video') ? 'video' : 'image'}/upload`,
            formData
        );
        return {
            url: data.url,
            type: file.type,
            publicId: data.public_id,
        };
    });
    return await Promise.all(promises);
};

export const destroyMultiple = async (files: File[]) => {
    const results = files.map(async (file) => {
        const result = await axios.post(`/api/destroy/${file.publicId}`);
        return {
            result,
        };
    });

    return await Promise.all(results);
};

export const destroySingle = async (file: File) => {
    const result = await axios.post(`/api/destroy${file.publicId}`)
    return result
}

export const invalidAction = () => {
    toast.error("Invalid action")
}

export const sleep = (cb: any = 3000 ,ms: number) => {
    setTimeout(() => cb(),ms)
}