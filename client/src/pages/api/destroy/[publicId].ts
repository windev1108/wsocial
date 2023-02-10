import { NextApiRequest, NextApiResponse } from 'next';
import cloudinary from 'cloudinary';

cloudinary.v2.config({
    cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUDNAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

export default function assetDestroyer(
    req: NextApiRequest,
    res: NextApiResponse
) {
    if (req.method === 'POST') {
        cloudinary.v2.uploader.destroy(
            req.query.publicId as string,
            (error: any, result: any) => {
                if (error) {
                    res.status(404).json({ message: error.message });
                } else {
                    res.status(200).json({ message: result });
                }
            }
        );
    } else {
        res.setHeader('Allow', ['GET', 'PUT']);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}
