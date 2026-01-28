import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
const prisma = new PrismaClient();
describe('User Model', () => {
    beforeAll(async () => {
        // Cleanup
        await prisma.user.deleteMany({ where: { email: 'test@example.com' } });
    });
    afterAll(async () => {
        // Cleanup
        await prisma.user.deleteMany({ where: { email: 'test@example.com' } });
        await prisma.$disconnect();
    });
    it('should create a new user with hashed password', async () => {
        const email = 'test@example.com';
        const password = 'password123';
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await prisma.user.create({
            data: {
                email,
                password: hashedPassword
            }
        });
        expect(user).toHaveProperty('id');
        expect(user.email).toBe(email);
        expect(user.password).not.toBe(password); // Should be hashed
        const isMatch = await bcrypt.compare(password, user.password);
        expect(isMatch).toBe(true);
    });
});
//# sourceMappingURL=user.test.js.map