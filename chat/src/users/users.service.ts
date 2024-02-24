import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class UsersService {

    constructor(private readonly prisma: PrismaService) {}

    async getAllUsers() {
        return this.prisma.user1.findMany();
    }

    async getUserById(userId: number)
    {
        return this.prisma.user1.findUnique({
            where: {id: userId},
        });
    }

    async createUser(userData: any)
    {
        return this.prisma.user1.create({
            data: userData,
        });
    }

    async updateUser(userId: number, userData: any)
    {
        return this.prisma.user1.update({
            where: {id: userId},
            data: userData,
        });
    }

    async deleteUser(userId: number)
    {
        return this.prisma.user1.delete({
            where: {
                id: userId,
            }
        })
    }
}
