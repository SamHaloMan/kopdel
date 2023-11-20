import type { NextApiRequest, NextApiResponse } from 'next';
import multer from 'multer';
import prisma from 'lib/prisma';

// Set up multer for file uploading
const upload = multer({ dest: 'uploads/' })

export default function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    if (req.method === 'POST') {
        // Process the file upload
        upload.single('image')(req, res, async (err) => {
            if (err) {
                return res.status(500).json({ message: 'File upload failed', err })
            }

            // Save the image URL to the database
            const file = req.file
            // Assuming `file.path` is the URL of the uploaded image
            const image = await prisma.image.create({
                data: {
                    url: file.path,
                    // Set the other fields as needed
                },
            })

            res.status(200).json({ message: 'Image uploaded successfully', image })
        })
    } else {
        res.status(405).json({ message: 'Method Not Allowed' })
    }
}
