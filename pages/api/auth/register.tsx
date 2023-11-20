import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

export default async function handler(req, res) {
    if (req.method === 'POST') {
        const { nickname, email, password } = req.body;

        const hashedPassword = bcrypt.hashSync(password, 10);
        const user = await prisma.user.create({
            data: {
                nickname,
                email,
                password: hashedPassword,
                role: 'CONSUMEN',
            },
        });

        res.status(200).json({ id: user.id, email: user.email, nickname: user.nickname });
    } else {
        res.status(405).json({ message: 'Method not allowed' });
    }
}
