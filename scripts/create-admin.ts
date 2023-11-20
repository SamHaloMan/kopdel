import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function createAdminUser() {
    const email = 'admin@example.com';
    const password = 'admin'; 

    try {
        const hashedPassword = bcrypt.hashSync(password, 10);
        const adminUser = await prisma.user.create({
            data: {
                id: 1,
                email,
                password: hashedPassword,
                role: 'ADMIN',
                nickname: 'administrator',
                balance: 100000,
            },
        });

        console.log('Admin user created:', adminUser);
    } catch (error) {
        console.error('Error creating admin user:', error);
    } finally {
        await prisma.$disconnect();
    }
}

createAdminUser();
